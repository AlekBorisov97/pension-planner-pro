
// Utility functions for retirement calculator

interface RetirementInputs {
  dateOfBirth: Date;
  sex: 'male' | 'female';
  workExperienceYears: number;
  workExperienceMonths: number;
  retirementDate: Date;
  additionalPensionFunds: number;
  pensionFunder: string;
  nationalPensionFunds: number;
}

interface RetirementResults {
  standardMonthlyPension: number;
  enhancedMonthlyPension: number;
  difference: number;
  percentageIncrease: number;
}

// Calculate retirement values based on user inputs
export const calculateRetirement = (inputs: RetirementInputs): RetirementResults => {
  // This is a simplified calculation model
  // In a real-world scenario, this would involve more complex calculations
  
  // Calculate standard monthly pension (without additional funds)
  // Basic algorithm: national pension + (work experience coefficient * base amount)
  const workExperienceTotalMonths = inputs.workExperienceYears * 12 + inputs.workExperienceMonths;
  const workExperienceCoefficient = workExperienceTotalMonths / 240; // 20 years as baseline
  
  // Base calculation for standard pension
  const standardMonthlyPension = inputs.nationalPensionFunds * workExperienceCoefficient;
  
  // Calculate enhanced monthly pension (with additional funds)
  // Include additional pension funds converted to monthly value
  // A simple calculation assuming the additional funds provide 5% annual returns distributed monthly
  const additionalMonthlyAmount = (inputs.additionalPensionFunds * 0.05) / 12;
  const enhancedMonthlyPension = standardMonthlyPension + additionalMonthlyAmount;
  
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

// Format currency values
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'BGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Format percentage values
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

// List of pension funders
export const pensionFunders = [
  "Родина (Rodina)",
  "ДСК (DSK)",
  "Уникредит (Unicredit)"
];
