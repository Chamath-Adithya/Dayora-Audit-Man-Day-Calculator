
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const configPath = path.resolve(process.cwd(), 'data/config.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');
    let config = JSON.parse(fileContent);

    // Ensure integratedStandards exists to prevent client-side errors
    if (!config.integratedStandards) {
      config.integratedStandards = [];
    }

    return NextResponse.json(config);
  } catch (error) {
    // If the file doesn't exist or is invalid, we could return a default config
    // For now, we'll return an error, but a more robust solution might send defaults.
    return NextResponse.json({ message: 'Error reading config file' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newConfig = await req.json();
    await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2));
    return NextResponse.json({ message: 'Configuration saved successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error writing config file' }, { status: 500 });
  }
}
