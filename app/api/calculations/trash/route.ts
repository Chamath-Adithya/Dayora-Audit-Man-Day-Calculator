import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage-db'
import { prisma } from '@/lib/database'

// GET - Get all trashed calculations
export async function GET() {
  console.log('[API] Received request to get all trashed calculations')
  try {
    const trashedCalculations = await prisma.calculation.findMany({
      where: { isDeleted: true },
      orderBy: { updatedAt: 'desc' },
    })
    console.log(`[DB] Successfully fetched ${trashedCalculations.length} trashed calculations`)
    return NextResponse.json({ success: true, data: trashedCalculations })
  } catch (error) {
    console.error('[API] Critical error fetching trashed calculations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trashed calculations' },
      { status: 500 }
    )
  }
}

// DELETE - Permanently delete a specific calculation
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ success: false, error: 'Calculation ID is required' }, { status: 400 })
  }

  console.log(`[API] Received request to permanently delete calculation ID: ${id}`)
  try {
    await prisma.calculation.delete({ where: { id } })
    console.log(`[DB] Successfully permanently deleted calculation with ID: ${id}`)
    return NextResponse.json({ success: true, message: 'Calculation permanently deleted' })
  } catch (error) {
    console.error(`[API] Critical error permanently deleting calculation with ID: ${id}:`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to permanently delete calculation' },
      { status: 500 }
    )
  }
}

// POST - Clear all trashed calculations (permanently delete)
export async function POST(request: NextRequest) {
  console.log('[API] Received request to clear trash')
  try {
    await prisma.calculation.deleteMany({ where: { isDeleted: true } })
    console.log('[DB] Successfully cleared trash')
    return NextResponse.json({ success: true, message: 'Trash cleared successfully' })
  } catch (error) {
    console.error('[API] Critical error clearing trash:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to clear trash' },
      { status: 500 }
    )
  }
}
