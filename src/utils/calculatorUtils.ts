import { mortalityRate } from "@/constants/mortalityRate";
import {
  retirementAgesByYear,
  workExperienceRequirementsByYear,
} from "@/constants/retirementAge";

export interface MortalityRow {
  age: number;
  lx: number;
  Dx: number;
  Nx: number;
  v: number;
  vn: number; // v^n
  v12: number; // v^(1/12)
  oneMinusRatio: number; // (1-v^n)/(1-v^(1/12))
}

export interface NationalMortalityData {
  age: number;
  qx: {
    total: number;
    male: number;
    female: number;
  };
  px: {
    total: number;
    male: number;
    female: number;
  };
  ex: {
    total: number;
    male: number;
    female: number;
  };
}

export interface RetirementInputs {
  dateOfBirth: Date;
  gender: "male" | "female";
  workExperienceYears: number;
  workExperienceMonths: number;
  retirementDate: Date;
  additionalPensionFunds: number;
  pensionFunder: string;
  nationalPensionFunds: number;
  paymentOption?: string;
}

export const pensionFunders: Record<string, number> = {
  Доверие: 0.35,
  "ДСК-Родина": 0.2,
  Алианц: 0.05,
  ОББ: 0.5,
  Съгласие: 0.75,
  "ЦКБ-Сила": 0.37,
  Бъдеще: 0.3,
  Топлина: 0.5,
  ПОИ: 0.5,
  ДаллБогг: 0.5,
};

export const paymentOptions = ["Payment 1", "Payment 2"];

