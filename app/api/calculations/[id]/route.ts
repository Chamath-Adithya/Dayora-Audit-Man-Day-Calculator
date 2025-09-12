import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'calculations.json')

async function readCalculations() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function writeCalculations(calculations: any[]) {
  const dataDir = path.dirname(DATA_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
  await fs.writeFile(DATA_FILE, JSON.stringify(calculations, null, 2))
}

// GET - Fetch a specific calculation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const calculations = await readCalculations()
    const calculation = calculations.find((calc: any) => calc.id === params.id)
    
    if (!calculation) {
      return NextResponse.json(
        { success: false, error: 'Calculation not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: calculation })
  } catch (error) {
    console.error('Error fetching calculation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch calculation' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a specific calculation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const calculations = await readCalculations()
    const filteredCalculations = calculations.filter((calc: any) => calc.id !== params.id)
    
    if (calculations.length === filteredCalculations.length) {
      return NextResponse.json(
        { success: false, error: 'Calculation not found' },
        { status: 404 }
      )
    }
    
    await writeCalculations(filteredCalculations)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Calculation deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting calculation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete calculation' },
      { status: 500 }
    )
  }
}

// PUT - Update a specific calculation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const calculations = await readCalculations()
    const calculationIndex = calculations.findIndex((calc: any) => calc.id === params.id)
    
    if (calculationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Calculation not found' },
        { status: 404 }
      )
    }
    
    calculations[calculationIndex] = {
      ...calculations[calculationIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
      date: calculations[calculationIndex].date // Keep original date
    }
    
    await writeCalculations(calculations)
    
    return NextResponse.json({ 
      success: true, 
      data: calculations[calculationIndex],
      message: 'Calculation updated successfully' 
    })
  } catch (error) {
    console.error('Error updating calculation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update calculation' },
      { status: 500 }
    )
  }
}