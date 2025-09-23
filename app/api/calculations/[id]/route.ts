import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage-db'

// GET - Get specific calculation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  console.log(`[API] Received request for calculation ID: ${id}`)

  try {
    console.log(`[DB] Attempting to fetch calculation with ID: ${id}`)
    const calculation = await storage.getCalculation(id)

    if (!calculation) {
      console.warn(`[DB] Calculation with ID: ${id} not found`)
      return NextResponse.json(
        { success: false, error: 'Calculation not found' },
        { status: 404 }
      )
    }

    console.log(`[DB] Successfully fetched calculation with ID: ${id}`)
    return NextResponse.json({ success: true, data: calculation })
  } catch (error) {
    console.error(`[API] Critical error fetching calculation with ID: ${id}`, error)
    
    let errorMessage = 'Failed to fetch calculation'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

// PUT - Update specific calculation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  console.log(`[API] Received request to update calculation ID: ${id}`)

  try {
    const body = await request.json()
    
    const existingCalculation = await storage.getCalculation(id)
    if (!existingCalculation) {
      console.warn(`[DB] Update failed: Calculation with ID: ${id} not found`)
      return NextResponse.json(
        { success: false, error: 'Calculation not found' },
        { status: 404 }
      )
    }
    
    console.log(`[DB] Updating calculation with ID: ${id}`, { changes: body })
    const updatedCalculation = await storage.updateCalculation(id, body)
    
    await storage.logAuditEvent(
      'UPDATE',
      'CALCULATION',
      id,
      { changes: body },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      request.headers.get('user-agent') || undefined
    )
    
    console.log(`[DB] Successfully updated calculation with ID: ${id}`)
    return NextResponse.json({ 
      success: true, 
      data: updatedCalculation,
      message: 'Calculation updated successfully' 
    })
  } catch (error) {
    console.error(`[API] Critical error updating calculation with ID: ${id}`, error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update calculation' },
      { status: 500 }
    )
  }
}

// DELETE - Trash specific calculation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  console.log(`[API] Received request to trash calculation ID: ${id}`)

  try {
    const existingCalculation = await storage.getCalculation(id)
    if (!existingCalculation) {
      return NextResponse.json(
        { success: false, error: 'Calculation not found' },
        { status: 404 }
      )
    }

    console.log(`[DB] Trashing calculation with ID: ${id}`)
    await storage.deleteCalculation(id) // This now soft deletes

    await storage.logAuditEvent(
      'TRASH',
      'CALCULATION',
      id,
      { companyName: existingCalculation.companyName },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      request.headers.get('user-agent') || undefined
    )

    console.log(`[DB] Successfully trashed calculation with ID: ${id}`)
    return NextResponse.json({
      success: true,
      message: 'Calculation moved to trash successfully',
    })
  } catch (error) {
    console.error(`[API] Critical error trashing calculation with ID: ${id}`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to move calculation to trash' },
      { status: 500 }
    )
  }
}

// PATCH - Restore specific calculation
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  console.log(`[API] Received request to restore calculation ID: ${id}`)

  try {
    const existingCalculation = await storage.getCalculation(id)
    if (!existingCalculation) {
      return NextResponse.json(
        { success: false, error: 'Calculation not found' },
        { status: 404 }
      )
    }

    console.log(`[DB] Restoring calculation with ID: ${id}`)
    // Assuming you add a restoreCalculation method or adapt updateCalculation
    await storage.updateCalculation(id, { isDeleted: false })

    await storage.logAuditEvent(
      'RESTORE',
      'CALCULATION',
      id,
      { companyName: existingCalculation.companyName },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      request.headers.get('user-agent') || undefined
    )

    console.log(`[DB] Successfully restored calculation with ID: ${id}`)
    return NextResponse.json({
      success: true,
      message: 'Calculation restored successfully',
    })
  } catch (error) {
    console.error(`[API] Critical error restoring calculation with ID: ${id}`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to restore calculation' },
      { status: 500 }
    )
  }
}
