import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage-db'
import { calculateAuditManDays } from '@/lib/audit-calculator-fixed'
import { validateCalculationInput } from '@/lib/audit-calculator-fixed'

export interface SavedCalculation {
  id: string
  createdAt: Date
  updatedAt: Date
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
  stage1ManDays?: number
  stage2ManDays?: number
  surveillanceManDays?: number
  recertificationManDays?: number
  createdBy?: string
  isDeleted: boolean
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
    
    // Validate input
    const validationErrors = validateCalculationInput(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }
    
    // Calculate audit man-days using the fixed calculator
    const calculationResult = calculateAuditManDays(body)
    
    // Prepare data for storage
    const calculationData = {
      ...body,
      result: calculationResult.totalManDays,
      breakdown: calculationResult.breakdown,
      stage1ManDays: calculationResult.stageDistribution?.stage1,
      stage2ManDays: calculationResult.stageDistribution?.stage2,
      surveillanceManDays: calculationResult.surveillanceManDays,
      recertificationManDays: calculationResult.recertificationManDays,
    }
    
    const newCalculation = await storage.saveCalculation(calculationData)
    console.log('Saved calculation:', JSON.stringify(newCalculation, null, 2))
    
    // Log audit event
    await storage.logAuditEvent(
      'CREATE',
      'CALCULATION',
      newCalculation.id,
      { companyName: body.companyName, standard: body.standard, result: calculationResult.totalManDays },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    )
    
    return NextResponse.json({ 
      success: true, 
      data: newCalculation,
      message: 'Calculation saved successfully' 
    })
  } catch (error) {
    console.error('Error saving calculation:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save calculation' },
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