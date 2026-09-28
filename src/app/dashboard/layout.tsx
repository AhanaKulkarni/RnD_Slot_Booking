import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/lib/actions/auth';
import { Calendar, LayoutDashboard, Rocket, LogOut, FolderKanban, Building2, Users, FileText, Bell, Megaphone, HelpCircle, Settings } from 'lucide-react';
import { TopHeader } from '@/components/layout/TopHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/dashboard');

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 p-6 md:min-h-screen flex flex-col flex-shrink-0 border-r border-border bg-white z-10 hidden md:flex">
        
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-8 h-8 flex items-center justify-center text-white bg-navy font-bold rounded-lg transform -rotate-12">
            <Rocket className="w-5 h-5 transform rotate-12" />
          </div>
          <span className="font-extrabold text-xl text-navy tracking-tight">R&D Portal</span>
        </div>

        <nav className="flex-1 space-y-8 overflow-y-auto pr-2 pb-10">
          
          <div className="space-y-1">
            <NavItem href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" active />
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 mb-3">Workspace</p>
            <NavItem href="/dashboard/projects" icon={<FolderKanban className="w-4 h-4" />} label="My Projects" />
            <NavItem href="/dashboard/calendar" icon={<Calendar className="w-4 h-4" />} label="My Calendar" />
            <NavItem href="/book" icon={<Calendar className="w-4 h-4" />} label="Book a Slot" />
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 mb-3">Resources</p>
            <NavItem href="#" icon={<Building2 className="w-4 h-4" />} label="Facilities" />
            <NavItem href="#" icon={<Users className="w-4 h-4" />} label="Mentors" />
            <NavItem href="#" icon={<FileText className="w-4 h-4" />} label="Documents" />
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 mb-3">Activity</p>
            <NavItem href="/dashboard/notifications" icon={<Bell className="w-4 h-4" />} label="Notifications" badge />
            <NavItem href="/dashboard/announcements" icon={<Megaphone className="w-4 h-4" />} label="Announcements" />
          </div>

          <div className="space-y-1 pt-6 border-t border-border">
            <NavItem href="#" icon={<HelpCircle className="w-4 h-4" />} label="Help & Support" />
            <NavItem href="#" icon={<Settings className="w-4 h-4" />} label="Settings" />
          </div>

        </nav>

        <div className="pt-6 border-t border-border mt-auto">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold text-sm">
              {session.user.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-navy truncate">{session.user.name}</p>
              <p className="text-xs text-slate-500 truncate">Founder</p>
            </div>
          </div>
          <form action={logout} className="mt-2">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-500 rounded-lg transition-colors hover:bg-slate-50">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopHeader userName={session.user.name || 'Founder'} />
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          
          {/* Subtle background motif */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue-light/30 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active, badge }: { href: string, icon: React.ReactNode, label: string, active?: boolean, badge?: boolean }) {
  return (
    <Link href={href} className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${active ? 'bg-brand-blue-light text-brand-blue font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}>
      <div className="flex items-center gap-3">
        <span className={active ? 'text-brand-blue' : 'text-slate-400'}>{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      {badge && (
        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
      )}
    </Link>
  );
}
