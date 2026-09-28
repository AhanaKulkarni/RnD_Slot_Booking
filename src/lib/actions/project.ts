'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function createProject(data: { name: string, category: string, description: string }) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const project = await prisma.project.create({
    data: {
      name: data.name,
      category: data.category,
      description: data.description,
      founderId: session.user.id
    }
  });

  revalidatePath('/dashboard/projects');
  revalidatePath('/dashboard');
  
  return { success: true, projectId: project.id };
}
