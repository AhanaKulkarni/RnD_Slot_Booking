import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = '1032231015@tcetmumbai.in';
  const password = 'AIDSA41';
  
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
      name: 'Ahana Kulkarni', // Using name based on the github URL provided earlier
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

  console.log(`Successfully added user ${email} with ACTIVE founder status.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
