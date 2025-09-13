import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

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
    const calculations = await storage.getCalculations()
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
    console.log('Received calculation data:', JSON.stringify(body, null, 2))
    
    const newCalculation = await storage.saveCalculation(body)
    console.log('Saved calculation:', JSON.stringify(newCalculation, null, 2))
    
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
    await storage.clearCalculations()
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