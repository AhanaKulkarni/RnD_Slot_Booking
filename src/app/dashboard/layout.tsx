import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/lib/actions/auth';
import { Calendar, LayoutDashboard, Rocket, LogOut } from 'lucide-react';

const neuRaised = "bg-[#e0e5ec] shadow-[8px_8px_16px_#c8d0e7,-8px_-8px_16px_#ffffff] rounded-2xl";
const neuPressed = "bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#c8d0e7,inset_-6px_-6px_12px_#ffffff] rounded-2xl";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/dashboard');

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-slate-700 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 p-6 md:min-h-screen flex flex-col gap-8 flex-shrink-0 border-b md:border-b-0 md:border-r border-slate-300/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 flex items-center justify-center text-blue-600 font-black ${neuRaised}`}>
            R&D
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-wide">Portal</span>
        </div>

        <nav className="flex-1 space-y-4">
          <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 font-bold text-slate-500 hover:text-blue-600 rounded-xl transition-all hover:bg-[#e0e5ec] hover:shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff]`}>
            <LayoutDashboard className="w-5 h-5" /> Overview
          </Link>
          <Link href="/dashboard/calendar" className={`flex items-center gap-3 px-4 py-3 font-bold text-slate-500 hover:text-blue-600 rounded-xl transition-all hover:bg-[#e0e5ec] hover:shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff]`}>
            <Calendar className="w-5 h-5" /> My Calendar
          </Link>
          <Link href="/book" className={`flex items-center gap-3 px-4 py-3 font-bold text-blue-600 rounded-xl transition-all ${neuRaised} hover:shadow-[4px_4px_8px_#c8d0e7,-4px_-4px_8px_#ffffff]`}>
            <Rocket className="w-5 h-5" /> Book Slot
          </Link>
        </nav>

        <form action={logout} className="mt-auto pt-8">
          <button className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-bold text-slate-500 hover:text-red-500 rounded-xl transition-all hover:bg-[#e0e5ec] hover:shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff]`}>
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
