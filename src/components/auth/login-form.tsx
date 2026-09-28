'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions/auth';
import { AlertCircle, Loader2 } from 'lucide-react';

const neuPressed = "w-full bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff] rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border-none font-medium";
const neuButton = "w-full py-4 text-blue-600 font-bold bg-[#e0e5ec] shadow-[8px_8px_16px_#c8d0e7,-8px_-8px_16px_#ffffff] hover:shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff] rounded-xl transition-all disabled:opacity-50 flex justify-center items-center";

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-6">
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-2">Email Address</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="your.email@tcetmumbai.in"
          required
          className={neuPressed}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-2">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          minLength={6}
          className={neuPressed}
        />
      </div>
      
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm font-bold shadow-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="text-sm text-slate-500 bg-[#e0e5ec] p-5 rounded-xl shadow-[inset_4px_4px_8px_#c8d0e7,inset_-4px_-4px_8px_#ffffff] mt-6 leading-relaxed">
        <p className="font-bold text-slate-700 mb-2 uppercase tracking-wider text-xs">Test Credentials</p>
        <p>Admin: <span className="text-blue-600 font-bold ml-1">admin@tcetmumbai.in</span> <br/><span className="opacity-50">Pass:</span> <span className="text-blue-600 font-bold">admin123</span></p>
        <div className="h-px bg-slate-300 my-2" />
        <p>Founder: <span className="text-blue-600 font-bold ml-1">1032231015@tcetmumbai.in</span> <br/><span className="opacity-50">Pass:</span> <span className="text-blue-600 font-bold">BTAIDS41</span></p>
      </div>

      <div className="pt-4">
        <button className={neuButton} aria-disabled={isPending} disabled={isPending}>
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
        </button>
      </div>
    </form>
  );
}
