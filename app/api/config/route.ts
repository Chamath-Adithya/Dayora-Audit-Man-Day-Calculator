import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// Helper function to parse JSON fields safely
const parseJSON = (jsonString: string, fallback: any = {}) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return fallback;
  }
};

export async function GET() {
  try {
    // Prioritize fetching the official 'default' active configuration
    let dbConfig = await prisma.adminConfig.findUnique({
      where: { name: 'default' },
    });

    // Fallback for safety: if 'default' isn't found, find any active config
    if (!dbConfig) {
      dbConfig = await prisma.adminConfig.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
      });
    }

    // If no configuration exists in database, return empty config
    if (!dbConfig) {
      return NextResponse.json({
        employeeRanges: [],
        baseManDays: {},
        riskMultipliers: { low: 1.0, medium: 1.0, high: 1.0 },
        haccpMultiplier: 0,
        multiSiteMultiplier: 0,
        integratedSystemReduction: 0,
        integratedStandards: [],
        categories: [],
      });
    }

    // The database stores some fields as JSON strings, so we need to parse them
    const responseConfig = {
      ...dbConfig,
      baseManDays: parseJSON(dbConfig.baseManDays, {}),
      employeeRanges: parseJSON(dbConfig.employeeRanges, []),
      riskMultipliers: parseJSON(dbConfig.riskMultipliers, { low: 1.0, medium: 1.0, high: 1.0 }),
      integratedStandards: parseJSON((dbConfig as any).integratedStandards || '[]', []),
      categories: parseJSON((dbConfig as any).categories || '[]', []),
    };

    return NextResponse.json(responseConfig);
  } catch (error) {
    console.error('Error fetching config from DB:', error);
    return NextResponse.json({ message: 'Error reading config from database' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newConfig = await req.json();

    const dataToSave = {
      baseManDays: JSON.stringify(newConfig.baseManDays || {}),
      employeeRanges: JSON.stringify(newConfig.employeeRanges || []),
      riskMultipliers: JSON.stringify(newConfig.riskMultipliers || []),
      haccpMultiplier: newConfig.haccpMultiplier,
      multiSiteMultiplier: newConfig.multiSiteMultiplier,
      integratedSystemReduction: newConfig.integratedSystemReduction,
      integratedStandards: JSON.stringify(newConfig.integratedStandards || []),
      categories: JSON.stringify(newConfig.categories || []),
      isActive: true,
    };

    // Use a transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // 1. Find the current 'default' config
      const currentDefaultConfig = await tx.adminConfig.findUnique({
        where: { name: 'default' },
      });

      if (currentDefaultConfig) {
        // 2. Create a backup from the current default config
        const { id, createdAt, updatedAt, ...backupData } = currentDefaultConfig;
        await tx.adminConfig.create({
            data: {
                ...backupData,
                name: `backup-${new Date().toISOString()}`,
                isActive: false,
            },
        });

        // 3. Update the 'default' config with the new data
        await tx.adminConfig.update({
            where: { name: 'default' },
            data: {
                ...dataToSave,
                updatedAt: new Date(),
            },
        });

        // 4. Clean up old backups
        const backups = await tx.adminConfig.findMany({
            where: { name: { startsWith: 'backup-' } },
            orderBy: { createdAt: 'asc' },
            select: { id: true },
        });

        if (backups.length > 5) {
            const idsToDelete = backups.slice(0, backups.length - 5).map(b => b.id);
            await tx.adminConfig.deleteMany({
                where: { id: { in: idsToDelete } },
            });
        }
      } else {
        // If no default config exists, just create one
        await tx.adminConfig.create({
            data: {
                ...dataToSave,
                name: 'default',
            },
        });
      }
    });

    return NextResponse.json({ message: 'Configuration saved successfully. A backup of the previous version was created.' });
  } catch (error) {
    console.error('Error saving config to DB:', error);
    return NextResponse.json({ message: 'Error writing config to database' }, { status: 500 });
  }
}
