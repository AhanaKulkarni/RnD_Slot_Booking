import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (secret !== 'run-seed-190905') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Admin
    const adminEmail = 'admin@tcetmumbai.in';
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash: adminPassword, role: 'ADMIN' },
      create: {
        email: adminEmail,
        passwordHash: adminPassword,
        name: 'System Admin',
        role: 'ADMIN',
        department: 'IT',
        studentId: 'ADMIN-01'
      }
    });

    // 2. Founder / Student
    const founderEmail = '1032231015@tcetmumbai.in';
    const founderPassword = await bcrypt.hash('BTAIDS41', 10);

    const founder = await prisma.user.upsert({
      where: { email: founderEmail },
      update: { passwordHash: founderPassword, role: 'STUDENT' },
      create: {
        email: founderEmail,
        passwordHash: founderPassword,
        name: 'Ahana Kulkarni',
        role: 'STUDENT',
        department: 'AIDS',
        studentId: '1032231015'
      }
    });

    await prisma.edicMembership.upsert({
      where: { userId: founder.id },
      update: { status: 'ACTIVE' },
      create: {
        userId: founder.id,
        edicId: `EDIC-${founder.studentId}`,
        status: 'ACTIVE'
      }
    });

    // 3. Ensure Room 414 exists
    await prisma.room.upsert({
      where: { roomNumber: '414' },
      update: {},
      create: {
        name: 'R&D Cell',
        roomNumber: '414',
        capacity: 21,
      }
    });

    return NextResponse.json({ message: 'Database seeded successfully on Supabase!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
