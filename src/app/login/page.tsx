import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/login-form';
import { Rocket } from 'lucide-react';

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center font-sans p-6">
      <div className="w-full max-w-[420px] space-y-8">
        
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 flex items-center justify-center bg-brand-blue-light text-brand-blue rounded-2xl transform -rotate-12">
            <Rocket className="w-8 h-8 transform rotate-12" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-navy tracking-tight">R&D Portal</h1>
            <p className="text-slate-500 font-medium mt-1">Founder Authentication</p>
          </div>
        </div>

        <div className="premium-card p-8 md:p-10">
          <LoginForm />
        </div>
        
      </div>
    </main>
  );
}
