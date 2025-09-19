import { prisma } from './database'
import { z } from 'zod'

// Validate environment
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Validation schemas
const CalculationInputSchema = z.object({
  companyName: z.string().min(1),
  scope: z.string().min(1),
  standard: z.string().min(1),
  auditType: z.string().min(1),
  category: z.string().min(1),
  employees: z.number().int().positive(),
  sites: z.number().int().positive(),
  haccpStudies: z.number().int().min(0),
  riskLevel: z.string().min(1),
  integratedStandards: z.array(z.string()),
  result: z.number().positive(),
  breakdown: z.any().optional(),
  stage1ManDays: z.number().optional(),
  stage2ManDays: z.number().optional(),
  surveillanceManDays: z.number().optional(),
  recertificationManDays: z.number().optional(),
})

const UpdateCalculationSchema = CalculationInputSchema.partial()

export interface SavedCalculation {
  id: string
  createdAt: Date
  updatedAt: Date
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
  stage1ManDays?: number
  stage2ManDays?: number
  surveillanceManDays?: number
  recertificationManDays?: number
  isDeleted: boolean
}

export const storage = {
  async getCalculations(): Promise<SavedCalculation[]> {
    try {
      const calculations = await prisma.calculation.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
      })
      
      return calculations.map(calc => {
        let integratedStandards: string[] = []
        try {
          if (typeof calc.integratedStandards === 'string') {
            integratedStandards = JSON.parse(calc.integratedStandards)
          } else if (Array.isArray(calc.integratedStandards)) {
            integratedStandards = calc.integratedStandards
          }
        } catch (e) {
          console.error(`Failed to parse integratedStandards for calculation ${calc.id}:`, e)
        }

        let breakdown: any | undefined = undefined
        try {
          if (calc.breakdown && typeof calc.breakdown === 'string') {
            breakdown = JSON.parse(calc.breakdown)
          }
        } catch (e) {
          console.error(`Failed to parse breakdown for calculation ${calc.id}:`, e)
        }

        return {
          ...calc,
          integratedStandards,
          breakdown,
        }
      })
    } catch (error) {
      console.error('Error fetching calculations:', error)
      throw new Error('Failed to fetch calculations')
    }
  },

  async getCalculation(id: string): Promise<SavedCalculation | null> {
    try {
      const calculation = await prisma.calculation.findFirst({
        where: { id, isDeleted: false },
      })
      
      if (!calculation) return null
      
      let integratedStandards: string[] = []
      try {
        if (typeof calculation.integratedStandards === 'string') {
          integratedStandards = JSON.parse(calculation.integratedStandards)
        } else if (Array.isArray(calculation.integratedStandards)) {
          integratedStandards = calculation.integratedStandards
        }
      } catch (e) {
        console.error(`Failed to parse integratedStandards for calculation ${calculation.id}:`, e)
      }

      let breakdown: any | undefined = undefined
      try {
        if (calculation.breakdown && typeof calculation.breakdown === 'string') {
          breakdown = JSON.parse(calculation.breakdown)
        }
      } catch (e) {
        console.error(`Failed to parse breakdown for calculation ${calculation.id}:`, e)
      }

      return {
        ...calculation,
        integratedStandards,
        breakdown,
      }
    } catch (error) {
      console.error('Error fetching calculation:', error)
      throw new Error('Failed to fetch calculation')
    }
  },

  async saveCalculation(calculation: Omit<SavedCalculation, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>): Promise<SavedCalculation> {
    try {
      // Validate input
      const validatedData = CalculationInputSchema.parse(calculation)

      // Sanitize breakdown object
      let sanitizedBreakdown: string | null = null;
      if (validatedData.breakdown) {
        const breakdown = validatedData.breakdown as Record<string, any>;
        const sanitized: Record<string, any> = {};
        for (const key in breakdown) {
          if (Object.prototype.hasOwnProperty.call(breakdown, key)) {
            const value = breakdown[key];
            sanitized[key] = typeof value === 'number' && !Number.isFinite(value) ? null : value;
          }
        }
        sanitizedBreakdown = JSON.stringify(sanitized);
      }
      
      const newCalculation = await prisma.calculation.create({
        data: {
          ...validatedData,
          integratedStandards: JSON.stringify(validatedData.integratedStandards),
          breakdown: sanitizedBreakdown,
        },
      })
      
      return {
        ...newCalculation,
        integratedStandards: validatedData.integratedStandards,
        breakdown: validatedData.breakdown,
      }
    } catch (error: any) {
      console.error('Error saving calculation:', error)
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`)
      }
      // Handle Prisma errors
      if (error.code === 'P2002') {
        throw new Error('A calculation with this data already exists')
      }
      if (error.code === 'P2025') {
        throw new Error('Related record not found')
      }
      // Log the full error object for debugging
      console.error('Database error details:', {
        code: error.code,
        message: error.message,
        meta: error.meta
      })
      throw new Error('Failed to save calculation')
    }
  },

  async updateCalculation(id: string, updates: Partial<Omit<SavedCalculation, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SavedCalculation> {
    try {
      // Validate input
      const validatedData = UpdateCalculationSchema.parse(updates)
      
      const updatedCalculation = await prisma.calculation.update({
        where: { id },
        data: {
          ...validatedData,
          integratedStandards: validatedData.integratedStandards 
            ? JSON.stringify(validatedData.integratedStandards) 
            : undefined,
          breakdown: validatedData.breakdown 
            ? JSON.stringify(validatedData.breakdown) 
            : undefined,
        },
      })
      
      let integratedStandards: string[] = []
      try {
        if (typeof updatedCalculation.integratedStandards === 'string') {
          integratedStandards = JSON.parse(updatedCalculation.integratedStandards)
        } else if (Array.isArray(updatedCalculation.integratedStandards)) {
          integratedStandards = updatedCalculation.integratedStandards
        }
      } catch (e) {
        console.error(`Failed to parse integratedStandards for calculation ${updatedCalculation.id}:`, e)
      }

      let breakdown: any | undefined = undefined
      try {
        if (updatedCalculation.breakdown && typeof updatedCalculation.breakdown === 'string') {
          breakdown = JSON.parse(updatedCalculation.breakdown)
        }
      } catch (e) {
        console.error(`Failed to parse breakdown for calculation ${updatedCalculation.id}:`, e)
      }

      return {
        ...updatedCalculation,
        integratedStandards,
        breakdown,
      }
    } catch (error) {
      console.error('Error updating calculation:', error)
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`)
      }
      throw new Error('Failed to update calculation')
    }
  },

  async deleteCalculation(id: string): Promise<void> {
    try {
      await prisma.calculation.delete({ where: { id } })
    } catch (error) {
      console.error('Error deleting calculation:', error)
      throw new Error('Failed to delete calculation')
    }
  },

  async clearCalculations(): Promise<void> {
    try {
      await prisma.calculation.updateMany({
        where: { isDeleted: false },
        data: { isDeleted: true },
      })
    } catch (error) {
      console.error('Error clearing calculations:', error)
      throw new Error('Failed to clear calculations')
    }
  },

  async getStats() {
    try {
      const [
        totalCalculations,
        calculations,
        uniqueCompanies,
      ] = await Promise.all([
        prisma.calculation.count({ where: { isDeleted: false } }),
        prisma.calculation.findMany({ 
          where: { isDeleted: false },
          select: {
            result: true,
            companyName: true,
            standard: true,
            auditType: true,
            riskLevel: true,
            createdAt: true,
          }
        }),
        prisma.calculation.findMany({
          where: { isDeleted: false },
          select: { companyName: true },
          distinct: ['companyName'],
        }),
      ])

      const totalManDays = calculations.reduce((sum, calc) => sum + (calc.result || 0), 0)
      const averageManDays = totalCalculations > 0 
        ? Math.round(totalManDays / totalCalculations)
        : 0

      const standardBreakdown = calculations.reduce((acc, calc) => {
        acc[calc.standard] = (acc[calc.standard] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const auditTypeBreakdown = calculations.reduce((acc, calc) => {
        acc[calc.auditType] = (acc[calc.auditType] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const riskLevelBreakdown = calculations.reduce((acc, calc) => {
        acc[calc.riskLevel] = (acc[calc.riskLevel] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const recentCalculations = calculations
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

      return {
        totalCalculations,
        totalManDays,
        uniqueCompanies: uniqueCompanies.length,
        averageManDays,
        standardBreakdown,
        auditTypeBreakdown,
        riskLevelBreakdown,
        recentCalculations,
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      throw new Error('Failed to fetch statistics')
    }
  },

  // Admin configuration methods
  async getAdminConfig(name: string = 'default') {
    try {
      const config = await prisma.adminConfig.findUnique({
        where: { name },
      })
      
      if (!config) {
        // Return default configuration
        return {
          id: 'default',
          name: 'default',
          baseManDays: {},
          employeeRanges: [],
          riskMultipliers: {},
          haccpMultiplier: 0.5,
          multiSiteMultiplier: 0.5,
          integratedSystemReduction: 0.1,
          isActive: true,
          description: 'Default configuration',
        }
      }
      
      return {
        ...config,
        baseManDays: JSON.parse(config.baseManDays as string),
        employeeRanges: JSON.parse(config.employeeRanges as string),
        riskMultipliers: JSON.parse(config.riskMultipliers as string),
      }
    } catch (error) {
      console.error('Error fetching admin config:', error)
      throw new Error('Failed to fetch admin configuration')
    }
  },

  async saveAdminConfig(config: any) {
    try {
      const configData = {
        name: config.name || 'default',
        baseManDays: JSON.stringify(config.baseManDays || {}),
        employeeRanges: JSON.stringify(config.employeeRanges || []),
        riskMultipliers: JSON.stringify(config.riskMultipliers || {}),
        haccpMultiplier: config.haccpMultiplier || 0.5,
        multiSiteMultiplier: config.multiSiteMultiplier || 0.5,
        integratedSystemReduction: config.integratedSystemReduction || 0.1,
        isActive: config.isActive !== false,
        description: config.description,
      }
      
      return await prisma.adminConfig.upsert({
        where: { name: configData.name },
        update: configData,
        create: configData,
      })
    } catch (error) {
      console.error('Error saving admin config:', error)
      throw new Error('Failed to save admin configuration')
    }
  },

  // Audit logging
  async logAuditEvent(action: string, entityType: string, entityId?: string, details?: any, ipAddress?: string, userAgent?: string) {
    try {
      await prisma.auditLog.create({
        data: {
          action,
          entityType,
          entityId,
          details: details ? JSON.stringify(details) : null,
          ipAddress,
          userAgent,
        },
      })
    } catch (error) {
      console.error('Error logging audit event:', error)
      // Don't throw error for logging failures
    }
  },
}