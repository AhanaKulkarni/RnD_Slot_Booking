import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import BookingForm from '@/components/booking/booking-form';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket, ShieldAlert } from 'lucide-react';

export default async function BookPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/dashboard');
  
  if (session.user.edicStatus !== 'ACTIVE') {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center p-4 selection:bg-cyan-500/30">
        <div className="bg-[#16161E] p-8 rounded-3xl shadow-2xl border border-red-500/20 max-w-md w-full text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[80px] pointer-events-none" />
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold font-serif text-white tracking-wide">Launch Denied</h1>
          <p className="text-zinc-400 font-serif">Booking access is strictly restricted to verified EDIC innovators.</p>
          <Link href="/dashboard" className="block pt-6">
            <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-full font-bold">Return to Command</Button>
          </Link>
        </div>
      </div>
    );
  }

  const room = await prisma.room.findUnique({ where: { roomNumber: '414' } });

  return (
    <div className="min-h-screen bg-[#0B0C10] flex flex-col font-sans selection:bg-cyan-500/30 relative overflow-x-hidden">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1A183A] via-[#0B0C10] to-[#0B0C10] pointer-events-none" />

      <header className="relative z-50 pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <span>&larr;</span> <span className="text-sm font-medium uppercase tracking-widest hidden sm:inline">Back to Workspace</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4F8BFF] flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-white tracking-wide leading-tight">THE FOUNDRY</h1>
              <p className="text-[9px] text-[#4F8BFF] font-bold tracking-widest uppercase">Secure Launch Slot</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-6 py-6 md:py-12 relative z-10">
        <BookingForm roomId={room?.id || ''} leaderName={session.user.name || ''} leaderId={session.user.id || ''} />
      </main>
    </div>
  );
}
