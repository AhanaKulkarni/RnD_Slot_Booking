import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, ListFilter, MoreVertical, Plus } from 'lucide-react';
import { revalidatePath } from 'next/cache';

async function toggleEdicStatus(formData: FormData) {
  'use server';
  const userId = formData.get('userId') as string;
  const currentStatus = formData.get('currentStatus') as string;
  
  if (!userId) return;

  const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  
  await prisma.edicMembership.upsert({
    where: { userId },
    update: { status: newStatus },
    create: {
      userId,
      status: newStatus,
      edicId: `EDIC-NEW-${Math.floor(Math.random() * 10000)}`,
    }
  });

  revalidatePath('/admin/edic');
}

export default async function EdicManagementPage() {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { edicMembership: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">EDIC Members</h1>
        <p className="text-gray-500 text-sm mt-1">Manage EDIC memberships and student roles</p>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-900">Organization</button>
        <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-900">Facilities</button>
        <button className="pb-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Users & Roles</button>
        <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-900">Financials</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex gap-3 flex-1">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" className="text-gray-600 gap-2 font-normal">
              <ListFilter className="w-4 h-4" /> All Roles
            </Button>
            <Button variant="outline" className="text-gray-600 gap-2 font-normal">
              Sort by
            </Button>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-lg">
            <Plus className="w-4 h-4" /> Add New User
          </Button>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
              <TableHead className="font-medium text-gray-500 h-10">Name</TableHead>
              <TableHead className="font-medium text-gray-500 h-10">Department</TableHead>
              <TableHead className="font-medium text-gray-500 h-10">Status</TableHead>
              <TableHead className="font-medium text-gray-500 h-10 w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((s, i) => {
              const status = s.edicMembership?.status || 'NONE';
              const isActive = status === 'ACTIVE';
              // Cycle through some colors for the department pill just for the visual effect of the mockup
              const colors = ['bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-orange-100 text-orange-700'];
              const colorClass = colors[i % colors.length];

              return (
                <TableRow key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-gray-100">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${s.name}`} />
                        <AvatarFallback>{s.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{s.name}</span>
                        <span className="text-xs text-gray-500">{s.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                      {s.department || 'Student'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <form action={toggleEdicStatus} className="flex items-center gap-3">
                      <input type="hidden" name="userId" value={s.id} />
                      <input type="hidden" name="currentStatus" value={status} />
                      <button 
                        type="submit" 
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`}
                        role="switch"
                        aria-checked={isActive}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                      <span className={`text-sm ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </form>
                  </TableCell>
                  <TableCell>
                    <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Showing 1-{students.length} of {students.length} users</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 hover:bg-gray-100 rounded-md">2</button>
            <button className="px-3 py-1 hover:bg-gray-100 rounded-md">3</button>
            <span className="px-2 py-1">...</span>
            <button className="px-3 py-1 hover:bg-gray-100 rounded-md">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
