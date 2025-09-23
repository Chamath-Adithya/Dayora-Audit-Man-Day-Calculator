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

    if (!dbConfig) {
      return NextResponse.json({ message: 'Configuration not found' }, { status: 404 });
    }

    // The database stores some fields as JSON strings, so we need to parse them
    const responseConfig = {
      ...dbConfig,
      baseManDays: parseJSON(dbConfig.baseManDays, {}),
      employeeRanges: parseJSON(dbConfig.employeeRanges, []),
      riskMultipliers: parseJSON(dbConfig.riskMultipliers, []),
      integratedStandards: parseJSON(dbConfig.integratedStandards, []),
      categories: parseJSON(dbConfig.categories, []),
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

      // 2. If it exists, update it to become a backup
      if (currentDefaultConfig) {
        await tx.adminConfig.update({
          where: { name: 'default' },
          data: {
            isActive: false,
            name: `backup-${new Date().toISOString()}`, // Rename to free up the 'default' name
          },
        });
      }

      // 3. Create the new 'default' active config with the new data
      await tx.adminConfig.create({
        data: {
          ...dataToSave,
          name: 'default',
        },
      });
    });

    return NextResponse.json({ message: 'Configuration saved successfully. A backup of the previous version was created.' });
  } catch (error) {
    console.error('Error saving config to DB:', error);
    return NextResponse.json({ message: 'Error writing config to database' }, { status: 500 });
  }
}
