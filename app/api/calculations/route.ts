import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Define the data file path
const DATA_FILE = path.join(process.cwd(), 'data', 'calculations.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Read calculations from file
async function readCalculations() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return []
  }
}

// Write calculations to file
async function writeCalculations(calculations: any[]) {
  await ensureDataDir()
  await fs.writeFile(DATA_FILE, JSON.stringify(calculations, null, 2))
}

export interface SavedCalculation {
  id: string
  date: string
  companyName: string
  scope: string
  standard: string
  auditType: string
  category: string
  employees: number
  sites: number
  haccpStudies: number
  riskLevel: string
  integratedStandards: string[]
  result: number
  breakdown?: any
}

// GET - Fetch all calculations
export async function GET() {
  try {
    const calculations = await readCalculations()
    return NextResponse.json({ success: true, data: calculations })
  } catch (error) {
    console.error('Error fetching calculations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch calculations' },
      { status: 500 }
    )
  }
}

// POST - Save a new calculation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const calculations = await readCalculations()
    
    const newCalculation: SavedCalculation = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...body
    }
    
    calculations.push(newCalculation)
    await writeCalculations(calculations)
    
    return NextResponse.json({ 
      success: true, 
      data: newCalculation,
      message: 'Calculation saved successfully' 
    })
  } catch (error) {
    console.error('Error saving calculation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save calculation' },
      { status: 500 }
    )
  }
}

// DELETE - Delete all calculations
export async function DELETE() {
  try {
    await writeCalculations([])
    return NextResponse.json({ 
      success: true, 
      message: 'All calculations deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting calculations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete calculations' },
      { status: 500 }
    )
  }
}