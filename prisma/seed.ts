import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.auditLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.roomClosure.deleteMany()
  await prisma.bookingMember.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.room.deleteMany()
  await prisma.edicMembership.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('password123', 10)

  // 1. Create Room 414
  const room = await prisma.room.create({
    data: {
      name: 'R&D Cell',
      roomNumber: '414',
      capacity: 21,
      openTime: '09:00',
      closeTime: '18:00',
    },
  })

  // 2. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@college.edu',
      passwordHash,
      role: 'ADMIN',
      department: 'Administration',
    },
  })

  // 3. Create Students (Some EDIC active, some inactive, some non-EDIC)
  const studentsData = Array.from({ length: 20 }).map((_, i) => ({
    name: `Student ${i + 1}`,
    email: `student${i + 1}@college.edu`,
    studentId: `STU${1000 + i}`,
    passwordHash,
    role: 'STUDENT',
    department: i % 2 === 0 ? 'Computer Science' : 'Electronics',
    year: i % 3 === 0 ? '3rd Year' : '4th Year',
  }))

  const createdStudents = []
  for (const data of studentsData) {
    const student = await prisma.user.create({ data })
    createdStudents.push(student)
  }

  // 4. Assign EDIC Memberships
  // First 10 are active EDIC
  for (let i = 0; i < 10; i++) {
    await prisma.edicMembership.create({
      data: {
        userId: createdStudents[i].id,
        edicId: `EDIC-${2000 + i}`,
        status: 'ACTIVE',
      },
    })
  }

  // Next 5 are inactive EDIC
  for (let i = 10; i < 15; i++) {
    await prisma.edicMembership.create({
      data: {
        userId: createdStudents[i].id,
        edicId: `EDIC-${2000 + i}`,
        status: 'INACTIVE',
      },
    })
  }
  // Last 5 are just regular students, no EDIC record.

  // 5. Create some bookings (Past and Future)
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0] // YYYY-MM-DD
  
  // A past booking (completed)
  const pastDate = new Date(today)
  pastDate.setDate(today.getDate() - 1)
  
  await prisma.booking.create({
    data: {
      bookingId: `RND-414-${pastDate.toISOString().slice(2,10).replace(/-/g, '')}-0001`,
      roomId: room.id,
      groupLeaderId: createdStudents[0].id,
      date: pastDate,
      startTime: '10:00',
      endTime: '12:00',
      durationMinutes: 120,
      peopleCount: 4,
      purpose: 'Prototype Development',
      projectName: 'Smart IoT Device',
      status: 'COMPLETED',
      members: {
        create: [
          { name: createdStudents[0].name!, studentId: createdStudents[0].studentId, isPresent: true },
          { name: createdStudents[1].name!, studentId: createdStudents[1].studentId, isPresent: true },
          { name: createdStudents[2].name!, studentId: createdStudents[2].studentId, isPresent: true },
          { name: createdStudents[3].name!, studentId: createdStudents[3].studentId, isPresent: false },
        ]
      }
    }
  })

  // A future booking (confirmed)
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + 1)
  
  await prisma.booking.create({
    data: {
      bookingId: `RND-414-${futureDate.toISOString().slice(2,10).replace(/-/g, '')}-0002`,
      roomId: room.id,
      groupLeaderId: createdStudents[4].id,
      date: futureDate,
      startTime: '14:00',
      endTime: '16:00',
      durationMinutes: 120,
      peopleCount: 6,
      purpose: 'Research / Experiment',
      projectName: 'AI Vision Model',
      status: 'CONFIRMED',
      members: {
        create: [
          { name: createdStudents[4].name!, studentId: createdStudents[4].studentId },
          { name: createdStudents[5].name!, studentId: createdStudents[5].studentId },
          { name: createdStudents[6].name!, studentId: createdStudents[6].studentId },
          { name: createdStudents[7].name!, studentId: createdStudents[7].studentId },
          { name: createdStudents[8].name!, studentId: createdStudents[8].studentId },
          { name: createdStudents[9].name!, studentId: createdStudents[9].studentId },
        ]
      }
    }
  })

  console.log('Database seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
