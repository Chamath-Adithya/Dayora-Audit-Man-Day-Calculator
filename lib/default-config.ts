export const defaultConfig = {
  name: 'default',
  baseManDays: JSON.stringify({
    QMS: {
      AI: 2, AII: 3, BI: 4, BII: 5, BIII: 6,
      C: 7, D: 8, E: 10, F: 12, G: 15,
      H: 18, I: 22, J: 27, K: 32
    },
    EMS: {
      AI: 2, AII: 3, BI: 4, BII: 5, BIII: 6,
      C: 7, D: 8, E: 10, F: 12, G: 15,
      H: 18, I: 22, J: 27, K: 32
    },
    EnMS: {
      AI: 2, AII: 3, BI: 4, BII: 5, BIII: 6,
      C: 7, D: 8, E: 10, F: 12, G: 15,
      H: 18, I: 22, J: 27, K: 32
    },
    FSMS: {
      AI: 3, AII: 4, BI: 5, BII: 6, BIII: 7,
      C: 8, D: 10, E: 12, F: 15, G: 18,
      H: 22, I: 27, J: 32, K: 38
    },
    Cosmetics: {
      AI: 2, AII: 3, BI: 4, BII: 5, BIII: 6,
      C: 7, D: 8, E: 10, F: 12, G: 15,
      H: 18, I: 22, J: 27, K: 32
    }
  }),
  employeeRanges: JSON.stringify([
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
    { min: 1176, max: 999999, adjustment: 10, description: "1176+ employees" }
  ]),
  riskLevels: JSON.stringify([
    { id: "low", name: "Low", multiplier: 0.8, description: "Low complexity and risk" },
    { id: "medium", name: "Medium", multiplier: 1.0, description: "Standard complexity and risk" },
    { id: "high", name: "High", multiplier: 1.2, description: "High complexity and risk" }
  ]),
  haccpMultiplier: 0.5,
  multiSiteMultiplier: 0.5,
  integratedSystemReduction: 0.1,
  integratedStandards: JSON.stringify([
    { id: "ISO_14001", name: "ISO 14001", reduction: 0.1 },
    { id: "ISO_45001", name: "ISO 45001", reduction: 0.1 },
    { id: "ISO_22000", name: "ISO 22000", reduction: 0.15 },
  ]),
  categories: JSON.stringify(["AI", "AII", "BI", "BII", "BIII", "C", "D", "E", "F", "G", "H", "I", "J", "K"]),
  standards: JSON.stringify(["QMS", "EMS", "EnMS", "FSMS", "Cosmetics"]),
  isActive: true,
  description: 'Default IAF MD 5:2019 compliant configuration'
};
