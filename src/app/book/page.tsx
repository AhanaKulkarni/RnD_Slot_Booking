import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import BookingForm from '@/components/booking/booking-form';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function BookPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/dashboard');
  if (session.user.edicStatus !== 'ACTIVE') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">!</div>
          <h1 className="text-2xl font-bold">Booking Restricted</h1>
          <p className="text-gray-600">Booking access is restricted to active EDIC members.</p>
          <Link href="/dashboard" className="block pt-4">
            <Button className="w-full">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const room = await prisma.room.findUnique({ where: { roomNumber: '414' } });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-900 text-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-blue-200 hover:text-white">
            &larr; Back
          </Link>
          <div>
            <h1 className="text-xl font-bold">Book R&D Cell 414</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <BookingForm roomId={room?.id || ''} leaderName={session.user.name || ''} leaderId={session.user.id || ''} />
      </main>
    </div>
  );
}
