import { mortalityRate } from "@/constants/mortalityRate";
import {
  retirementAgesByYear,
  workExperienceRequirementsByYear,
} from "@/constants/retirementAge";
import { addMonths, addYears } from "date-fns";

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

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "BGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function formatYearsAndMonths(value: number): string {
  const years = Math.floor(value);
  const monthsDecimal = value - years;

  const months = Math.round(monthsDecimal * 12);

  return `${years} години и ${months} месеци`;
}

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

export const calculateRetirementDateFromBirth = (
  birthDate: Date,
  gender: "male" | "female",
): Date => {
  const birthYear = birthDate.getFullYear();

  for (let year = birthYear + 55; year <= 2100; year++) {
    const minAge = getMinimumRetirementAge(year, gender);
    const ageAtYear = year - birthYear;

    if (ageAtYear >= minAge) {
      const retirementDate = new Date(birthDate);
      retirementDate.setFullYear(birthDate.getFullYear() + Math.floor(minAge));
      const monthsFraction = minAge % 1;
      if (monthsFraction > 0) {
        retirementDate.setMonth(
          retirementDate.getMonth() + Math.round(monthsFraction * 12),
        );
      }

      return retirementDate;
    }
  }

  // Fallback (should not happen if retirementAgesByYear is defined correctly)
  return new Date(
    birthDate.getFullYear() + 65,
    birthDate.getMonth(),
    birthDate.getDate(),
  );
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
  if (rate === 0) return -(pmt * nper + fv);

  const pvFactor = (1 - Math.pow(1 + rate, -nper)) / rate;
  const adjustedPmt = pmt * (1 + rate * type);

  return -(adjustedPmt * pvFactor + fv * Math.pow(1 + rate, -nper));
};

const sumDiscountedLifeExpectancy = (
  fromAge: number,
  toAge: number,
  interest: number,
): number => {
  let sum = 0;

  for (let age = fromAge; age <= toAge; age++) {
    const lifeExpectancy = calculateLifeExpectancy(age);
    const discountFactor = Math.pow(1 + interest / 100, age);
    sum += lifeExpectancy / discountFactor;
  }

  return sum;
};

export const calculateLifeExpectancy = (age: number): number => {
  if (!age) return 1;
  if (age === 0) return 1;

  const previous = calculateLifeExpectancy(age - 1);
  const mortality =
    mortalityRate.find((rate) => rate.age === age - 1)?.px.total ?? 1;

  return previous * mortality;
};

export const calculateDiscountFactorSum = (
  years: number,
  interest: number,
): number => {
  const monthlyRate = 1 / (1 + interest / 100);
  const compounded = Math.pow(monthlyRate, years);
  const monthlyCompounded = Math.pow(monthlyRate, 1 / 12);

  return (1 - compounded) / (1 - monthlyCompounded);
};

// Calculates Monthly Scheduled Sum (Cell H6)
export const calculateMonthlyScheduledSumH6 = (
  fullAmount: number,
  age: number,
  interest: number,
  guaranteeMonths: number,
  monthlyPayout: number,
): number => {
  const monthlyRate = interest / 100 / 12;
  const pvGuaranteed = pv(monthlyRate, guaranteeMonths, -monthlyPayout);

  const startAge = Math.round(age + guaranteeMonths / 12);
  const columnDSum = sumDiscountedLifeExpectancy(startAge, 100, interest);

  const currentB = calculateLifeExpectancy(age);
  const currentC = currentB / Math.pow(1 + interest / 100, age);

  const BwithGuarantee = calculateLifeExpectancy(startAge);
  const CwithGuarantee =
    BwithGuarantee / Math.pow(1 + interest / 100, startAge);

  const denominator =
    12 * (columnDSum / currentC - ((11 / 24) * CwithGuarantee) / currentC);

  return (fullAmount - pvGuaranteed) / denominator;
};

// Calculates Monthly Sum (Cell G6) when guaranteed period is in full years
export const calculateMonthlyGuaranteedSumG6 = (
  fullAmount: number,
  age: number,
  interest: number,
  guaranteeYears: number,
): number => {
  const startAge = age + guaranteeYears;

  const columnDSum = sumDiscountedLifeExpectancy(startAge, 100, interest);
  const currentB = calculateLifeExpectancy(age);
  const currentC = currentB / Math.pow(1 + interest / 100, age);

  const guaranteedB = calculateLifeExpectancy(startAge);
  const guaranteedC = guaranteedB / Math.pow(1 + interest / 100, startAge);

  const H = calculateDiscountFactorSum(guaranteeYears, interest);

  const denominator =
    12 * (columnDSum / currentC - ((11 / 24) * guaranteedC) / currentC) + H;

  return fullAmount / denominator;
};

// Calculates Monthly Sum (Cell F6) with no guaranteed period
export const calculateMonthlySumF6 = (
  fullAmount: number,
  age: number,
  interest: number,
): number => {
  const columnDSum = sumDiscountedLifeExpectancy(age, 100, interest);
  const currentB = calculateLifeExpectancy(age);
  const currentC = currentB / Math.pow(1 + interest / 100, age);
  const denominator = 12 * (columnDSum / currentC - 11 / 24);

  return fullAmount / denominator;
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
