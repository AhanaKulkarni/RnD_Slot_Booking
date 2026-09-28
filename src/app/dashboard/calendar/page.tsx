import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';

const neuRaised = "bg-[#e0e5ec] shadow-[8px_8px_16px_#c8d0e7,-8px_-8px_16px_#ffffff] rounded-2xl";
const neuPressed = "bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#c8d0e7,inset_-6px_-6px_12px_#ffffff] rounded-2xl";

export default async function DashboardCalendarPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const myBookings = await prisma.booking.findMany({
    where: { groupLeaderId: session.user.id, status: 'CONFIRMED' },
    orderBy: { date: 'asc' }
  });

  // Extract dates for highlighting
  const bookedDates = myBookings.map(b => new Date(b.date));

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">My Calendar</h1>
        <p className="text-slate-500 text-lg">View your upcoming reserved slots.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Calendar View */}
        <div className={`p-8 ${neuRaised} flex-shrink-0 w-full lg:w-auto`}>
          <div className={neuPressed + " p-4 overflow-hidden inline-block"}>
            <Calendar
              mode="multiple"
              selected={bookedDates}
              className="bg-transparent text-slate-700 font-bold"
              classNames={{
                day_selected: "bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-500 focus:text-white rounded-full shadow-[4px_4px_8px_#c8d0e7,-4px_-4px_8px_#ffffff]",
                day: "h-10 w-10 text-center rounded-full hover:bg-slate-200 transition-colors font-medium",
                head_cell: "text-slate-400 font-bold w-10 h-10 uppercase text-xs",
                nav_button: "hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors",
                caption: "flex justify-between items-center mb-4 font-black text-slate-800 uppercase tracking-widest",
              }}
            />
          </div>
        </div>

        {/* Agenda View */}
        <div className={`p-8 ${neuRaised} flex-1 w-full`}>
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Upcoming Agenda</h2>
          {myBookings.length === 0 ? (
            <div className={`p-10 text-center text-slate-500 ${neuPressed}`}>
              <p>No upcoming slots booked.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.filter(b => new Date(b.date) >= new Date(new Date().setHours(0,0,0,0))).map(b => (
                <div key={b.id} className={`p-6 border-l-4 border-blue-500 ${neuPressed}`}>
                  <h3 className="font-bold text-lg text-slate-800">{b.projectName}</h3>
                  <div className="text-sm font-bold text-slate-500 mt-2">
                    {new Date(b.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    {' '}• {b.startTime} - {b.endTime}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 tracking-wide uppercase">{b.purpose}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
