
export interface RetirementInputs {
  dateOfBirth: Date;
  gender: "male" | "female";
  workExperienceYears: number;
  workExperienceMonths: number;
  retirementDate: Date;
  additionalPensionFunds: number;
  pensionFunder: string;
  nationalPensionFunds: number;
}

export const pensionFunders = [
  "ДСК Родина",
  "Алианц България",
  "NN Пенсионно осигуряване",
  "Доверие",
  "Съгласие",
  "ЦКБ-Сила",
  "Бъдеще"
];

export const calculateRetirement = (inputs: RetirementInputs) => {
  // Calculate standard monthly pension (without additional funds)
  const standardMonthlyPension = inputs.nationalPensionFunds / 240; // Simplified calculation

  // Calculate enhanced monthly pension (with additional funds)
  const enhancedMonthlyPension = standardMonthlyPension + (inputs.additionalPensionFunds / 240); // Simplified calculation

  // Calculate difference and percentage increase
  const difference = enhancedMonthlyPension - standardMonthlyPension;
  const percentageIncrease = (difference / standardMonthlyPension) * 100;

  return {
    standardMonthlyPension,
    enhancedMonthlyPension,
    difference,
    percentageIncrease
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'BGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('bg-BG', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};
