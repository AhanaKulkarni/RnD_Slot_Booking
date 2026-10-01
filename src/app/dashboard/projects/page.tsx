export const dynamic = 'force-dynamic';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Rocket, Clock, Calendar, ArrowRight, FolderKanban } from 'lucide-react';

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const projects = await prisma.project.findMany({
    where: { founderId: session.user.id },
    include: {
      bookings: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-navy tracking-tight mb-2">My Projects</h1>
          <p className="text-slate-500">Manage the startups, projects and research work you're developing through the R&D Cell.</p>
        </div>
        <Link href="/dashboard/projects/new" className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-navy transition-all shadow-sm">
          <FolderKanban className="w-4 h-4" /> Create Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="premium-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
            <Rocket className="w-10 h-10" />
          </div>
          <h3 className="text-navy font-bold text-2xl">No projects yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mt-2">Create a project to organize your R&D work, collaborate with your team and track your progress.</p>
          <Link href="/dashboard/projects/new" className="mt-8 flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-navy transition-all shadow-sm">
            <FolderKanban className="w-4 h-4" /> Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="premium-card p-6 flex flex-col relative group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-brand-blue-light text-brand-blue rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-brand-green/10 text-brand-green text-[10px] font-bold rounded-full uppercase tracking-widest">
                  {project.status}
                </span>
              </div>
              
              <h3 className="font-bold text-xl text-navy mb-1">{project.name}</h3>
              <p className="text-sm font-bold text-brand-blue mb-4">{project.category}</p>
              
              <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">
                {project.description || "No description provided."}
              </p>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-border">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bookings</p>
                  <p className="font-bold text-navy flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {project.bookings.length}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">R&D Time</p>
                  <p className="font-bold text-navy flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {project.totalHours}h</p>
                </div>
              </div>
              
              <Link href={`/dashboard/projects/${project.id}`} className="mt-2 block w-full py-3 text-center bg-slate-50 text-slate-600 font-bold rounded-lg group-hover:bg-brand-blue group-hover:text-white transition-colors">
                Open Project
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

