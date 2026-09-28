import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
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

  console.log("Seeded database successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
