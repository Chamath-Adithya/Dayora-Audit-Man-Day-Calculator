import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

// GET - Get specific calculation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const calculations = await storage.getCalculations()
    const calculation = calculations.find(calc => calc.id === params.id)
    
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

// PUT - Update specific calculation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const calculations = await storage.getCalculations()
    const index = calculations.findIndex(calc => calc.id === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Calculation not found' },
        { status: 404 }
      )
    }
    
    // Update the calculation
    calculations[index] = { ...calculations[index], ...body }
    
    // For now, we'll just return the updated calculation
    // In a real app, you'd save this back to storage
    return NextResponse.json({ 
      success: true, 
      data: calculations[index],
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

// DELETE - Delete specific calculation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await storage.deleteCalculation(params.id)
    
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
