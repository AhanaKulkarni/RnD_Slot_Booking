export const dynamic = 'force-dynamic';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Layers, Users, ArrowRight, Activity, Rocket } from 'lucide-react';
import { CancelButton } from '@/components/booking/cancel-button';

export default async function StudentDashboard() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const myBookings = await prisma.booking.findMany({
    where: { groupLeaderId: session.user.id },
    orderBy: { date: 'asc' },
  });

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingBookings = myBookings.filter(b => new Date(b.date) >= now && b.status === 'CONFIRMED');
  const pastBookings = myBookings.filter(b => new Date(b.date) < now && b.status === 'CONFIRMED');
  
  const totalHours = pastBookings.reduce((acc, curr) => acc + (curr.durationMinutes / 60), 0);
  const nextBooking = upcomingBookings[0];

  const firstName = session.user.name?.split(' ')[0] || 'Founder';

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-navy tracking-tight mb-2">Welcome Founder, <span className="text-brand-blue">{firstName}</span></h1>
          <p className="text-slate-500">Manage your R&D Cell workspace, projects and bookings all in one place.</p>
        </div>
        <Link href="/book" className="flex items-center gap-2 px-6 py-3 bg-brand-orange text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-sm">
          <Calendar className="w-4 h-4" /> Book a Slot <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Calendar />} title="TOTAL BOOKINGS" value={myBookings.length} trend="up" />
        <StatCard icon={<Clock />} title="R&D HOURS" value={`${totalHours}h`} trend="up" />
        <StatCard icon={<Layers />} title="ACTIVE PROJECTS" value={0} trend="flat" />
        <StatCard icon={<Users />} title="UPCOMING" value={upcomingBookings.length} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upcoming Booking */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-orange" /> Upcoming Booking
            </h2>
            <Link href="/dashboard/calendar" className="text-sm font-medium text-brand-blue hover:underline flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          
          <div className="premium-card p-8 min-h-[240px] flex flex-col justify-center">
            {nextBooking ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-navy">R&D Lab 414</h3>
                    <p className="text-brand-blue font-medium mt-1">
                      {new Date(nextBooking.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">{nextBooking.startTime} – {nextBooking.endTime}</p>
                  </div>
                  <span className="px-3 py-1 bg-brand-green/10 text-brand-green text-xs font-bold rounded-full uppercase tracking-wider">
                    {nextBooking.status}
                  </span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <p className="text-sm text-slate-500">Project: <span className="font-bold text-navy">{nextBooking.projectName || 'General Work'}</span></p>
                  <CancelButton bookingId={nextBooking.id} />
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-brand-blue-light rounded-full flex items-center justify-center text-brand-blue">
                  <Calendar className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-navy font-bold text-lg">No upcoming bookings</h3>
                  <p className="text-slate-500 text-sm mt-1">Reserve an R&D Cell workspace for your next session.</p>
                </div>
                <Link href="/book" className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 font-bold rounded-lg transition-colors text-sm">
                  Book a Slot <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* My Projects */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-blue" /> My Projects
            </h2>
            <Link href="/dashboard/projects" className="text-sm font-medium text-brand-blue hover:underline flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          
          <div className="premium-card p-8 min-h-[240px] flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Rocket className="w-8 h-8" />
            </div>
            <h3 className="text-navy font-bold text-lg">No projects yet</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-xs">Create a project to organize your R&D work, collaborate with your team and track your progress.</p>
            <Link href="/dashboard/projects" className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-brand-blue hover:bg-slate-100 font-bold rounded-lg transition-colors text-sm">
              + Create a Project
            </Link>
          </div>
        </section>

      </div>

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-navy flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-orange" /> Recent Activity
          </h2>
          <Link href="/dashboard/activity" className="text-sm font-medium text-brand-blue hover:underline flex items-center">
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
        
        <div className="premium-card p-8">
          <div className="flex items-center justify-center py-8 gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-navy font-bold text-base">No recent activity yet</h3>
              <p className="text-slate-500 text-sm mt-1">Your booking updates, project activity and important notifications will appear here.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function StatCard({ icon, title, value, trend }: { icon: React.ReactNode, title: string, value: string | number, trend?: 'up' | 'down' | 'flat' }) {
  return (
    <div className="premium-card p-6 flex flex-col justify-between relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-brand-blue-light text-brand-blue rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-navy">{value}</p>
      </div>
      
      {/* Decorative subtle graph graphic */}
      <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40C20 40 20 20 40 20C60 20 60 0 80 0V40H0Z" fill="currentColor" className="text-brand-blue"/>
        </svg>
      </div>
    </div>
  );
}

