import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Clock, Rocket } from 'lucide-react';

export default async function DashboardCalendarPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const myBookings = await prisma.booking.findMany({
    where: { groupLeaderId: session.user.id, status: 'CONFIRMED' },
    orderBy: { date: 'asc' },
    include: { project: true, room: true }
  });

  // Extract dates for highlighting
  const bookedDates = myBookings.map(b => new Date(b.date));
  const upcomingBookings = myBookings.filter(b => new Date(b.date) >= new Date(new Date().setHours(0,0,0,0)));

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-4xl font-extrabold text-navy tracking-tight mb-2">My Calendar</h1>
        <p className="text-slate-500">View your upcoming reserved slots across the R&D ecosystem.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Calendar View */}
        <div className="premium-card p-6 flex-shrink-0 w-full lg:w-auto">
          <Calendar
            mode="multiple"
            selected={bookedDates}
            className="bg-transparent text-navy font-bold"
            classNames={{
              day: "h-10 w-10 text-center rounded-lg hover:bg-slate-100 transition-colors font-medium focus:bg-brand-blue focus:text-white",
            }}
          />
        </div>

        {/* Agenda View */}
        <div className="flex-1 w-full space-y-4">
          <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-brand-orange" /> Upcoming Agenda
          </h2>
          
          {upcomingBookings.length === 0 ? (
            <div className="premium-card p-12 text-center flex flex-col items-center">
              <CalendarIcon className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-navy font-bold text-lg">No upcoming bookings</h3>
              <p className="text-slate-500 text-sm mt-1">Your schedule is clear.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map(b => (
                <div key={b.id} className="premium-card p-6 flex items-start gap-4 hover:border-brand-blue/30 transition-colors group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center flex-shrink-0 mt-1">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-navy group-hover:text-brand-blue transition-colors">
                        {b.project?.name || b.projectName || 'Research Work'}
                      </h3>
                      <span className="px-3 py-1 bg-brand-green/10 text-brand-green text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {b.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm font-bold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4 text-slate-400" />
                        {new Date(b.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {b.startTime} - {b.endTime}
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-400 mt-3 tracking-widest uppercase">{b.room?.name || 'R&D Room'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
