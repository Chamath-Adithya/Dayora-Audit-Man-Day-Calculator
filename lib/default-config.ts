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
    { min: 1, max: 5, adjustment: 0, description: "1-5 employees", order: 1 },
    { min: 6, max: 25, adjustment: 0.5, description: "6-25 employees", order: 2 },
    { min: 26, max: 45, adjustment: 1, description: "26-45 employees", order: 3 },
    { min: 46, max: 65, adjustment: 1.5, description: "46-65 employees", order: 4 },
    { min: 66, max: 85, adjustment: 2, description: "66-85 employees", order: 5 },
    { min: 86, max: 125, adjustment: 2.5, description: "86-125 employees", order: 6 },
    { min: 126, max: 175, adjustment: 3, description: "126-175 employees", order: 7 },
    { min: 176, max: 275, adjustment: 4, description: "176-275 employees", order: 8 },
    { min: 276, max: 425, adjustment: 5, description: "276-425 employees", order: 9 },
    { min: 426, max: 625, adjustment: 6, description: "426-625 employees", order: 10 },
    { min: 626, max: 875, adjustment: 7, description: "626-875 employees", order: 11 },
    { min: 876, max: 1175, adjustment: 8, description: "876-1175 employees", order: 12 },
    { min: 1176, max: 999999, adjustment: 10, description: "1176+ employees", order: 13 }
  ]),
  riskLevels: JSON.stringify([
    { id: "low", name: "Low", multiplier: 0.8, description: "Low complexity and risk", order: 1 },
    { id: "medium", name: "Medium", multiplier: 1.0, description: "Standard complexity and risk", order: 2 },
    { id: "high", name: "High", multiplier: 1.2, description: "High complexity and risk", order: 3 }
  ]),
  haccpMultiplier: 0.5,
  multiSiteMultiplier: 0.5,
  integratedSystemReduction: 0.1,
  integratedStandards: JSON.stringify([
    { id: "ISO_14001", name: "ISO 14001", reduction: 0.1, order: 1 },
    { id: "ISO_45001", name: "ISO 45001", reduction: 0.1, order: 2 },
    { id: "ISO_22000", name: "ISO 22000", reduction: 0.15, order: 3 },
  ]),
  categories: JSON.stringify([
    { name: "AI", order: 1 },
    { name: "AII", order: 2 },
    { name: "BI", order: 3 },
    { name: "BII", order: 4 },
    { name: "BIII", order: 5 },
    { name: "C", order: 6 },
    { name: "D", order: 7 },
    { name: "E", order: 8 },
    { name: "F", order: 9 },
    { name: "G", order: 10 },
    { name: "H", order: 11 },
    { name: "I", order: 12 },
    { name: "J", order: 13 },
    { name: "K", order: 14 }
  ]),
  isActive: true,
  description: 'Default IAF MD 5:2019 compliant configuration'
};
