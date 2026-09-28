import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/login-form';
import { MapPin } from 'lucide-react';

const neuRaised = "bg-[#e0e5ec] shadow-[8px_8px_16px_#c8d0e7,-8px_-8px_16px_#ffffff] rounded-2xl";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
  }

  return (
    <main className="min-h-screen bg-[#e0e5ec] flex items-center justify-center font-sans text-slate-700 p-6">
      <div className="w-full max-w-[450px] space-y-8">
        
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={`w-20 h-20 flex items-center justify-center ${neuRaised}`}>
            <MapPin className="w-10 h-10 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">R&D Slot Booking</h1>
            <p className="text-slate-500 font-medium">Secure Access Portal</p>
          </div>
        </div>

        <div className={`p-8 md:p-10 ${neuRaised}`}>
          <LoginForm />
        </div>
        
      </div>
    </main>
  );
}
