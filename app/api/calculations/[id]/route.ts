import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage-db'

// GET - Get specific calculation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const calculation = await storage.getCalculation(params.id)
    
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
    
    // Check if calculation exists
    const existingCalculation = await storage.getCalculation(params.id)
    if (!existingCalculation) {
      return NextResponse.json(
        { success: false, error: 'Calculation not found' },
        { status: 404 }
      )
    }
    
    // Update the calculation
    const updatedCalculation = await storage.updateCalculation(params.id, body)
    
    // Log audit event
    await storage.logAuditEvent(
      'UPDATE',
      'CALCULATION',
      params.id,
      { changes: body },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    )
    
    return NextResponse.json({ 
      success: true, 
      data: updatedCalculation,
      message: 'Calculation updated successfully' 
    })
  } catch (error) {
    console.error('Error updating calculation:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update calculation' },
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
    // Check if calculation exists
    const existingCalculation = await storage.getCalculation(params.id)
    if (!existingCalculation) {
      return NextResponse.json(
        { success: false, error: 'Calculation not found' },
        { status: 404 }
      )
    }
    
    await storage.deleteCalculation(params.id)
    
    // Log audit event
    await storage.logAuditEvent(
      'DELETE',
      'CALCULATION',
      params.id,
      { companyName: existingCalculation.companyName },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    )
    
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
