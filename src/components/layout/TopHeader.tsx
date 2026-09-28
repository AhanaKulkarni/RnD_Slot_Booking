'use client';

import { Bell, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function TopHeader({ userName }: { userName: string }) {
  const pathname = usePathname();
  
  // Clean up the pathname for display
  const title = pathname.split('/').filter(Boolean).pop();
  const displayTitle = title ? title.charAt(0).toUpperCase() + title.slice(1) : 'Overview';
  
  const firstName = userName.split(' ')[0];
  const initial = firstName.charAt(0);

  return (
    <header className="flex justify-between items-center py-6 px-8 border-b border-border bg-transparent">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">R&D CELL • TCET</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer hover:text-brand-blue transition-colors">
          <Bell className="w-5 h-5 text-slate-400" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-brand-orange rounded-full border border-white" />
        </div>
        
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold text-sm">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}
