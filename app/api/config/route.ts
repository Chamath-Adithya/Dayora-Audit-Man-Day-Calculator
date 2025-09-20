
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const configPath = path.resolve(process.cwd(), 'data/config.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(fileContent);
    return NextResponse.json(config);
  } catch (error) {
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
