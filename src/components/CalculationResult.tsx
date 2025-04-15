import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUp, TrendingUp } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/utils/calculatorUtils";

interface CalculationResultProps {
  result?: any;
  standardMonthlyPension?: number;
  enhancedMonthlyPension?: number;
  difference?: number;
  percentageIncrease?: number;
}

export default function CalculationResult({
  result,
  standardMonthlyPension,
  enhancedMonthlyPension,
  difference,
  percentageIncrease,
}: CalculationResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="result-appear"
    >
      <Card className="shadow-md border-0 green-card overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-medium text-center text-primary">
            Your Retirement Projection
          </CardTitle>
          <CardDescription className="text-center">
            Compare your retirement options below
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid md:grid-cols-2 gap-6 pb-6">
            {/* Standard Pension */}
            <div className="flex flex-col">
              <div className="text-center pb-3">
                <span className="text-sm uppercase tracking-wider font-medium text-primary/80">
                  Standard Pension
                </span>
              </div>
              <Card className="flex-1 bg-white border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center h-full">
                  <div className="text-3xl font-bold mb-2">
                    {formatCurrency(standardMonthlyPension)}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Monthly pension without additional funds
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Pension */}
            <div className="flex flex-col">
              <div className="text-center pb-3">
                <span className="text-sm uppercase tracking-wider font-medium text-primary/80">
                  Enhanced Pension
                </span>
              </div>
              <Card className="flex-1 bg-white border border-primary/20 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium rounded-bl-md">
                  Recommended
                </div>
                <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center h-full">
                  <div className="text-3xl font-bold mb-2 text-primary">
                    {formatCurrency(enhancedMonthlyPension)}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Monthly pension with additional funds
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 mt-2 border border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Difference</span>
              <span className="font-semibold text-primary flex items-center">
                {formatCurrency(difference)}
                <ArrowUp className="h-4 w-4 ml-1" />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Percentage Increase</span>
              <span className="font-semibold text-primary flex items-center">
                {formatPercentage(percentageIncrease)}
                <TrendingUp className="h-4 w-4 ml-1" />
              </span>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              The enhanced pension is {formatPercentage(percentageIncrease)}{" "}
              higher than the standard option, providing you with an additional{" "}
              {formatCurrency(difference)} monthly.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
