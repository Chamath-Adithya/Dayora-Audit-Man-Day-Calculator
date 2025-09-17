import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default admin configuration
  const defaultConfig = {
    name: 'default',
    baseManDays: {
      QMS: {
        AI: 1.5, AII: 2.0, BI: 2.5, BII: 3.0, BIII: 3.5,
        C: 4.0, D: 4.5, E: 5.5, F: 6.5, G: 8.0,
        H: 10.0, I: 12.5, J: 15.5, K: 19.0
      },
      EMS: {
        AI: 1.5, AII: 2.0, BI: 2.5, BII: 3.0, BIII: 3.5,
        C: 4.0, D: 4.5, E: 5.5, F: 6.5, G: 8.0,
        H: 10.0, I: 12.5, J: 15.5, K: 19.0
      },
      EnMS: {
        AI: 1.5, AII: 2.0, BI: 2.5, BII: 3.0, BIII: 3.5,
        C: 4.0, D: 4.5, E: 5.5, F: 6.5, G: 8.0,
        H: 10.0, I: 12.5, J: 15.5, K: 19.0
      },
      FSMS: {
        AI: 2.0, AII: 2.5, BI: 3.0, BII: 3.5, BIII: 4.0,
        C: 4.5, D: 5.5, E: 6.5, F: 8.0, G: 10.0,
        H: 12.5, I: 15.5, J: 19.0, K: 23.5
      },
      Cosmetics: {
        AI: 1.5, AII: 2.0, BI: 2.5, BII: 3.0, BIII: 3.5,
        C: 4.0, D: 4.5, E: 5.5, F: 6.5, G: 8.0,
        H: 10.0, I: 12.5, J: 15.5, K: 19.0
      }
    },
    employeeRanges: [
      { min: 1, max: 5, adjustment: 0, description: "1-5 employees" },
      { min: 6, max: 25, adjustment: 0.5, description: "6-25 employees" },
      { min: 26, max: 45, adjustment: 1.0, description: "26-45 employees" },
      { min: 46, max: 65, adjustment: 1.5, description: "46-65 employees" },
      { min: 66, max: 85, adjustment: 2.0, description: "66-85 employees" },
      { min: 86, max: 125, adjustment: 2.5, description: "86-125 employees" },
      { min: 126, max: 175, adjustment: 3.0, description: "126-175 employees" },
      { min: 176, max: 275, adjustment: 4.0, description: "176-275 employees" },
      { min: 276, max: 425, adjustment: 5.0, description: "276-425 employees" },
      { min: 426, max: 625, adjustment: 6.0, description: "426-625 employees" },
      { min: 626, max: 875, adjustment: 7.0, description: "626-875 employees" },
      { min: 876, max: 1175, adjustment: 8.0, description: "876-1175 employees" },
      { min: 1176, max: Number.POSITIVE_INFINITY, adjustment: 10.0, description: "1176+ employees" }
    ],
    riskMultipliers: {
      low: 0.8,
      medium: 1.0,
      high: 1.2
    },
    haccpMultiplier: 0.5,
    multiSiteMultiplier: 0.5,
    integratedSystemReduction: 0.1,
    isActive: true,
    description: 'Default IAF MD 5:2019 compliant configuration'
  }

  await prisma.adminConfig.upsert({
    where: { name: 'default' },
    update: defaultConfig,
    create: defaultConfig,
  })

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
