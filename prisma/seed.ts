import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const existingConfig = await prisma.adminConfig.findUnique({
    where: { name: 'default' }
  })

  if (!existingConfig) {
    // Create default admin configuration
    const defaultConfig = {
      name: 'default',
      baseManDays: JSON.stringify({
        QMS: {
          AI: 2, AII: 3, BI: 4, BII: 5, BIII: 6,
          C: 7, D: 8, E: 10, F: 12, G: 15,
          H: 18, I: 22, J: 27, K: 32
        },
        EMS: {
          AI: 2, AII: 3, BI: 4, BII: 5, BIII: 6,
          C: 7, D: 8, E: 10, F: 12, G: 15,
          H: 18, I: 22, J: 27, K: 32
        },
        EnMS: {
          AI: 2, AII: 3, BI: 4, BII: 5, BIII: 6,
          C: 7, D: 8, E: 10, F: 12, G: 15,
          H: 18, I: 22, J: 27, K: 32
        },
        FSMS: {
          AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7,
          C: 8, D: 10, E: 12, F: 15, G: 18,
          H: 22, I: 27, J: 32, K: 38
        },
        Cosmetics: {
          AI: 2, AII: 3, BI: 4, BII: 5, BIII: 6,
          C: 7, D: 8, E: 10, F: 12, G: 15,
          H: 18, I: 22, J: 27, K: 32
        }
      }),
      employeeRanges: JSON.stringify([
        { min: 1, max: 5, adjustment: 0, description: "1-5 employees" },
        { min: 6, max: 25, adjustment: 0.5, description: "6-25 employees" },
        { min: 26, max: 45, adjustment: 1, description: "26-45 employees" },
        { min: 46, max: 65, adjustment: 1.5, description: "46-65 employees" },
        { min: 66, max: 85, adjustment: 2, description: "66-85 employees" },
        { min: 86, max: 125, adjustment: 2.5, description: "86-125 employees" },
        { min: 126, max: 175, adjustment: 3, description: "126-175 employees" },
        { min: 176, max: 275, adjustment: 4, description: "176-275 employees" },
        { min: 276, max: 425, adjustment: 5, description: "276-425 employees" },
        { min: 426, max: 625, adjustment: 6, description: "426-625 employees" },
        { min: 626, max: 875, adjustment: 7, description: "626-875 employees" },
        { min: 876, max: 1175, adjustment: 8, description: "876-1175 employees" },
        { min: 1176, max: 999999, adjustment: 10, description: "1176+ employees" }
      ]),
      riskMultipliers: JSON.stringify({
        low: 0.8,
        medium: 1.0,
        high: 1.2
      }),
      isActive: true,
      description: 'Default IAF MD 5:2019 compliant configuration'
    }

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
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@dayora.com',
        passwordHash: hashedPassword,
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
    const hashedPassword = await bcrypt.hash('user123', 10);
    await prisma.user.create({
      data: {
        name: 'Regular User',
        email: 'user@dayora.com',
        passwordHash: hashedPassword,
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
    const hashedPassword = await bcrypt.hash('demo123', 10);
    await prisma.user.create({
      data: {
        name: 'Demo User',
        email: 'demo@dayora.com',
        passwordHash: hashedPassword,
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
