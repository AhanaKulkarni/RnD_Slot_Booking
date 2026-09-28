'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createProject } from '@/lib/actions/project';

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
    };

    try {
      const res = await createProject(data);
      if (res.success) {
        router.push(`/dashboard/projects`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-blue transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>
      
      <div>
        <h1 className="text-3xl font-extrabold text-navy tracking-tight mb-2">Create New Project</h1>
        <p className="text-slate-500">Initialize a new workspace for your research or startup.</p>
      </div>

      <div className="premium-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Project Name</label>
            <input name="name" required placeholder="e.g. AetherBuilt" className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Category</label>
            <input name="category" required placeholder="e.g. AI · Manufacturing · SaaS" className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Short Description</label>
            <textarea name="description" required rows={4} placeholder="Describe the goals of this project..." className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all resize-none" />
          </div>

          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

          <div className="pt-4 flex justify-end">
            <button disabled={isSubmitting} type="submit" className="flex items-center justify-center gap-2 px-8 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-blue-dark transition-all min-w-[160px]">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
