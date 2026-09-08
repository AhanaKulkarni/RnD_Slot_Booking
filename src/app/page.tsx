import { auth } from '@/auth';
import { getDailyOccupancy } from '@/lib/capacity-engine';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import HomeClient from '@/components/home/HomeClient';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await auth();
  const room = await prisma.room.findUnique({ where: { roomNumber: '414' } });

  const sp = await searchParams;
  const selectedDateStr = sp?.date || new Date().toISOString().split('T')[0];
  const selectedDate = new Date(selectedDateStr);

  const occupancySlots = room ? await getDailyOccupancy(room.id, selectedDate) : [];

  const formattedDate = format(selectedDate, 'EEEE, MMM dd, yyyy');
  const prevDate = format(new Date(selectedDate.getTime() - 86400000), 'yyyy-MM-dd');
  const nextDate = format(new Date(selectedDate.getTime() + 86400000), 'yyyy-MM-dd');

  return (
    <HomeClient 
      session={session} 
      room={room} 
      occupancySlots={occupancySlots} 
      formattedDate={formattedDate}
      prevDate={prevDate}
      nextDate={nextDate}
    />
  );
}
