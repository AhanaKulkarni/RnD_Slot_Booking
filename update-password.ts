import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = '1032231015@tcetmumbai.in';
  const password = 'BTAIDS41'; // Note the change here per user request!
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      role: 'STUDENT',
      department: 'AIDS',
    },
    create: {
      email,
      passwordHash: hashedPassword,
      name: 'Ahana Kulkarni',
      role: 'STUDENT',
      department: 'AIDS',
      studentId: '1032231015'
    }
  });

  await prisma.edicMembership.upsert({
    where: { userId: user.id },
    update: { status: 'ACTIVE' },
    create: {
      userId: user.id,
      edicId: `EDIC-${user.studentId}`,
      status: 'ACTIVE'
    }
  });

  console.log(`Successfully updated user ${email} password to BTAIDS41 with ACTIVE founder status.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
