import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminClientLayout from './AdminClientLayout';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <AdminClientLayout session={session}>
      {children}
    </AdminClientLayout>
  );
}
