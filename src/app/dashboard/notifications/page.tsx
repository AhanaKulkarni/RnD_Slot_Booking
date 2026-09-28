import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Bell, CheckCircle2 } from 'lucide-react';

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-navy tracking-tight mb-2">Notifications</h1>
          <p className="text-slate-500">Stay updated on your workspace and project activities.</p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="premium-card p-16 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-navy font-bold text-lg">You're all caught up.</h3>
          <p className="text-slate-500 text-sm mt-1">No new notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(n => (
            <div key={n.id} className="premium-card p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
              <div className="mt-1">
                <div className={`w-2 h-2 rounded-full ${n.isRead ? 'bg-transparent border border-slate-300' : 'bg-brand-orange'}`} />
              </div>
              <div>
                <h3 className={`text-base ${n.isRead ? 'font-medium text-slate-600' : 'font-bold text-navy'}`}>{n.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{n.message}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
                  {new Date(n.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