export const calculateRetirement = (inputs: RetirementInputs) => {
  // For small funds (≤10000), we'll calculate based only on the payment option
  if (inputs.additionalPensionFunds <= 10000) {
    let result = 0;

    if (inputs.paymentOption === "Payment 1") {
      result = inputs.additionalPensionFunds / 2;
    } else if (inputs.paymentOption === "Payment 2") {
      result = inputs.additionalPensionFunds / 3;
    } else {
      // Default calculation if no option selected
      result = inputs.additionalPensionFunds;
    }

    return {
      standardMonthlyPension: 0, // Not using national pension for small funds
      enhancedMonthlyPension: result / 240,
      difference: result / 240,
      percentageIncrease: 100, // 100% increase as we're not using standard pension
    };
  }

  // Calculate standard monthly pension (for larger funds)
  const standardMonthlyPension = inputs.nationalPensionFunds / 240; // Simplified calculation

  // Apply payment option modifiers for large funds
  let enhancedMonthlyPension = standardMonthlyPension;

  // For larger funds (>10000), use standard calculation
  enhancedMonthlyPension += inputs.additionalPensionFunds / 240;

  // Calculate difference and percentage increase
  const difference = enhancedMonthlyPension - standardMonthlyPension;
  const percentageIncrease = (difference / standardMonthlyPension) * 100;

  return {
    standardMonthlyPension,
    enhancedMonthlyPension,
    difference,
    percentageIncrease,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "BGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("bg-BG", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export const getMinimumRetirementAge = (
  year: number,
  gender: "male" | "female",
) => {
  const entry = retirementAgesByYear.find((e) => e.year === year);

  if (entry) {
    return gender === "male" ? entry.male : entry.female;
  }

  // After 2037, it remains 65 for both
  return 65;
};

export const getMinimumWorkExperience = (
  year: number,
  gender: "male" | "female",
) => {
  const entry = workExperienceRequirementsByYear.find((e) => e.year === year);
  if (entry) {
    return gender === "male" ? entry.male : entry.female;
  }

  // From 2027 onwards, fixed values
  return gender === "male" ? 40 : 37;
};

export const minimumOSVPension = (date: Date) => {
  if (date >= new Date("2025-07-01")) return 636.0;
  if (date >= new Date("2024-07-01")) return 580.57;
  if (date >= new Date("2023-07-01")) return 523.04;
  if (date >= new Date("2022-07-01")) return 467.0;
  if (date >= new Date("2021-12-25")) return 370.0;
  if (date >= new Date("2021-01-01")) return 300.0;
  if (date >= new Date("2020-07-01")) return 250.0;
  if (date >= new Date("2019-07-01")) return 219.43;
  if (date >= new Date("2018-07-01")) return 207.6;
  if (date >= new Date("2017-10-01")) return 200.0;
  if (date >= new Date("2017-07-01")) return 180.0;
  if (date >= new Date("2016-01-01")) return 157.44;

  return 0.0;
};

export const calculateLXColumnB = (age: number) => {
  if (age === 0) return 1;

  const result =
    calculateLXColumnB(age - 1) *
    mortalityRate.filter((rate) => rate.age === age - 1)[0].px.total;

  return result;
};

const pv = (
  rate: number,
  nper: number,
  pmt: number,
  fv: number = 0,
  type: 0 | 1 = 0,
): number => {
  if (rate === 0) {
    return -(pmt * nper + fv);
  } else {
    const pvFactor = (1 - Math.pow(1 + rate, -nper)) / rate;
    const adjPmt = pmt * (1 + rate * type);
    const pvValue = -(adjPmt * pvFactor + fv * Math.pow(1 + rate, -nper));
    return pvValue;
  }
};

export const calculateColumnH = (years: number, interest: number) => {
  const columnE = 1 / (1 + interest / 100);
  const columnF = Math.pow(columnE, years);
  const columnG = Math.pow(columnE, 1 / 12);
  return (1 - columnF) / (1 - columnG);
};

export const calculateMonthlySchedueledSumH6 = (
  fullAmount: number,
  age: number,
  interest: number,
  guaranteedPeriodInMonths: number,
  sum: number,
): number => {
  const pvWTF = pv((interest / 100) / 12,guaranteedPeriodInMonths, sum * (-1) )

  let sumForColumnD = 0; // the sum of all columns C after the age in table Kalulator PP
  for (let i = Math.round(age + guaranteedPeriodInMonths/12); i <= 100; i++) {
    const columnBCell = calculateLXColumnB(i);
    const columnCCell = columnBCell / Math.pow(1 + interest / 100, i);

    sumForColumnD += columnCCell;
  }

  const currentColumnBCell = calculateLXColumnB(
    age,
  );
  const currentColumnCCell =
  currentColumnBCell /
    Math.pow(1 + interest / 100, age);


    const currentColumnBCellWithMonthsGuaranteed = calculateLXColumnB(
      Math.round(age + guaranteedPeriodInMonths/12),
    );
    const currentColumnCCellWithMonthsGuaranteed =
    currentColumnBCellWithMonthsGuaranteed /
      Math.pow(1 + interest / 100, Math.round(age + guaranteedPeriodInMonths/12));

  return (fullAmount - pvWTF) / (12 * (sumForColumnD / currentColumnCCell - ((11 / 24) * currentColumnCCellWithMonthsGuaranteed) / currentColumnCCell));
};

export const calculateMonthlyGaranteedMonthsSumG6 = (
  fullAmount: number,
  age: number,
  interest: number,
  guaranteedPeriodInYears: number,
): number => {
  let sumForColumnD = 0; // the sum of all columns C after the age in table Kalulator PP
  for (let i = age + guaranteedPeriodInYears; i <= 100; i++) {
    const columnBCell = calculateLXColumnB(i);
    const columnCCell = columnBCell / Math.pow(1 + interest / 100, i);

    sumForColumnD += columnCCell;
  }

  const currentColumnBCell = calculateLXColumnB(age);
  const currentColumnCCell =
    currentColumnBCell / Math.pow(1 + interest / 100, age);

  const currentColumnBCellGuaranteed = calculateLXColumnB(
    age + guaranteedPeriodInYears,
  );
  const currentColumnCCellGuaranteed =
    currentColumnBCellGuaranteed /
    Math.pow(1 + interest / 100, age + guaranteedPeriodInYears);

  const currentColumnHCell = calculateColumnH(
    guaranteedPeriodInYears,
    interest,
  );

  return (
    fullAmount /
    (12 *
      (sumForColumnD / currentColumnCCell -
        ((11 / 24) * currentColumnCCellGuaranteed) / currentColumnCCell) +
      currentColumnHCell)
  );
};

export const calculateMonthlySumF6 = (
  fullAmount: number,
  age: number,
  interest: number,
): number => {
  let sumForColumnD = 0; // the sum of all columns C after the age in table Kalulator PP
  for (let i = age; i <= 100; i++) {
    const columnBCell = calculateLXColumnB(i);
    const columnCCell = columnBCell / Math.pow(1 + interest / 100, i);

    sumForColumnD += columnCCell;
  }

  const currentColumnBCell = calculateLXColumnB(age);
  const currentColumnCCell =
    currentColumnBCell / Math.pow(1 + interest / 100, age);

  return fullAmount / (12 * (sumForColumnD / currentColumnCCell - 11 / 24));
};

/**
 * TABLE PARSER
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * const XLSX = require('xlsx');
const fs = require('fs');

function extractMortalityData(filePath) {
  // Read the workbook
  const workbook = XLSX.readFile(filePath);
  
  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Find the start of the data (skip headers)
  let startRow = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === 0 || data[i][0] === '0') {
      startRow = i;
      break;
    }
  }
  
  const result = [];
  
  for (let i = startRow; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 10 || row[0] === undefined) continue;
    
    const age = Number(row[0]);
    if (isNaN(age)) continue;
    
    const mortalityData = {
      age: age,
      qx: {
        total: Number(row[1]),
        male: Number(row[2]),
        female: Number(row[3])
      },
      px: {
        total: Number(row[4]),
        male: Number(row[5]),
        female: Number(row[6])
      },
      ex: {
        total: Number(row[7]),
        male: Number(row[8]),
        female: Number(row[9])
      }
    };
    
    result.push(mortalityData);
  }
  
  return result;
}

// Usage
const filePath = 'ALEK EXPORT.xls';
const mortalityData = extractMortalityData(filePath);

// Save to JSON file
const outputPath = 'mortality_data.json';
fs.writeFileSync(outputPath, JSON.stringify(mortalityData, null, 2));

console.log(`Data extracted and saved to ${outputPath}`);

 END
//  */
