import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default async function AdminDashboard() {
  const room = await prisma.room.findUnique({ where: { roomNumber: '414' } });
  
  const today = new Date();
  const startOfDay = new Date(today.setHours(0,0,0,0));
  const endOfDay = new Date(today.setHours(23,59,59,999));

  const todaysBookings = await prisma.booking.findMany({
    where: { roomId: room?.id, date: { gte: startOfDay, lte: endOfDay } },
    include: { groupLeader: true }
  });

  const totalBookings = todaysBookings.length;
  const studentHours = todaysBookings.reduce((sum, b) => sum + (b.peopleCount * (b.durationMinutes / 60)), 0);
  const noShows = todaysBookings.filter(b => b.status === 'NO_SHOW').length;

  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, '0');
  const currentMin = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${currentHour}:${currentMin}`;

  const activeBookings = todaysBookings.filter(b => 
    b.startTime <= currentTime && b.endTime > currentTime && ['CONFIRMED', 'ACTIVE'].includes(b.status)
  );

  const liveOccupancy = activeBookings.reduce((sum, b) => sum + b.peopleCount, 0);

  return (
    <div className="space-y-8 text-zinc-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Mission Control</h1>
          <p className="text-zinc-400 mt-1">Live telemetry for The Foundry (Room 414)</p>
        </div>
        <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-sm font-semibold flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          SYSTEMS ONLINE
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800 hover:border-cyan-500/50 transition-colors duration-500 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400 font-bold uppercase tracking-wider">Live Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">{liveOccupancy} <span className="text-xl text-zinc-600">/ {room?.capacity || 21}</span></div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 transition-colors duration-500 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400 font-bold uppercase tracking-wider">Launch Slots Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-white">{totalBookings}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 transition-colors duration-500 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400 font-bold uppercase tracking-wider">Founder-Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-white">{studentHours.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 hover:border-red-500/50 transition-colors duration-500 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400 font-bold uppercase tracking-wider">No-Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]">{noShows}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white font-bold">Active Startup Sprints</CardTitle>
        </CardHeader>
        <CardContent>
          {activeBookings.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              <p>No active sprints currently in The Foundry.</p>
            </div>
          ) : (
            <div className="rounded-md border border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-950/50">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Project / Startup</TableHead>
                    <TableHead className="text-zinc-400">Lead Founder</TableHead>
                    <TableHead className="text-zinc-400">Time Window</TableHead>
                    <TableHead className="text-zinc-400">Team Size</TableHead>
                    <TableHead className="text-zinc-400">Objective</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeBookings.map(b => (
                    <TableRow key={b.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                      <TableCell className="font-bold text-white">{b.projectName}</TableCell>
                      <TableCell className="text-zinc-300">{b.groupLeader.name}</TableCell>
                      <TableCell className="text-cyan-400 font-mono text-xs">{b.startTime} - {b.endTime}</TableCell>
                      <TableCell className="text-zinc-300">{b.peopleCount}</TableCell>
                      <TableCell>
                        <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30">{b.purpose}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
