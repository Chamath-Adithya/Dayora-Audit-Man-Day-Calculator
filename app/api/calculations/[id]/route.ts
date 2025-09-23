import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { storage } from '@/lib/storage-db'

// DELETE - Delete a single calculation by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    await storage.deleteCalculation(id, session.user.id)

    // Log audit event
    await storage.logAuditEvent(
      'DELETE',
      'CALCULATION',
      id,
      { userId: session.user.id },
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