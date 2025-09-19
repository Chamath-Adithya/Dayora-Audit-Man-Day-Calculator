import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { storage } from '@/lib/storage-db'
import { calculateAuditManDays } from '@/lib/audit-calculator-fixed'
import { validateCalculationInput } from '@/lib/audit-calculator-fixed'

// GET - Fetch all calculations for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const calculations = await storage.getCalculations(session.user.id)
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const validationErrors = await validateCalculationInput(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }
    
    // Calculate audit man-days using the fixed calculator
    const calculationResult = await calculateAuditManDays(body)
    
    // Prepare data for storage
    const calculationData = {
      ...body,
      userId: session.user.id,
      result: calculationResult.totalManDays,
      breakdown: calculationResult.breakdown,
      stage1ManDays: calculationResult.stageDistribution?.stage1,
      stage2ManDays: calculationResult.stageDistribution?.stage2,
      surveillanceManDays: calculationResult.surveillanceManDays,
      recertificationManDays: calculationResult.recertificationManDays,
    }
    
    const newCalculation = await storage.saveCalculation(calculationData)
    
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

// DELETE - Delete all calculations for the logged-in user
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await storage.clearCalculations(session.user.id)
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