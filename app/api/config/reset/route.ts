import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { defaultConfig } from '@/lib/default-config';

export async function POST() {
  try {
    const { name, ...configData } = defaultConfig;

    await prisma.adminConfig.upsert({
      where: { name: 'default' },
      update: configData,
      create: defaultConfig,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Configuration reset successfully.' 
    });
  } catch (error) {
    console.error('Error resetting config in DB:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error resetting config in database',
      message: 'Error resetting config in database' 
    }, { status: 500 });
  }
}
