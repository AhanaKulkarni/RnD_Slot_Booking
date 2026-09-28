'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions/auth';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-6">
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-1">Email Address</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="your.email@tcetmumbai.in"
          required
          className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-1">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          minLength={6}
          className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
        />
      </div>
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-bold">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="text-sm text-slate-500 bg-brand-blue-light/50 border border-brand-blue-light p-4 rounded-xl mt-6 leading-relaxed">
        <p className="font-bold text-navy mb-2 uppercase tracking-wider text-[10px]">Test Credentials</p>
        <p>Admin: <span className="text-brand-blue font-bold ml-1">admin@tcetmumbai.in</span> <br/><span className="opacity-50">Pass:</span> <span className="text-brand-blue font-bold">admin123</span></p>
        <div className="h-px bg-brand-blue/10 my-2" />
        <p>Founder: <span className="text-brand-blue font-bold ml-1">1032231015@tcetmumbai.in</span> <br/><span className="opacity-50">Pass:</span> <span className="text-brand-blue font-bold">BTAIDS41</span></p>
      </div>

      <div className="pt-4">
        <button className="w-full py-4 text-white font-bold bg-brand-blue rounded-xl transition-all disabled:opacity-50 flex justify-center items-center hover:bg-brand-navy shadow-sm" aria-disabled={isPending} disabled={isPending}>
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
        </button>
      </div>
    </form>
  );
}
