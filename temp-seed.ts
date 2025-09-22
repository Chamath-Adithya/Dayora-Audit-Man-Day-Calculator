import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Running temporary seeder...')

  try {
    // Upsert Admin User
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@dayora.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@dayora.com',
        passwordHash: hashSync('admin123', 10),
        role: 'admin',
      },
    })
    console.log('✅ Admin user created or already exists.', adminUser)

    // Upsert Regular User
    const regularUser = await prisma.user.upsert({
      where: { email: 'user@dayora.com' },
      update: {},
      create: {
        name: 'Regular User',
        email: 'user@dayora.com',
        passwordHash: hashSync('user123', 10),
        role: 'user',
      },
    })
    console.log('✅ Regular user created or already exists.', regularUser)

    // Upsert Demo User
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@dayora.com' },
      update: {},
      create: {
        name: 'Demo User',
        email: 'demo@dayora.com',
        passwordHash: hashSync('demo123', 10),
        role: 'user',
      },
    })
    console.log('✅ Demo user created or already exists.', demoUser)

  } catch (e) {
    console.error('❌ Error in temporary seeder:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
