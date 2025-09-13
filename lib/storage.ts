// Simple in-memory storage for Vercel deployment
// Note: This will reset on each serverless function cold start
// For production, consider using a database like Vercel KV, PlanetScale, or Supabase

interface SavedCalculation {
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

// In-memory storage (resets on cold start)
let calculations: SavedCalculation[] = []

export const storage = {
  async getCalculations(): Promise<SavedCalculation[]> {
    return calculations
  },

  async saveCalculation(calculation: Omit<SavedCalculation, 'id' | 'date'>): Promise<SavedCalculation> {
    const newCalculation: SavedCalculation = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...calculation
    }
    
    calculations.push(newCalculation)
    return newCalculation
  },

  async clearCalculations(): Promise<void> {
    calculations = []
  },

  async getStats() {
    const totalCalculations = calculations.length
    const totalManDays = calculations.reduce((sum, calc) => sum + (calc.result || 0), 0)
    const uniqueCompanies = new Set(calculations.map(calc => calc.companyName)).size
    const averageManDays = totalCalculations > 0 
      ? Math.round(totalManDays / totalCalculations)
      : 0

    return {
      totalCalculations,
      totalManDays,
      uniqueCompanies,
      averageManDays,
      standardBreakdown: calculations.reduce((acc, calc) => {
        acc[calc.standard] = (acc[calc.standard] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      auditTypeBreakdown: calculations.reduce((acc, calc) => {
        acc[calc.auditType] = (acc[calc.auditType] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      riskLevelBreakdown: calculations.reduce((acc, calc) => {
        acc[calc.riskLevel] = (acc[calc.riskLevel] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      recentCalculations: calculations
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    }
  }
}
