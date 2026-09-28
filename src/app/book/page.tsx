import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import BookingForm from '@/components/booking/booking-form';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const neuRaised = "bg-[#e0e5ec] shadow-[8px_8px_16px_#c8d0e7,-8px_-8px_16px_#ffffff] rounded-2xl";
const neuPressed = "bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#c8d0e7,inset_-6px_-6px_12px_#ffffff] rounded-2xl";

export default async function BookPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/dashboard');
  
  if (session.user.edicStatus !== 'ACTIVE') {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center p-6 text-slate-700 font-sans">
        <div className={`p-10 max-w-md w-full text-center space-y-6 ${neuRaised}`}>
          <div className={`w-20 h-20 mx-auto flex items-center justify-center text-red-500 rounded-full ${neuPressed}`}>
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Booking Restricted</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Booking access is strictly restricted to verified EDIC members.
          </p>
          <Link href="/dashboard" className="block pt-6">
            <button className={`w-full py-4 text-blue-600 font-bold ${neuRaised} hover:shadow-[4px_4px_8px_#c8d0e7,-4px_-4px_8px_#ffffff] transition-all`}>
              Return to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const room = await prisma.room.findUnique({ where: { roomNumber: '414' } });

  return (
    <div className="min-h-screen bg-[#e0e5ec] flex flex-col font-sans text-slate-700">
      
      <header className="px-6 md:px-12 py-8 flex items-center gap-6">
        <Link href="/dashboard" className={`w-12 h-12 flex items-center justify-center text-slate-500 hover:text-blue-500 ${neuRaised} hover:shadow-[4px_4px_8px_#c8d0e7,-4px_-4px_8px_#ffffff] transition-all`}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Book R&D Cell 414</h1>
          <p className="text-slate-500 font-medium">Configure your session details</p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pb-20">
        <BookingForm roomId={room?.id || ''} leaderName={session.user.name || ''} leaderId={session.user.id || ''} />
      </main>
    </div>
  );
}
