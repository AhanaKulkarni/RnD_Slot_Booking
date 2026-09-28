import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Activity, TrendingUp } from 'lucide-react';

export default async function AdminDashboard() {
  const room = await prisma.room.findUnique({ where: { roomNumber: '414' } });
  
  const today = new Date();
  const startOfDay = new Date(today.setHours(0,0,0,0));
  const endOfDay = new Date(today.setHours(23,59,59,999));

  const todaysBookings = await prisma.booking.findMany({
    where: { roomId: room?.id, date: { gte: startOfDay, lte: endOfDay } },
    include: { groupLeader: true },
    orderBy: { startTime: 'asc' }
  });

  const allBookings = await prisma.booking.count();
  const allUsers = await prisma.user.count();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of today's activities and system metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Today's Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{todaysBookings.length}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{allUsers}</div>
            <p className="text-xs text-gray-500 mt-1">Across all departments</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{allBookings}</div>
            <p className="text-xs text-gray-500 mt-1">Lifetime</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Facility Capacity</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{room?.capacity}</div>
            <p className="text-xs text-gray-500 mt-1">Maximum allowed per slot</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 px-6">Time</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 px-6">Project / Leader</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 px-6">Occupancy</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 px-6 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todaysBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                  No sessions scheduled for today.
                </TableCell>
              </TableRow>
            ) : (
              todaysBookings.map(booking => (
                <TableRow key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/30">
                  <TableCell className="px-6 py-4 font-mono text-sm text-gray-600">
                    {booking.startTime} - {booking.endTime}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="font-medium text-gray-900 text-sm">{booking.projectName}</div>
                    <div className="text-xs text-gray-500">{booking.groupLeader?.name}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-600">
                      {booking.peopleCount} People
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'} className={booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
