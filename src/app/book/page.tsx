export const dynamic = 'force-dynamic';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import BookingForm from '@/components/booking/booking-form';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default async function BookPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/dashboard');
  
  if (session.user.edicStatus !== 'ACTIVE') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-foreground font-sans">
        <div className="premium-card p-10 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto flex items-center justify-center text-red-500 rounded-full bg-red-50">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-navy">Booking Restricted</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Booking access is strictly restricted to verified EDIC members.
          </p>
          <Link href="/dashboard" className="block pt-6">
            <button className="w-full py-4 text-brand-blue font-bold bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              Return to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch rooms
  const rooms = await prisma.room.findMany();
  
  // Fetch user projects
  const projects = await prisma.project.findMany({
    where: { founderId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
      
      <header className="px-6 md:px-12 py-8 flex items-center gap-6">
        <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-navy bg-white border border-border rounded-lg hover:shadow-sm transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Book a Slot</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Reserve a workspace in the R&D Cell</p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pb-20">
        <BookingForm 
          rooms={rooms} 
          projects={projects}
          leaderName={session.user.name || ''} 
          leaderId={session.user.id || ''} 
        />
      </main>
    </div>
  );
}

