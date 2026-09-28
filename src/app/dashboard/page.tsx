import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, Zap, LogOut, FileText } from 'lucide-react';
import { logout } from '@/lib/actions/auth';
import { CancelButton } from '@/components/booking/cancel-button';

const neuRaised = "bg-[#e0e5ec] shadow-[8px_8px_16px_#c8d0e7,-8px_-8px_16px_#ffffff] rounded-2xl";
const neuPressed = "bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#c8d0e7,inset_-6px_-6px_12px_#ffffff] rounded-2xl";

export default async function StudentDashboard() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const myBookings = await prisma.booking.findMany({
    where: { groupLeaderId: session.user.id },
    orderBy: { date: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-slate-700 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header section with logout */}
        <div className="flex justify-end">
           <form action={logout}>
              <button className={`flex items-center gap-2 px-6 py-3 font-bold text-slate-500 hover:text-red-500 transition-colors ${neuRaised}`}>
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
           </form>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">Student Workspace</h1>
            <p className="text-slate-500">Manage your active R&D Cell slots and view history.</p>
          </div>
          <Link href="/book">
            <button className={`flex items-center gap-3 px-8 py-4 font-bold text-blue-600 ${neuRaised} hover:shadow-[4px_4px_8px_#c8d0e7,-4px_-4px_8px_#ffffff] transition-all`}>
              <FileText className="w-5 h-5" /> Book R&D Slot
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`p-8 ${neuRaised}`}>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Total Bookings</h3>
            <div className="text-5xl font-black text-slate-700">{myBookings.length}</div>
          </div>
          
          <div className={`p-8 md:col-span-2 ${neuRaised} flex flex-col justify-center`}>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-blue-500" /> EDIC Status
            </h3>
            <div className="flex items-center gap-6">
              <div className={`px-6 py-2 text-xl font-bold ${session.user.edicStatus === 'ACTIVE' ? 'text-green-600' : 'text-slate-400'} ${neuPressed}`}>
                {session.user.edicStatus}
              </div>
              <p className="text-slate-500 leading-relaxed">
                {session.user.edicStatus === 'ACTIVE' 
                  ? "Your account is verified. You can book room slots anytime." 
                  : "Access restricted. Contact operations to activate your EDIC status."}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-8 ${neuRaised}`}>
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Recent Bookings</h2>
          
          {myBookings.length === 0 ? (
            <div className={`p-12 text-center text-slate-500 ${neuPressed}`}>
              <p>No bookings found. Click "Book R&D Slot" to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {myBookings.map(b => (
                <div key={b.id} className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${neuPressed}`}>
                  <div>
                    <h3 className="font-bold text-xl text-slate-700 mb-2">{b.projectName}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                      <Clock className="w-4 h-4" />
                      {new Date(b.date).toLocaleDateString()} | {b.startTime} - {b.endTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold">
                    <div className="text-slate-500 bg-[#e0e5ec] px-4 py-2 rounded-xl shadow-[4px_4px_8px_#c8d0e7,-4px_-4px_8px_#ffffff]">
                      {b.peopleCount} People
                    </div>
                    <div className={`px-4 py-2 rounded-xl uppercase tracking-wider shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff] ${
                      b.status === 'CONFIRMED' ? 'text-blue-600' : 
                      b.status === 'CANCELLED' ? 'text-red-500' : 'text-slate-500'
                    }`}>
                      {b.status}
                    </div>
                    {b.status === 'CONFIRMED' && (
                       <CancelButton bookingId={b.id} />
                    )}
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
