import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Rocket, Clock, Zap, LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/auth';
import { CancelButton } from '@/components/booking/cancel-button';

export default async function StudentDashboard() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const myBookings = await prisma.booking.findMany({
    where: { groupLeaderId: session.user.id },
    orderBy: { date: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#09090B] p-4 md:p-8 text-zinc-100 selection:bg-cyan-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header section with logout */}
        <div className="flex justify-end">
           <form action={logout}>
              <Button variant="ghost" className="text-zinc-500 hover:text-white flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
           </form>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Founder Workspace</h1>
            <p className="text-zinc-400 mt-1">Manage your active sprints and incubator slots.</p>
          </div>
          <Link href="/book">
            <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white rounded-full font-bold px-6 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-105 transition-transform">
              <Rocket className="w-4 h-4 mr-2" /> Book Launch Slot
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-zinc-900 border-zinc-800 hover:border-cyan-500/50 transition-colors shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Total Sprints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-white">{myBookings.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 transition-colors shadow-lg md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" /> EDIC Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-xl font-bold text-cyan-400">{session.user.edicStatus}</div>
                <p className="text-sm text-zinc-500">
                  {session.user.edicStatus === 'ACTIVE' 
                    ? "You are cleared for launch. Book slots anytime." 
                    : "Access restricted. Contact operations to activate your founder status."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
          <CardHeader className="bg-zinc-950/50 border-b border-zinc-800">
            <CardTitle className="text-white">Recent Missions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {myBookings.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">
                <p>No missions logged yet. Book a slot to start building.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {myBookings.map(b => (
                  <div key={b.id} className="p-6 hover:bg-zinc-800/30 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-white">{b.projectName}</h3>
                      <p className="text-sm text-zinc-400 flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(b.date).toLocaleDateString()} | {b.startTime} - {b.endTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800 text-zinc-300">
                        {b.peopleCount} Founders
                      </div>
                      <div className={`px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider ${
                        b.status === 'CONFIRMED' ? 'bg-indigo-500/20 text-indigo-400' : 
                        b.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-500'
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
