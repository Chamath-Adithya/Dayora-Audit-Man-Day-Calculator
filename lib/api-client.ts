// API Client for backend communication

export interface CalculationData {
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
  result?: number
  breakdown?: any
  stage1ManDays?: number
  stage2ManDays?: number
  surveillanceManDays?: number
  recertificationManDays?: number
}

export interface SavedCalculation extends CalculationData {
  id: string
  createdAt: string
  updatedAt: string
  result: number
  stage1ManDays?: number
  stage2ManDays?: number
  surveillanceManDays?: number
  recertificationManDays?: number
  isDeleted: boolean
}

class ApiClient {
  private baseUrl = '/api'

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed')
      }
      
      return data.data
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Calculations API
  async getCalculations(): Promise<SavedCalculation[]> {
    return this.request<SavedCalculation[]>('/calculations')
  }

  async getCalculation(id: string): Promise<SavedCalculation> {
    return this.request<SavedCalculation>(`/calculations/${id}`)
  }

  async saveCalculation(calculation: CalculationData): Promise<SavedCalculation> {
    return this.request<SavedCalculation>('/calculations', {
      method: 'POST',
      body: JSON.stringify(calculation),
    })
  }

  async updateCalculation(id: string, calculation: Partial<CalculationData>): Promise<SavedCalculation> {
    return this.request<SavedCalculation>(`/calculations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(calculation),
    })
  }

  async deleteCalculation(id: string): Promise<void> {
    await this.request(`/calculations/${id}`, {
      method: 'DELETE',
    })
  }

  async deleteAllCalculations(): Promise<void> {
    await this.request('/calculations', {
      method: 'DELETE',
    })
  }

  // Statistics API
  async getStatistics(): Promise<{
    totalCalculations: number
    totalManDays: number
    uniqueCompanies: number
    averageManDays: number
    standardBreakdown: Record<string, number>
    auditTypeBreakdown: Record<string, number>
    riskLevelBreakdown: Record<string, number>
    recentCalculations: SavedCalculation[]
  }> {
    return this.request('/stats')
  }

  // Export API
  async exportCalculations(filters?: {
    standard?: string
    auditType?: string
    searchTerm?: string
  }): Promise<void> {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters }),
      })

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`)
      }

      // Create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-calculations-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      throw error
    }
  }
}

export const apiClient = new ApiClient()