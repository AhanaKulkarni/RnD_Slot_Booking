import { prisma } from '@/lib/prisma';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toggleEdicStatus } from '@/lib/actions/booking';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MoreVertical } from 'lucide-react';

export default async function AdminEdicPage() {
  const users = await prisma.user.findMany({
    include: { edicMembership: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your preferences and configure various options</p>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-4">
              <span>Home</span>
              <span>/</span>
              <span>Settings</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">Users & Roles</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="text-gray-400"><Search className="w-5 h-5" /></Button>
          </div>
        </div>

        <div className="flex gap-6 mt-6 border-b border-gray-100">
          <button className="text-sm font-medium text-gray-500 pb-3 hover:text-gray-900">Organization</button>
          <button className="text-sm font-medium text-gray-500 pb-3 hover:text-gray-900">Facilities</button>
          <button className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-3">Users & Roles</button>
          <button className="text-sm font-medium text-gray-500 pb-3 hover:text-gray-900">Financials</button>
          <button className="text-sm font-medium text-gray-500 pb-3 hover:text-gray-900">Integrations</button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-3">
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white">
            <option>All Roles</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white">
            <option>Sort by</option>
          </select>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4">+ Add New User</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 border-b border-gray-100 hover:bg-gray-50/50">
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 px-6">Name</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 px-6">Role</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 px-6">Assigned Locations</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider h-10 px-6">Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => {
              const isEdic = user.edicMembership?.status === 'ACTIVE';
              // Determine pill color based on role
              let roleColor = 'bg-blue-50 text-blue-600';
              let roleName = 'Student';
              if (user.role === 'ADMIN') {
                 roleColor = 'bg-green-50 text-green-600';
                 roleName = 'Admin';
              } else if (isEdic) {
                 roleColor = 'bg-blue-50 text-blue-600';
                 roleName = 'Manager';
              } else {
                 roleColor = 'bg-orange-50 text-orange-600';
                 roleName = 'Student';
              }

              return (
                <TableRow key={user.id} className="border-b border-gray-50 hover:bg-gray-50/30">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">{user.name?.substring(0,2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-sm">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${roleColor}`}>
                      {roleName}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500">
                    {user.role === 'ADMIN' ? 'All Locations' : 'R&D Cell 414'}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <form action={toggleEdicStatus}>
                      <input type="hidden" name="userId" value={user.id} />
                      <button type="submit" className="flex items-center gap-3 cursor-pointer">
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${isEdic ? 'bg-blue-600' : 'bg-gray-200'}`}>
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isEdic ? 'translate-x-5' : ''}`} />
                        </div>
                        <span className={`text-sm ${isEdic ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                          {isEdic ? 'Active' : 'Inactive'}
                        </span>
                      </button>
                    </form>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-sm text-gray-500">Showing 1-{users.length} of {users.length} users</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-sm font-medium bg-blue-600 text-white">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">3</button>
            <span className="flex items-center px-1 text-gray-400">...</span>
            <button className="px-3 h-8 flex items-center justify-center rounded border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
