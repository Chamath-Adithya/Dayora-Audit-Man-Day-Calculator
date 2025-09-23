import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const existingConfig = await prisma.adminConfig.findUnique({
    where: { name: 'default' }
  })

  if (!existingConfig) {
    // Create default admin configuration
    import { defaultConfig } from '../lib/default-config';

    await prisma.adminConfig.create({
      data: defaultConfig,
    })
    console.log('✅ Default configuration created.')
  } else {
    console.log('✅ Default configuration already exists.')
  }

  // Check if admin user already exists
  const existingAdminUser = await prisma.user.findUnique({
    where: { email: 'admin@dayora.com' }
  })

  if (!existingAdminUser) {
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@dayora.com',
        passwordHash: hashSync('admin123', 10),
        role: 'admin',
      },
    })
    console.log('✅ Admin user created.')
  } else {
    console.log('✅ Admin user already exists.')
  }

  // Check if user@dayora.com already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'user@dayora.com' }
  })

  if (!existingUser) {
    await prisma.user.create({
      data: {
        name: 'Regular User',
        email: 'user@dayora.com',
        passwordHash: hashSync('user123', 10),
      },
    })
    console.log('✅ Regular user (user@dayora.com) created.')
  } else {
    console.log('✅ Regular user (user@dayora.com) already exists.')
  }

  // Check if demo@dayora.com already exists
  const existingDemoUser = await prisma.user.findUnique({
    where: { email: 'demo@dayora.com' }
  })

  if (!existingDemoUser) {
    await prisma.user.create({
      data: {
        name: 'Demo User',
        email: 'demo@dayora.com',
        passwordHash: hashSync('demo123', 10),
      },
    })
    console.log('✅ Demo user (demo@dayora.com) created.')
  } else {
    console.log('✅ Demo user (demo@dayora.com) already exists.')
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
