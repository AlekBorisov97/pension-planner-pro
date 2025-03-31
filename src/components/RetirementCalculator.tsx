
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateRetirement } from '@/utils/calculatorUtils';
import RetirementForm from './retirement/RetirementForm';
import CalculationResult from './CalculationResult';

export default function RetirementCalculator() {
  const [calculationResult, setCalculationResult] = useState<ReturnType<typeof calculateRetirement> | null>(null);

  return (
    <div className="space-y-8 pb-16">
      <RetirementForm onCalculate={setCalculationResult} />

      <div id="calculation-result">
        <AnimatePresence>
          {calculationResult && (
            <CalculationResult
              standardMonthlyPension={calculationResult.standardMonthlyPension}
              enhancedMonthlyPension={calculationResult.enhancedMonthlyPension}
              difference={calculationResult.difference}
              percentageIncrease={calculationResult.percentageIncrease}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
