export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { date: 'desc' },
    include: { groupLeader: true },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">Review and manage all historical and upcoming slots</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 px-6">ID</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 px-6">Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 px-6">Time</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 px-6">Leader</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 px-6">People</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 px-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map(b => (
                <TableRow key={b.id} className="border-b border-gray-50 hover:bg-gray-50/30">
                  <TableCell className="px-6 py-4 font-mono text-xs text-gray-500">{b.bookingId}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-900">{format(b.date, 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600">{b.startTime} - {b.endTime}</TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">{b.groupLeader.name}</TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-600">
                      {b.peopleCount}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant={b.status === 'CONFIRMED' ? 'default' : 'secondary'} className={b.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                      {b.status}
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

