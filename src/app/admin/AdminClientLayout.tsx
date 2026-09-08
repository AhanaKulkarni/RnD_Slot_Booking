'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Calendar, Users, Settings, LifeBuoy, Bell, Search, Moon, Menu, Rocket, Target } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion } from 'framer-motion';

const navLinks = [
  { name: 'Mission Control', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Launch Slots', href: '/admin/bookings', icon: Calendar },
  { name: 'Founders (EDIC)', href: '/admin/edic', icon: Users },
  { name: 'Growth Metrics', href: '/admin/analytics', icon: Target },
];

export default function AdminClientLayout({ children, session }: { children: React.ReactNode, session: any }) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-black text-xl text-white tracking-tight leading-none">THE FOUNDRY</h1>
          <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mt-1">Admin Command</p>
        </div>
      </div>
      
      <div className="px-4 py-4 flex-1">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2">Core Systems</p>
        <nav className="space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className="block relative">
                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-indigo-500/15 text-indigo-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                >
                  {isActive && (
                    <motion.div layoutId="active-nav" className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                  )}
                  <link.icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span>{link.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800/50 mt-auto">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="w-10 h-10 ring-2 ring-indigo-500/30">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${session?.user?.name}`} />
            <AvatarFallback className="bg-zinc-800 text-white">AD</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white leading-tight truncate">{session?.user?.name}</p>
            <p className="text-[10px] text-zinc-500 truncate uppercase tracking-wider">Chief Operator</p>
          </div>
        </div>
        <form action={logout} className="mt-4">
          <Button variant="ghost" size="sm" className="w-full text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/20 transition-all">
            Abort Session
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090B] flex text-sm font-sans selection:bg-cyan-500/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-zinc-950 border-r border-zinc-800/50 flex-shrink-0 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090B]">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 flex items-center justify-between px-4 bg-zinc-950 border-b border-zinc-800/50 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger className="p-2 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 bg-zinc-950 border-r-zinc-800">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="font-black text-lg text-white tracking-tight">THE FOUNDRY</h1>
          </div>
          <Avatar className="w-8 h-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${session?.user?.name}`} />
          </Avatar>
        </header>

        {/* Top Header (Desktop) */}
        <header className="hidden lg:flex h-20 items-center justify-between px-8 bg-[#09090B]/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-10">
          <div className="flex-1">
            <h2 className="text-zinc-400 text-sm font-medium tracking-wide">Workspace / <span className="text-white">{navLinks.find(l => l.href === pathname)?.name || 'Command'}</span></h2>
          </div>
          <div className="flex items-center gap-5">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-zinc-400 hover:text-cyan-400 transition-colors"><Search className="w-5 h-5" /></motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-zinc-400 hover:text-indigo-400 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#09090B]"></span>
            </motion.button>
          </div>
        </header>
        
        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
