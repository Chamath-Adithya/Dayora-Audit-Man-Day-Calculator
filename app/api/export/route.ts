import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage-db'

// POST - Export calculations as CSV
export async function POST(request: NextRequest) {
  try {
    const { filters } = await request.json()
    let calculations = await storage.getCalculations()
    
    // Apply filters if provided
    if (filters) {
      if (filters.standard && filters.standard !== 'all') {
        calculations = calculations.filter((calc: any) => calc.standard === filters.standard)
      }
      if (filters.auditType && filters.auditType !== 'all') {
        calculations = calculations.filter((calc: any) => calc.auditType === filters.auditType)
      }
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        calculations = calculations.filter((calc: any) => 
          calc.companyName.toLowerCase().includes(searchLower) ||
          calc.scope.toLowerCase().includes(searchLower)
        )
      }
    }
    
    // Create CSV content
    const headers = [
      'Date',
      'Company',
      'Scope',
      'Standard',
      'Audit Type',
      'Category',
      'Employees',
      'Sites',
      'Risk Level',
      'HACCP Studies',
      'Integrated Standards',
      'Result (Man-Days)'
    ]
    
    const csvRows = calculations.map((calc: any) => [
      new Date(calc.date).toISOString().split('T')[0],
      `"${calc.companyName.replace(/"/g, '""')}"`,
      `"${calc.scope.replace(/"/g, '""')}"`,
      calc.standard,
      calc.auditType,
      calc.category,
      calc.employees,
      calc.sites,
      calc.riskLevel,
      calc.haccpStudies || 0,
      `"${(calc.integratedStandards || []).join(', ')}"`,
      calc.result
    ])
    
    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n')
    
    // Return CSV content with appropriate headers
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-calculations-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Error exporting calculations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export calculations' },
      { status: 500 }
    )
  }
}