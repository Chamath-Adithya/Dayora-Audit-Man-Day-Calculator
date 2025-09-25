
interface EmployeeRange {
  min: number;
  max: number;
  adjustment: number;
  description: string;
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
  employeeRanges: { min: number; max: number; adjustment: number, description: string }[]
  baseManDays: { [standard: string]: { [category: string]: number } }
  riskMultipliers: { low: number; medium: number; high: number }
  haccpMultiplier: number
  multiSiteMultiplier: number
  integratedSystemReduction: number
  integratedStandards: { id: string; name: string; reduction: number }[]
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
    const config = await response.json();
    configCache = config;
    return config;
  } catch (error) {
    console.error("Error fetching config, using default values:", error);
    // In case of an error, return the default config
    return {
      employeeRanges: [
        { min: 1, max: 5, adjustment: 0, description: "1-5 employees" },
        { min: 6, max: 25, adjustment: 0.5, description: "6-25 employees" },
        { min: 26, max: 45, adjustment: 1, description: "26-45 employees" },
        { min: 46, max: 65, adjustment: 1.5, description: "46-65 employees" },
        { min: 66, max: 85, adjustment: 2, description: "66-85 employees" },
        { min: 86, max: 125, adjustment: 2.5, description: "86-125 employees" },
        { min: 126, max: 175, adjustment: 3, description: "126-175 employees" },
        { min: 176, max: 275, adjustment: 4, description: "176-275 employees" },
        { min: 276, max: 425, adjustment: 5, description: "276-425 employees" },
        { min: 426, max: 625, adjustment: 6, description: "426-625 employees" },
        { min: 626, max: 875, adjustment: 7, description: "626-875 employees" },
        { min: 876, max: 1175, adjustment: 8, description: "876-1175 employees" },
        { min: 1176, max: 999999, adjustment: 10, description: "1176+ employees" },
      ],
      baseManDays: {
        QMS: { AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7, C: 8, D: 10, E: 12, F: 15, G: 18, H: 22, I: 27, J: 32, K: 38 },
        EMS: { AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7, C: 8, D: 10, E: 12, F: 15, G: 18, H: 22, I: 27, J: 32, K: 38 },
        EnMS: { AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7, C: 8, D: 10, E: 12, F: 15, G: 18, H: 22, I: 27, J: 32, K: 38 },
        FSMS: { AI: 4, AII: 5, BI: 6, BII: 7, BIII: 8, C: 10, D: 12, E: 15, F: 18, G: 22, H: 27, I: 32, J: 38, K: 45 },
        Cosmetics: { AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7, C: 8, D: 10, E: 12, F: 15, G: 18, H: 22, I: 27, J: 32, K: 38 },
        OHMS: { AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7, C: 8, D: 10, E: 12, F: 15, G: 18, H: 22, I: 27, J: 32, K: 38 },
        ISMS: { AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7, C: 8, D: 10, E: 12, F: 15, G: 18, H: 22, I: 27, J: 32, K: 38 },
      },
      riskMultipliers: { low: 0.8, medium: 1.0, high: 1.2 },
      haccpMultiplier: 0.5,
      multiSiteMultiplier: 0.5,
      integratedSystemReduction: 0.1,
      integratedStandards: [
        { "id": "ISO_14001", "name": "ISO 14001 (EMS)", "reduction": 0.12 },
        { "id": "ISO_45001", "name": "ISO 45001 (OH&S)", "reduction": 0.12 },
        { "id": "ISO_22000", "name": "ISO 22000 (FSMS)", "reduction": 0.15 },
        { "id": "ISO_27001", "name": "ISO 27001 (ISMS)", "reduction": 0.10 },
        { "id": "ISO_50001", "name": "ISO 50001 (EnMS)", "reduction": 0.08 },
        { "id": "ISO_9001", "name": "ISO 9001 (QMS)", "reduction": 0.05 },
        { "id": "HACCP", "name": "HACCP/GMP", "reduction": 0.08 },
        { "id": "BRC", "name": "BRC Global Standard", "reduction": 0.10 },
        { "id": "FSSC_22000", "name": "FSSC 22000", "reduction": 0.12 }
      ],
    };
  }
}
