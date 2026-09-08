import { prisma } from './prisma';

export interface TimeEvent {
  time: string; // HH:mm
  change: number; // positive for arrival, negative for departure
}

/**
 * Checks if a proposed booking exceeds room capacity at any point during its duration.
 */
export async function checkCapacity(
  roomId: string,
  date: Date,
  proposedStartTime: string,
  proposedEndTime: string,
  proposedPeopleCount: number,
  excludeBookingId?: string
): Promise<{ isValid: boolean; maxOccupancy: number; conflictingInterval?: string }> {
  
  // 1. Fetch Room Capacity
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) throw new Error('Room not found');
  const capacity = room.capacity;

  // 2. Fetch all active/confirmed bookings for that date
  const existingBookings = await prisma.booking.findMany({
    where: {
      roomId,
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
      status: {
        in: ['CONFIRMED', 'ACTIVE'],
      },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {})
    },
  });

  // 3. Create Events Array
  const events: TimeEvent[] = [];

  for (const b of existingBookings) {
    events.push({ time: b.startTime, change: b.peopleCount });
    events.push({ time: b.endTime, change: -b.peopleCount });
  }

  // Add proposed booking
  events.push({ time: proposedStartTime, change: proposedPeopleCount });
  events.push({ time: proposedEndTime, change: -proposedPeopleCount });

  // 4. Sort Events
  // Sort by time ascending. 
  // If time is equal, process departures (change < 0) BEFORE arrivals (change > 0).
  events.sort((a, b) => {
    if (a.time === b.time) {
      return a.change - b.change; 
    }
    return a.time.localeCompare(b.time);
  });

  // 5. Evaluate Occupancy
  let currentOccupancy = 0;
  let maxOccupancy = 0;
  let conflictingInterval = undefined;

  for (const event of events) {
    currentOccupancy += event.change;
    if (currentOccupancy > maxOccupancy) {
      maxOccupancy = currentOccupancy;
    }
    if (currentOccupancy > capacity) {
      return { 
        isValid: false, 
        maxOccupancy,
        conflictingInterval: event.time // approx time of conflict
      };
    }
  }

  return { isValid: true, maxOccupancy };
}

/**
 * Calculates current available capacity for a specific interval.
 */
export async function getAvailableCapacity(
  roomId: string,
  date: Date,
  startTime: string,
  endTime: string
): Promise<number> {
  const result = await checkCapacity(roomId, date, startTime, endTime, 0);
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  return Math.max(0, (room?.capacity || 21) - result.maxOccupancy);
}

/**
 * Gets a map of time slots and their occupancies for a given date
 */
export async function getDailyOccupancy(roomId: string, date: Date) {
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) return [];

  const existingBookings = await prisma.booking.findMany({
    where: {
      roomId,
      date: {
        gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
      },
      status: {
        in: ['CONFIRMED', 'ACTIVE'],
      },
    },
  });

  // Create 30 min intervals from openTime to closeTime
  const slots = [];
  let current = parseTime(room.openTime);
  const end = parseTime(room.closeTime);

  while (current < end) {
    const next = current + 30; // 30 min increments
    const slotStart = formatTime(current);
    const slotEnd = formatTime(next);

    // Calculate occupancy for this slot
    let occupancy = 0;
    for (const b of existingBookings) {
      const bStart = parseTime(b.startTime);
      const bEnd = parseTime(b.endTime);
      
      // If booking overlaps with this slot
      if (bStart < next && bEnd > current) {
        occupancy += b.peopleCount;
      }
    }

    slots.push({
      startTime: slotStart,
      endTime: slotEnd,
      occupancy,
      capacity: room.capacity,
      available: room.capacity - occupancy,
      isFull: occupancy >= room.capacity,
    });

    current = next;
  }

  return slots;
}

// Helpers
function parseTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}
