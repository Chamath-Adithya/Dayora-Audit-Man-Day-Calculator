import { NextResponse } from 'next/server'
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

// GET - Fetch calculation statistics
export async function GET() {
  try {
    const calculations = await readCalculations()
    
    const stats = {
      totalCalculations: calculations.length,
      totalManDays: calculations.reduce((sum: number, calc: any) => sum + (calc.result || 0), 0),
      uniqueCompanies: new Set(calculations.map((calc: any) => calc.companyName)).size,
      averageManDays: calculations.length > 0 
        ? Math.round(calculations.reduce((sum: number, calc: any) => sum + (calc.result || 0), 0) / calculations.length)
        : 0,
      standardBreakdown: calculations.reduce((acc: any, calc: any) => {
        acc[calc.standard] = (acc[calc.standard] || 0) + 1
        return acc
      }, {}),
      auditTypeBreakdown: calculations.reduce((acc: any, calc: any) => {
        acc[calc.auditType] = (acc[calc.auditType] || 0) + 1
        return acc
      }, {}),
      riskLevelBreakdown: calculations.reduce((acc: any, calc: any) => {
        acc[calc.riskLevel] = (acc[calc.riskLevel] || 0) + 1
        return acc
      }, {}),
      recentCalculations: calculations
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    }
    
    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}