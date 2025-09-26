
interface EmployeeRange {
  min: number;
  max: number;
  adjustment: number;
  description: string;
  order: number; // Controls display order in admin tables
}

interface BaseManDays {
  [standard: string]: {
    [category: string]: number;
  };
}

interface RiskMultipliers {
  low: number;
  medium: number;
  high: number;
}

export interface AdminConfig {
  employeeRanges: { min: number; max: number; adjustment: number, description: string; order: number }[]
  baseManDays: { [standard: string]: { [category: string]: number } }
  riskLevels: { id: string; name: string; multiplier: number; description?: string; order: number }[]
  haccpMultiplier: number
  multiSiteMultiplier: number
  integratedSystemReduction: number
  integratedStandards: { id: string; name: string; reduction: number; order: number }[]
  categories: { name: string; order: number }[]
}

let configCache: AdminConfig | null = null;

export async function getConfig(): Promise<AdminConfig> {
  if (configCache) {
    return configCache;
  }

  try {
    const baseUrl = process.env.NEXTAUTH_URL || '';
    const response = await fetch(`${baseUrl}/api/config`);
    if (!response.ok) {
      throw new Error('Failed to fetch config');
    }
    const result = await response.json();
    
    // The API returns { success: true, data: config }, so we need to extract the data
    const config = result.success ? result.data : result;
    
    configCache = config;
    return config;
  } catch (error) {
    console.error("Error fetching config from database:", error);

    // Return empty configuration - everything must come from database
    return {
      employeeRanges: [],
      baseManDays: {},
      riskLevels: [
        { id: 'low', name: 'Low Risk', multiplier: 0.8, description: 'Low complexity and risk', order: 1 },
        { id: 'medium', name: 'Medium Risk', multiplier: 1.0, description: 'Standard complexity and risk', order: 2 },
        { id: 'high', name: 'High Risk', multiplier: 1.2, description: 'High complexity and risk', order: 3 }
      ],
      haccpMultiplier: 0,
      multiSiteMultiplier: 0,
      integratedSystemReduction: 0,
      integratedStandards: [],
      categories: [],
    };
  }
}
