'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { checkCapacity as engineCheck } from '@/lib/capacity-engine';
import { revalidatePath } from 'next/cache';

export async function checkAvailability(roomId: string, date: string, startTime: string, endTime: string, peopleCount: number) {
  // Add a slight delay just for UX so user sees "checking..."
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const parsedDate = new Date(date);
  return await engineCheck(roomId, parsedDate, startTime, endTime, peopleCount);
}

export async function createBooking(roomId: string, data: any) {
  const session = await auth();
  if (!session?.user) return { success: false, error: 'Not authenticated' };
  if (session.user.edicStatus !== 'ACTIVE') return { success: false, error: 'Not authorized. Must be active EDIC member.' };

  const parsedDate = new Date(data.date);
  
  // ATOMIC CAPACITY CHECK & CREATION
  // Prisma doesn't have an easy way to lock rows without raw SQL for SQLite,
  // but since SQLite write transactions serialize naturally, we do this inside a $transaction.
  
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check capacity again within transaction
      const room = await tx.room.findUnique({ where: { id: roomId } });
      if (!room) throw new Error('Room not found');

      const existingBookings = await tx.booking.findMany({
        where: {
          roomId,
          date: {
            gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
            lte: new Date(parsedDate.setHours(23, 59, 59, 999)),
          },
          status: { in: ['CONFIRMED', 'ACTIVE'] },
        },
      });

      const events = [];
      for (const b of existingBookings) {
        events.push({ time: b.startTime, change: b.peopleCount });
        events.push({ time: b.endTime, change: -b.peopleCount });
      }
      events.push({ time: data.startTime, change: data.peopleCount });
      events.push({ time: data.endTime, change: -data.peopleCount });

      events.sort((a, b) => {
        if (a.time === b.time) return a.change - b.change;
        return a.time.localeCompare(b.time);
      });

      let currentOccupancy = 0;
      for (const event of events) {
        currentOccupancy += event.change;
        if (currentOccupancy > room.capacity) {
          throw new Error('Capacity exceeded during this time slot.');
        }
      }

      // 2. Generate Booking ID (e.g. RND-414-260908-0047)
      const dateStr = parsedDate.toISOString().slice(2,10).replace(/-/g, '');
      const countToday = await tx.booking.count({
        where: {
          roomId,
          date: {
            gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
            lte: new Date(parsedDate.setHours(23, 59, 59, 999)),
          }
        }
      });
      const seq = (countToday + 1).toString().padStart(4, '0');
      const bookingId = `RND-${room.roomNumber}-${dateStr}-${seq}`;

      // Calculate duration
      const [sh, sm] = data.startTime.split(':').map(Number);
      const [eh, em] = data.endTime.split(':').map(Number);
      const durationMinutes = (eh * 60 + em) - (sh * 60 + sm);

      // 3. Create Booking
      const newBooking = await tx.booking.create({
        data: {
          bookingId,
          roomId,
          groupLeaderId: session.user.id!,
          date: parsedDate,
          startTime: data.startTime,
          endTime: data.endTime,
          durationMinutes,
          peopleCount: data.peopleCount,
          purpose: data.purpose,
          projectName: data.projectName,
          description: data.description,
          status: 'CONFIRMED',
          members: {
            create: data.members.map((m: any) => ({
              name: m.name,
              studentId: m.studentId,
            }))
          }
        }
      });

      return newBooking;
    });

    revalidatePath('/dashboard');
    revalidatePath('/');
    
    return { success: true, bookingId: result.bookingId };

  } catch (e: any) {
    return { success: false, error: e.message || 'An error occurred during booking.' };
  }
}
