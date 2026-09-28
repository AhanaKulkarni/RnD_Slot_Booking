'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Calendar, Users, Settings, LifeBuoy, Bell, Search, Moon, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Calendar', href: '/admin/bookings', icon: Calendar },
  { name: 'Enrollments', href: '/admin/analytics', icon: Users },
  { name: 'Courses', href: '#', icon: Search },
  { name: 'Instructors', href: '/admin/edic', icon: Users },
  { name: 'Students', href: '#', icon: Users },
  { name: 'Financials', href: '#', icon: Search },
];

export default function AdminClientLayout({ children, session }: { children: React.ReactNode, session: any }) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6">
        <h1 className="font-bold text-2xl text-gray-900 tracking-tight">Quixera</h1>
        <p className="text-xs text-gray-500 mt-1">Turning Performance into Progress</p>
      </div>
      
      <div className="px-4 py-4 flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">MAIN</p>
        <nav className="space-y-1">
          {navLinks.map((link) => {
            // Because our current routes differ from the mock slightly, I'll hardcode the "Users & Roles" equivalent as EDIC members.
            const isUsersAndRoles = link.name === 'Instructors' && pathname === '/admin/edic';
            const isActive = pathname === link.href || isUsersAndRoles;
            return (
              <Link key={link.name} href={link.href} className="block relative">
                <div 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-r-full" />
                  )}
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 mt-auto">
        <nav className="space-y-1 mb-4">
           <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 bg-gray-50">
             <Settings className="w-5 h-5" />
             <span className="font-medium">Settings</span>
           </Link>
           <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
             <LifeBuoy className="w-5 h-5" />
             <span className="font-medium">Support</span>
           </Link>
        </nav>
        <div className="flex items-center gap-3 p-3 border-t border-gray-100">
          <Avatar className="w-10 h-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${session?.user?.name}`} />
            <AvatarFallback className="bg-gray-200 text-gray-700">AD</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold text-gray-900 leading-tight truncate">{session?.user?.name || 'Sophia Williams'}</p>
            <p className="text-xs text-gray-500 truncate">{session?.user?.email || 'mail@mail.com'}</p>
          </div>
          <form action={logout}>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600">
               <span className="text-xs">&rsaquo;</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex text-sm font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-shrink-0 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white m-2 lg:m-4 rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 flex items-center justify-between px-4 bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger className="p-2 text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors">
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 bg-white border-r-gray-200">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="font-bold text-lg text-gray-900 tracking-tight">Quixera</h1>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
