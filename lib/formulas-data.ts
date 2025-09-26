export interface FormulaSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: FormulaContent[];
}

export interface FormulaContent {
  id: string;
  title: string;
  formula: string;
  explanation: string;
  examples: FormulaExample[];
  variables: FormulaVariable[];
}

export interface FormulaExample {
  description: string;
  inputs: Record<string, number>;
  calculation: string;
  result: number;
}

export interface FormulaVariable {
  name: string;
  description: string;
  type: 'input' | 'config' | 'calculated';
  unit?: string;
}

export const formulasData: FormulaSection[] = [
  {
    id: 'overview',
    title: 'Overview & Main Formula',
    icon: '📋',
    description: 'Complete audit man-days calculation overview with main formula',
    content: [
      {
        id: 'main-formula',
        title: 'Total Initial Audit Man-Days',
        formula: 'Total_Man_Days = Base_Man_Days + Employee_Adjustment + HACCP_Adjustment + Risk_Adjustment + Multi_Site_Adjustment + Integrated_System_Adjustment + Complexity_Adjustment',
        explanation: 'The main formula combines all adjustment factors to calculate the total audit man-days required for an initial certification audit.',
        examples: [
          {
            description: 'FSMS Category C, 120 employees, 2 sites, 3 HACCP studies, High Risk, ISO 14001 + ISO 45001',
            inputs: {
              baseManDays: 10,
              employeeAdjustment: 2.5,
              haccpAdjustment: 1.0,
              riskAdjustment: 2.0,
              multiSiteAdjustment: 12,
              integratedSystemAdjustment: -2.4,
              complexityAdjustment: 0
            } as Record<string, number>,
            calculation: '10 + 2.5 + 1.0 + 2.0 + 12 - 2.4 = 25.1',
            result: 26
          }
        ],
        variables: [
          { name: 'Base_Man_Days', description: 'Base man-days from standard and category', type: 'config', unit: 'days' },
          { name: 'Employee_Adjustment', description: 'Adjustment based on employee count ranges', type: 'calculated', unit: 'days' },
          { name: 'HACCP_Adjustment', description: 'Additional time for HACCP studies (FSMS only)', type: 'calculated', unit: 'days' },
          { name: 'Risk_Adjustment', description: 'Risk level multiplier adjustment', type: 'calculated', unit: 'days' },
          { name: 'Multi_Site_Adjustment', description: 'Additional time for multiple sites', type: 'calculated', unit: 'days' },
          { name: 'Integrated_System_Adjustment', description: 'Reduction for integrated management systems', type: 'calculated', unit: 'days' },
          { name: 'Complexity_Adjustment', description: 'Additional time for high complexity categories (I, J, K)', type: 'calculated', unit: 'days' }
        ]
      },
      {
        id: 'final-calculation',
        title: 'Final Calculation with Rounding',
        formula: 'Final_Man_Days = CEIL(Total_Man_Days + Complexity_Adjustment)',
        explanation: 'All calculations are rounded up to the nearest whole day for practical scheduling.',
        examples: [
          {
            description: 'Total calculation results in 25.1 days',
            inputs: { totalManDays: 25.1, complexityAdjustment: 0 },
            calculation: 'CEIL(25.1) = 26',
            result: 26
          }
        ],
        variables: [
          { name: 'Total_Man_Days', description: 'Sum of all adjustments before rounding', type: 'calculated', unit: 'days' },
          { name: 'Complexity_Adjustment', description: 'Additional 10% for categories I, J, K', type: 'calculated', unit: 'days' },
          { name: 'CEIL()', description: 'Round up to nearest whole number', type: 'input', unit: 'function' }
        ]
      }
    ]
  },
  {
    id: 'base-mandays',
    title: 'Base Man-Days by Standard',
    icon: '🏢',
    description: 'Base audit man-days for each management system standard and category',
    content: [
      {
        id: 'base-formula',
        title: 'Base Man-Days Formula',
        formula: 'Base_Man_Days = Config.baseManDays[standard][category]',
        explanation: 'Base man-days are determined by the specific standard and category combination, as defined in the IAF MD 5:2019 standard.',
        examples: [
          {
            description: 'FSMS Category C base man-days',
            inputs: { standard: 'FSMS', category: 'C' },
            calculation: 'Config.baseManDays["FSMS"]["C"] = 10',
            result: 10
          }
        ],
        variables: [
          { name: 'Config.baseManDays', description: 'Database configuration table', type: 'config' },
          { name: 'standard', description: 'Management system standard (QMS, EMS, FSMS, etc.)', type: 'input' },
          { name: 'category', description: 'Complexity category (AI, AII, BI, BII, BIII, C, D, E, F, G, H, I, J, K)', type: 'input' }
        ]
      },
      {
        id: 'standards-table',
        title: 'Available Standards',
        formula: 'Standards = ["QMS", "EMS", "EnMS", "FSMS", "Cosmetics", "OHMS", "ISMS"]',
        explanation: 'The system supports multiple management system standards with different base man-days.',
        examples: [],
        variables: [
          { name: 'QMS', description: 'Quality Management System (ISO 9001)', type: 'config' },
          { name: 'EMS', description: 'Environmental Management System (ISO 14001)', type: 'config' },
          { name: 'EnMS', description: 'Energy Management System (ISO 50001)', type: 'config' },
          { name: 'FSMS', description: 'Food Safety Management System (ISO 22000)', type: 'config' },
          { name: 'Cosmetics', description: 'Cosmetics GMP', type: 'config' },
          { name: 'OHMS', description: 'Occupational Health & Safety (ISO 45001)', type: 'config' },
          { name: 'ISMS', description: 'Information Security Management (ISO 27001)', type: 'config' }
        ]
      }
    ]
  },
  {
    id: 'employee-ranges',
    title: 'Employee Range Adjustments',
    icon: '👥',
    description: 'Employee count adjustments based on organization size ranges',
    content: [
      {
        id: 'employee-formula',
        title: 'Employee Adjustment Formula',
        formula: 'Employee_Adjustment = Range.adjustment WHERE employees BETWEEN min AND max',
        explanation: 'Employee adjustments are applied based on predefined employee count ranges, with each range having a specific adjustment value.',
        examples: [
          {
            description: '120 employees falls in range 86-125',
            inputs: { employees: 120, rangeMin: 86, rangeMax: 125, adjustment: 2.5 },
            calculation: '120 is BETWEEN 86 AND 125, so Employee_Adjustment = 2.5',
            result: 2.5
          }
        ],
        variables: [
          { name: 'employees', description: 'Total number of employees in organization', type: 'input' },
          { name: 'Range.min', description: 'Minimum employees for range', type: 'config' },
          { name: 'Range.max', description: 'Maximum employees for range', type: 'config' },
          { name: 'Range.adjustment', description: 'Man-days adjustment for this range', type: 'config', unit: 'days' }
        ]
      },
      {
        id: 'employee-ranges-table',
        title: 'Employee Range Bands',
        formula: 'Employee_Ranges = [1-5, 6-25, 26-45, 46-65, 66-85, 86-125, 126-175, 176-275, 276-425, 426-625, 626-875, 876-1175, 1176-∞]',
        explanation: 'Employee ranges are divided into 13 bands with increasing adjustments for larger organizations.',
        examples: [],
        variables: [
          { name: '1-5 employees', description: 'No adjustment (0 days)', type: 'config' },
          { name: '6-25 employees', description: '+0.5 days adjustment', type: 'config' },
          { name: '26-45 employees', description: '+1.0 days adjustment', type: 'config' },
          { name: '46-65 employees', description: '+1.5 days adjustment', type: 'config' },
          { name: '66-85 employees', description: '+2.0 days adjustment', type: 'config' },
          { name: '86-125 employees', description: '+2.5 days adjustment', type: 'config' },
          { name: '126-175 employees', description: '+3.0 days adjustment', type: 'config' },
          { name: '176-275 employees', description: '+4.0 days adjustment', type: 'config' },
          { name: '276-425 employees', description: '+5.0 days adjustment', type: 'config' },
          { name: '426-625 employees', description: '+6.0 days adjustment', type: 'config' },
          { name: '626-875 employees', description: '+7.0 days adjustment', type: 'config' },
          { name: '876-1175 employees', description: '+8.0 days adjustment', type: 'config' },
          { name: '1176+ employees', description: '+10.0 days adjustment', type: 'config' }
        ]
      }
    ]
  },
  {
    id: 'risk-multipliers',
    title: 'Risk Level Multipliers',
    icon: '⚠️',
    description: 'Risk level adjustments that modify base man-days by ±20%',
    content: [
      {
        id: 'risk-formula',
        title: 'Risk Adjustment Formula',
        formula: 'Risk_Adjustment = Base_Man_Days × (Risk_Multiplier - 1)',
        explanation: 'Risk levels adjust the base man-days by applying a multiplier. High risk increases time, low risk decreases time.',
        examples: [
          {
            description: 'Base: 10 days, High Risk (1.2 multiplier)',
            inputs: { baseManDays: 10, riskMultiplier: 1.2 },
            calculation: '10 × (1.2 - 1) = 2.0',
            result: 2
          },
          {
            description: 'Base: 10 days, Low Risk (0.8 multiplier)',
            inputs: { baseManDays: 10, riskMultiplier: 0.8 },
            calculation: '10 × (0.8 - 1) = -2.0',
            result: -2
          }
        ],
        variables: [
          { name: 'Base_Man_Days', description: 'Base man-days from standard and category', type: 'calculated', unit: 'days' },
          { name: 'Risk_Multiplier', description: 'Risk level multiplier from configuration', type: 'config' },
          { name: 'Risk_Adjustment', description: 'Positive for high risk, negative for low risk', type: 'calculated', unit: 'days' }
        ]
      },
      {
        id: 'risk-levels',
        title: 'Risk Level Definitions',
        formula: 'Risk_Levels = { low: 0.8, medium: 1.0, high: 1.2 }',
        explanation: 'Three risk levels with corresponding multipliers that adjust audit duration.',
        examples: [],
        variables: [
          { name: 'Low Risk', description: '0.8 multiplier (20% reduction)', type: 'config' },
          { name: 'Medium Risk', description: '1.0 multiplier (no change)', type: 'config' },
          { name: 'High Risk', description: '1.2 multiplier (20% increase)', type: 'config' }
        ]
      }
    ]
  },
  {
    id: 'multi-site',
    title: 'Multi-Site Calculations',
    icon: '🏭',
    description: 'Complex calculations for organizations with multiple sites',
    content: [
      {
        id: 'multi-site-formula',
        title: 'Multi-Site Adjustment Formula',
        formula: `if (sites > 1) {
  Central_Function_Time = Base_Man_Days + Employee_Adjustment
  Additional_Sites_Time = (sites - 1) × (Base_Man_Days × 0.5)
  Multi_Site_Adjustment = Central_Function_Time + Additional_Sites_Time - Base_Man_Days
}`,
        explanation: 'Multi-site calculations account for central function coordination and additional site audits.',
        examples: [
          {
            description: 'Base: 10 days, Employees: 2 days, Sites: 3',
            inputs: { baseManDays: 10, employeeAdjustment: 2, sites: 3 },
            calculation: 'Central_Function_Time = 10 + 2 = 12, Additional_Sites_Time = 2 × (10 × 0.5) = 10, Multi_Site_Adjustment = 12 + 10 - 10 = 12',
            result: 12
          }
        ],
        variables: [
          { name: 'sites', description: 'Number of sites in organization', type: 'input' },
          { name: 'Base_Man_Days', description: 'Base man-days from standard and category', type: 'calculated', unit: 'days' },
          { name: 'Employee_Adjustment', description: 'Employee count adjustment', type: 'calculated', unit: 'days' },
          { name: 'Central_Function_Time', description: 'Time for central function audit', type: 'calculated', unit: 'days' },
          { name: 'Additional_Sites_Time', description: 'Time for additional site audits', type: 'calculated', unit: 'days' },
          { name: 'Multi_Site_Adjustment', description: 'Total additional time for multi-site', type: 'calculated', unit: 'days' }
        ]
      }
    ]
  },
  {
    id: 'integrated-standards',
    title: 'Integrated Standards',
    icon: '🔗',
    description: 'Reductions for integrated management system audits',
    content: [
      {
        id: 'integrated-formula',
        title: 'Integrated Standards Reduction',
        formula: `Integrated_Reduction = Σ(standard.reduction) for each selected standard
if (multiple standards selected) {
  Integrated_Reduction = MAX(Integrated_Reduction, 0.05)
}
Integrated_Adjustment = -(Base_Man_Days × Integrated_Reduction)`,
        explanation: 'Integrated standards provide efficiency reductions when multiple standards are audited together.',
        examples: [
          {
            description: 'Base: 10 days, ISO 14001 (12%) + ISO 45001 (12%)',
            inputs: { baseManDays: 10, reduction1: 0.12, reduction2: 0.12 },
            calculation: 'Integrated_Reduction = MAX(0.12 + 0.12, 0.05) = 0.24, Integrated_Adjustment = -(10 × 0.24) = -2.4',
            result: -2.4
          }
        ],
        variables: [
          { name: 'Base_Man_Days', description: 'Base man-days from standard and category', type: 'calculated', unit: 'days' },
          { name: 'standard.reduction', description: 'Reduction percentage for each integrated standard', type: 'config' },
          { name: 'Integrated_Reduction', description: 'Total reduction percentage', type: 'calculated' },
          { name: 'Integrated_Adjustment', description: 'Negative value (reduction) applied to total', type: 'calculated', unit: 'days' }
        ]
      },
      {
        id: 'minimum-threshold',
        title: 'Minimum Reduction Rule',
        formula: 'if (multiple standards selected) { Integrated_Reduction = MAX(Integrated_Reduction, 0.05) }',
        explanation: 'When multiple standards are selected, there is a minimum 5% reduction to account for integration efficiencies.',
        examples: [],
        variables: [
          { name: 'multiple standards', description: 'Two or more integrated standards selected', type: 'input' },
          { name: 'Integrated_Reduction', description: 'Calculated reduction percentage', type: 'calculated' },
          { name: '0.05', description: 'Minimum 5% reduction threshold', type: 'config' }
        ]
      }
    ]
  },
  {
    id: 'stage-distribution',
    title: 'Stage Distribution',
    icon: '📈',
    description: 'How initial audits are split between Stage 1 and Stage 2',
    content: [
      {
        id: 'stage1-formula',
        title: 'Stage 1 Man-Days',
        formula: 'Stage_1 = MAX(1, MIN(3, CEIL(Total_Man_Days × 0.3)))',
        explanation: 'Stage 1 is 30% of total man-days, with a minimum of 1 day and maximum of 3 days.',
        examples: [
          {
            description: 'Total: 10 days',
            inputs: { totalManDays: 10 },
            calculation: 'MAX(1, MIN(3, CEIL(10 × 0.3))) = MAX(1, MIN(3, 3)) = 3',
            result: 3
          }
        ],
        variables: [
          { name: 'Total_Man_Days', description: 'Total calculated man-days', type: 'calculated', unit: 'days' },
          { name: '0.3', description: '30% allocation for Stage 1', type: 'config' },
          { name: 'CEIL()', description: 'Round up to nearest whole number', type: 'input', unit: 'function' },
          { name: 'MAX(1, ...)', description: 'Minimum 1 day for Stage 1', type: 'input', unit: 'function' },
          { name: 'MIN(3, ...)', description: 'Maximum 3 days for Stage 1', type: 'input', unit: 'function' }
        ]
      },
      {
        id: 'stage2-formula',
        title: 'Stage 2 Man-Days',
        formula: 'Stage_2 = CEIL(Total_Man_Days × 0.7)',
        explanation: 'Stage 2 receives 70% of total man-days, rounded up to the nearest whole day.',
        examples: [
          {
            description: 'Total: 10 days',
            inputs: { totalManDays: 10 },
            calculation: 'CEIL(10 × 0.7) = CEIL(7) = 7',
            result: 7
          }
        ],
        variables: [
          { name: 'Total_Man_Days', description: 'Total calculated man-days', type: 'calculated', unit: 'days' },
          { name: '0.7', description: '70% allocation for Stage 2', type: 'config' },
          { name: 'CEIL()', description: 'Round up to nearest whole number', type: 'input', unit: 'function' }
        ]
      }
    ]
  },
  {
    id: 'surveillance-recertification',
    title: 'Surveillance & Recertification',
    icon: '🔄',
    description: 'Formulas for ongoing surveillance and recertification audits',
    content: [
      {
        id: 'surveillance-formula',
        title: 'Surveillance Audit Man-Days',
        formula: 'Surveillance_Man_Days = CEIL(Total_Man_Days × 0.33)',
        explanation: 'Surveillance audits require 33% of the initial audit man-days, rounded up.',
        examples: [
          {
            description: 'Initial audit: 10 days',
            inputs: { totalManDays: 10 },
            calculation: 'CEIL(10 × 0.33) = CEIL(3.3) = 4',
            result: 4
          }
        ],
        variables: [
          { name: 'Total_Man_Days', description: 'Initial audit total man-days', type: 'calculated', unit: 'days' },
          { name: '0.33', description: '33% of initial audit', type: 'config' },
          { name: 'CEIL()', description: 'Round up to nearest whole number', type: 'input', unit: 'function' }
        ]
      },
      {
        id: 'recertification-formula',
        title: 'Recertification Audit Man-Days',
        formula: 'Recertification_Man_Days = CEIL(Total_Man_Days × 0.67)',
        explanation: 'Recertification audits require 67% of the initial audit man-days, rounded up.',
        examples: [
          {
            description: 'Initial audit: 10 days',
            inputs: { totalManDays: 10 },
            calculation: 'CEIL(10 × 0.67) = CEIL(6.7) = 7',
            result: 7
          }
        ],
        variables: [
          { name: 'Total_Man_Days', description: 'Initial audit total man-days', type: 'calculated', unit: 'days' },
          { name: '0.67', description: '67% of initial audit', type: 'config' },
          { name: 'CEIL()', description: 'Round up to nearest whole number', type: 'input', unit: 'function' }
        ]
      }
    ]
  },
  {
    id: 'haccp-studies',
    title: 'HACCP Studies',
    icon: '🍽️',
    description: 'Additional time calculations for HACCP studies in FSMS audits',
    content: [
      {
        id: 'haccp-formula',
        title: 'HACCP Studies Formula',
        formula: 'HACCP_Adjustment = (haccpStudies - 1) × Config.haccpMultiplier',
        explanation: 'HACCP studies require additional audit time. The first study is included in base man-days, additional studies add incremental time.',
        examples: [
          {
            description: '3 HACCP studies with 0.5 multiplier',
            inputs: { haccpStudies: 3, haccpMultiplier: 0.5 },
            calculation: '(3 - 1) × 0.5 = 1.0',
            result: 1
          }
        ],
        variables: [
          { name: 'haccpStudies', description: 'Number of HACCP studies', type: 'input' },
          { name: 'Config.haccpMultiplier', description: 'Man-days per additional HACCP study', type: 'config', unit: 'days' },
          { name: 'HACCP_Adjustment', description: 'Additional time for HACCP studies', type: 'calculated', unit: 'days' }
        ]
      },
      {
        id: 'haccp-notes',
        title: 'HACCP Calculation Notes',
        formula: 'Only applies to FSMS standard',
        explanation: 'HACCP study calculations are only applied when the FSMS (Food Safety Management System) standard is selected.',
        examples: [],
        variables: [
          { name: 'FSMS', description: 'Food Safety Management System standard', type: 'config' },
          { name: 'haccpStudies', description: 'Only used when standard is FSMS', type: 'input' },
          { name: 'First Study', description: 'Included in base man-days (no additional cost)', type: 'config' },
          { name: 'Additional Studies', description: 'Add incremental time based on multiplier', type: 'calculated', unit: 'days' }
        ]
      }
    ]
  },
  {
    id: 'complexity-adjustment',
    title: 'Complexity Adjustment',
    icon: '🧩',
    description: 'Additional time for high complexity categories (I, J, K)',
    content: [
      {
        id: 'complexity-formula',
        title: 'Complexity Adjustment Formula',
        formula: `Complexity_Categories = ['I', 'J', 'K']
if (category IN Complexity_Categories) {
  Complexity_Adjustment = Total_Man_Days × 0.1
} else {
  Complexity_Adjustment = 0
}`,
        explanation: 'Categories I, J, and K are considered high complexity and receive an additional 10% time allocation.',
        examples: [
          {
            description: 'Total: 10 days, Category J',
            inputs: { totalManDays: 10, category: 'J' },
            calculation: 'Category J is in Complexity_Categories, so Complexity_Adjustment = 10 × 0.1 = 1.0',
            result: 1
          },
          {
            description: 'Total: 10 days, Category C',
            inputs: { totalManDays: 10, category: 'C' },
            calculation: 'Category C is not in Complexity_Categories, so Complexity_Adjustment = 0',
            result: 0
          }
        ],
        variables: [
          { name: 'category', description: 'Complexity category (AI, AII, BI, BII, BIII, C, D, E, F, G, H, I, J, K)', type: 'input' },
          { name: 'Complexity_Categories', description: 'Categories I, J, K require additional time', type: 'config' },
          { name: 'Total_Man_Days', description: 'Total calculated man-days before complexity adjustment', type: 'calculated', unit: 'days' },
          { name: '0.1', description: '10% additional time for complexity', type: 'config' },
          { name: 'Complexity_Adjustment', description: 'Additional time for high complexity categories', type: 'calculated', unit: 'days' }
        ]
      }
    ]
  },
  {
    id: 'validation-rules',
    title: 'Validation Rules',
    icon: '✅',
    description: 'Input validation requirements and business rules',
    content: [
      {
        id: 'input-validation',
        title: 'Input Validation Requirements',
        formula: 'All inputs must pass validation checks',
        explanation: 'Comprehensive validation ensures data quality and prevents calculation errors.',
        examples: [],
        variables: [
          { name: 'Company Name', description: 'Required, non-empty string', type: 'input' },
          { name: 'Scope', description: 'Required, non-empty string', type: 'input' },
          { name: 'Standard', description: 'Must exist in configuration', type: 'input' },
          { name: 'Category', description: 'Must exist for selected standard', type: 'input' },
          { name: 'Employees', description: '≥ 1, integer', type: 'input' },
          { name: 'Sites', description: '≥ 1, integer', type: 'input' },
          { name: 'HACCP Studies', description: '≥ 0, integer (FSMS only)', type: 'input' },
          { name: 'Risk Level', description: 'Must be "low", "medium", or "high"', type: 'input' },
          { name: 'Integrated Standards', description: 'Array of valid standard names', type: 'input' }
        ]
      },
      {
        id: 'business-rules',
        title: 'Business Rule Constraints',
        formula: 'Business rules enforce logical constraints',
        explanation: 'Business rules ensure calculations follow established audit practices and standards.',
        examples: [],
        variables: [
          { name: 'HACCP Studies', description: 'Only allowed for FSMS standard', type: 'input' },
          { name: 'Category Availability', description: 'Depends on selected standard', type: 'config' },
          { name: 'Minimum Man-Days', description: 'Always ≥ 1 day', type: 'calculated' },
          { name: 'Stage 1 Limits', description: '1-3 days maximum for initial audits', type: 'calculated' },
          { name: 'Integrated Standards', description: 'Must be configured in system', type: 'config' },
          { name: 'Risk Levels', description: 'Must be configured in system', type: 'config' }
        ]
      }
    ]
  }
];

export function searchFormulas(query: string): FormulaSection[] {
  if (!query.trim()) return formulasData;

  const searchTerm = query.toLowerCase();

  return formulasData.map(section => ({
    ...section,
    content: section.content.filter(content =>
      content.title.toLowerCase().includes(searchTerm) ||
      content.explanation.toLowerCase().includes(searchTerm) ||
      content.formula.toLowerCase().includes(searchTerm) ||
      content.variables.some(variable =>
        variable.name.toLowerCase().includes(searchTerm) ||
        variable.description.toLowerCase().includes(searchTerm)
      ) ||
      content.examples.some(example =>
        example.description.toLowerCase().includes(searchTerm) ||
        example.calculation.toLowerCase().includes(searchTerm)
      )
    )
  })).filter(section => section.content.length > 0);
}

export function getFormulaById(sectionId: string, contentId: string) {
  const section = formulasData.find(s => s.id === sectionId);
  if (!section) return null;

  const content = section.content.find(c => c.id === contentId);
  return content ? { section, content } : null;
}
