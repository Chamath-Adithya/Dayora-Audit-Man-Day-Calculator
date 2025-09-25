# Audit Man-Days Calculation Formulas

## Overview

This document provides comprehensive formulas for calculating audit man-days based on IAF MD 5:2019 and ISO/TS 22003:2022 standards. All calculations are configurable through the admin interface and stored in the database.

## Main Calculation Formula

### Total Initial Audit Man-Days

```
Total_Man_Days = Base_Man_Days + Employee_Adjustment + HACCP_Adjustment + Risk_Adjustment + Multi_Site_Adjustment + Integrated_System_Adjustment + Complexity_Adjustment
```

### Final Calculation with Rounding

```
Final_Man_Days = CEIL(Total_Man_Days + Complexity_Adjustment)
```

---

## Component Calculations

### 1. Base Man-Days (T_D)

**Formula:**
```
Base_Man_Days = Config.baseManDays[standard][category]
```

**Standards Available:**
- QMS (Quality Management System)
- EMS (Environmental Management System)
- EnMS (Energy Management System)
- FSMS (Food Safety Management System)
- Cosmetics (GMP)
- OHMS (Occupational Health & Safety)
- ISMS (Information Security Management)

**Categories (AI-K):**
- AI, AII, BI, BII, BIII, C, D, E, F, G, H, I, J, K

**Example Values:**
```
FSMS Category C: 10 days
QMS Category K: 38 days
EMS Category AI: 3 days
```

### 2. Employee Adjustment (T_FTE)

**Formula:**
```
Employee_Adjustment = Range.adjustment WHERE employees BETWEEN min AND max
```

**Employee Ranges:**
| Min | Max | Adjustment | Description |
|-----|-----|------------|-------------|
| 1 | 5 | 0 | 1-5 employees |
| 6 | 25 | 0.5 | 6-25 employees |
| 26 | 45 | 1 | 26-45 employees |
| 46 | 65 | 1.5 | 46-65 employees |
| 66 | 85 | 2 | 66-85 employees |
| 86 | 125 | 2.5 | 86-125 employees |
| 126 | 175 | 3 | 126-175 employees |
| 176 | 275 | 4 | 176-275 employees |
| 276 | 425 | 5 | 276-425 employees |
| 426 | 625 | 6 | 426-625 employees |
| 626 | 875 | 7 | 626-875 employees |
| 876 | 1175 | 8 | 876-1175 employees |
| 1176 | ∞ | 10 | 1176+ employees |

### 3. HACCP Studies Adjustment (T_H)

**Formula:**
```
HACCP_Adjustment = (haccpStudies - 1) × Config.haccpMultiplier
```

**Notes:**
- Only applies to FSMS standard
- First HACCP study is included in base man-days
- Additional studies add incremental time
- Default multiplier: 0.5 days per additional study

**Example:**
```
HACCP Studies: 3
HACCP_Adjustment = (3 - 1) × 0.5 = 1.0 day
```

### 4. Risk Level Adjustment

**Formula:**
```
Risk_Adjustment = Base_Man_Days × (Risk_Multiplier - 1)
```

**Risk Multipliers:**
- Low Risk: 0.8 (20% reduction)
- Medium Risk: 1.0 (no change)
- High Risk: 1.2 (20% increase)

**Example:**
```
Base: 10 days, High Risk
Risk_Adjustment = 10 × (1.2 - 1) = 2.0 days
Total = 10 + 2.0 = 12 days
```

### 5. Multi-Site Adjustment

**Formula:**
```
if (sites > 1) {
    Central_Function_Time = Base_Man_Days + Employee_Adjustment
    Additional_Sites_Time = (sites - 1) × (Base_Man_Days × 0.5)
    Multi_Site_Adjustment = Central_Function_Time + Additional_Sites_Time - Base_Man_Days
}
```

**Example:**
```
Base: 10 days, Employees: 2 days, Sites: 3
Central_Function_Time = 10 + 2 = 12 days
Additional_Sites_Time = 2 × (10 × 0.5) = 10 days
Multi_Site_Adjustment = 12 + 10 - 10 = 12 days
```

### 6. Integrated Standards Reduction

**Formula:**
```
Integrated_Reduction = Σ(standard.reduction) for each selected standard
if (multiple standards selected) {
    Integrated_Reduction = MAX(Integrated_Reduction, 0.05) // Minimum 5%
}
Integrated_Adjustment = -(Base_Man_Days × Integrated_Reduction)
```

**Available Standards:**
| Standard | Reduction | Description |
|----------|-----------|-------------|
| ISO 14001 (EMS) | 12% | Environmental Management |
| ISO 45001 (OH&S) | 12% | Occupational Health & Safety |
| ISO 22000 (FSMS) | 15% | Food Safety Management |
| ISO 27001 (ISMS) | 10% | Information Security |
| ISO 50001 (EnMS) | 8% | Energy Management |
| ISO 9001 (QMS) | 5% | Quality Management |
| HACCP/GMP | 8% | Food Safety Standards |
| BRC Global Standard | 10% | Food Safety Standard |
| FSSC 22000 | 12% | Food Safety System |

**Example:**
```
Base: 10 days, ISO 14001 + ISO 45001 selected
Integrated_Reduction = 0.12 + 0.12 = 0.24 (24%)
Integrated_Adjustment = -(10 × 0.24) = -2.4 days
Total = 10 - 2.4 = 7.6 days
```

### 7. Complexity Adjustment

