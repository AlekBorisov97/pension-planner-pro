import { retirementAgesByYear } from "@/constants/retirementAge";

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

export const pensionFunders = [
  "ДСК Родина",
  "Алианц България",
  "NN Пенсионно осигуряване",
  "Доверие",
  "Съгласие",
  "ЦКБ-Сила",
  "Бъдеще",
];

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

export const getMinimumRetirementAge = (year, gender) => {
  const entry = retirementAgesByYear.find((e) => e.year === year);

  if (entry) {
    return gender === "male" ? entry.male : entry.female;
  }

  // After 2037, it remains 65 for both
  return 65;
};
