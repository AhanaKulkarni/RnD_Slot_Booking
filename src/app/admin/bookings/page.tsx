import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { date: 'desc' },
    include: { groupLeader: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">All Bookings</h1>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Leader</TableHead>
                <TableHead>People</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.bookingId}</TableCell>
                  <TableCell>{format(b.date, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{b.startTime} - {b.endTime}</TableCell>
                  <TableCell>{b.groupLeader.name}</TableCell>
                  <TableCell>{b.peopleCount}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{b.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