**Formula:**
```
Complexity_Categories = ['I', 'J', 'K']
if (category IN Complexity_Categories) {
    Complexity_Adjustment = Total_Man_Days × 0.1
} else {
    Complexity_Adjustment = 0
}
```

**Example:**
```
Total: 10 days, Category J
Complexity_Adjustment = 10 × 0.1 = 1.0 day
Final Total = 11 days
```

---

## Stage Distribution (Initial Audits Only)

### Stage 1 and Stage 2 Split

**Formulas:**
```
Stage_1 = MAX(1, MIN(3, CEIL(Total_Man_Days × 0.3)))
Stage_2 = CEIL(Total_Man_Days × 0.7)
```

**Constraints:**
- Stage 1: Minimum 1 day, Maximum 3 days
- Stage 2: 70% of total man-days
- Total = Stage 1 + Stage 2

**Example:**
```
Total: 10 days
Stage_1 = MAX(1, MIN(3, CEIL(10 × 0.3))) = MAX(1, MIN(3, 3)) = 3 days
Stage_2 = CEIL(10 × 0.7) = 7 days
Total = 3 + 7 = 10 days ✓
```

---

## Surveillance and Recertification

### Surveillance Audits

**Formula:**
```
Surveillance_Man_Days = CEIL(Total_Man_Days × 0.33)
```

**Example:**
```
Total: 10 days
Surveillance = CEIL(10 × 0.33) = CEIL(3.3) = 4 days
```

### Recertification Audits

**Formula:**
```
Recertification_Man_Days = CEIL(Total_Man_Days × 0.67)
```

**Example:**
```
Total: 10 days
Recertification = CEIL(10 × 0.67) = CEIL(6.7) = 7 days
```

---

## Complete Calculation Example

### Scenario
- **Standard:** FSMS
- **Category:** C
- **Employees:** 120
- **Sites:** 2
- **HACCP Studies:** 3
- **Risk Level:** High
- **Integrated Standards:** ISO 14001, ISO 45001

### Step-by-Step Calculation

1. **Base Man-Days:** 10 days
2. **Employee Adjustment:** 120 employees = 2.5 days
3. **HACCP Adjustment:** (3-1) × 0.5 = 1.0 day
4. **Risk Adjustment:** 10 × (1.2 - 1) = 2.0 days
5. **Multi-Site Adjustment:** 12 days (see multi-site formula)
6. **Integrated Adjustment:** -(10 × 0.24) = -2.4 days
7. **Complexity Adjustment:** Category C = 0 days

**Subtotal:** 10 + 2.5 + 1.0 + 2.0 + 12 - 2.4 = 25.1 days
**Final Total:** CEIL(25.1) = 26 days

### Stage Distribution
- **Stage 1:** MAX(1, MIN(3, CEIL(26 × 0.3))) = 8 days
- **Stage 2:** CEIL(26 × 0.7) = 19 days

### Audit Cycle
- **Surveillance:** CEIL(26 × 0.33) = 9 days
- **Recertification:** CEIL(26 × 0.67) = 18 days

---

## Configuration Parameters

All parameters are configurable through the admin interface:

### Employee Ranges
- **Field:** `employeeRanges` (array)
- **Structure:** `{ min: number, max: number, adjustment: number, description: string }`

### Base Man-Days
- **Field:** `baseManDays` (object)
- **Structure:** `{ [standard: string]: { [category: string]: number } }`

### Risk Multipliers
- **Field:** `riskMultipliers` (object)
- **Structure:** `{ low: number, medium: number, high: number }`

### HACCP Multiplier
- **Field:** `haccpMultiplier` (number)
- **Default:** 0.5

### Multi-Site Multiplier
- **Field:** `multiSiteMultiplier` (number)
- **Default:** 0.5

### Integrated Standards
- **Field:** `integratedStandards` (array)
- **Structure:** `{ id: string, name: string, reduction: number }`

---

## Validation Rules

### Input Validation
- **Company Name:** Required, non-empty
- **Scope:** Required, non-empty
- **Standard:** Must exist in configuration
- **Category:** Must exist for selected standard
- **Employees:** ≥ 1
- **Sites:** ≥ 1
- **HACCP Studies:** ≥ 0 (FSMS only)
- **Risk Level:** Must be 'low', 'medium', or 'high'
- **Integrated Standards:** Must be array

### Business Rules
- **HACCP Studies:** Only allowed for FSMS standard
- **Category Availability:** Depends on selected standard
- **Minimum Man-Days:** Always ≥ 1
- **Stage 1 Limits:** 1-3 days maximum

---

## Database Schema

Configuration is stored in the `AdminConfig` table:

```sql
CREATE TABLE admin_configs (
    id UUID PRIMARY KEY,
    name VARCHAR UNIQUE,
    baseManDays JSONB,
    employeeRanges JSONB,
    riskMultipliers JSONB,
    haccpMultiplier FLOAT,
    multiSiteMultiplier FLOAT,
    integratedSystemReduction FLOAT,
    integratedStandards JSONB,
    categories JSONB,
    isActive BOOLEAN,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP
);
```

---

## Notes

- All calculations are rounded up to the nearest whole day
- Stage 1 is capped at 3 days maximum for practicality
- Minimum total man-days is always 1
- Integrated standards have a minimum 5% reduction when multiple standards are selected
- HACCP first study is included in base man-days to avoid double-counting
- Multi-site calculations account for central function coordination overhead
