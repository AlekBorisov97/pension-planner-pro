import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/calculatorUtils";
import { cn } from "@/lib/utils";

interface CalculationResultProps {
  result: {
    standardMonthlyPension?: number;
    enhancedMonthlyPension?: number;
  };
}

export default function CalculationResult({ result }: CalculationResultProps) {
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
            Резултат
          </CardTitle>
          <CardDescription className="text-center">
            Описание на резултатър
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid md:grid-cols-2 gap-6 pb-6">
            {/* Standard Pension */}
            <div className="flex flex-col">
              <div className="text-center pb-3">
                <span className="text-sm uppercase tracking-wider font-medium text-primary/80">
                  Една пенсия - само от НОИ
                </span>
              </div>
              <Card className="flex-1 bg-white border shadow-sm hover:shadow-md transition-shadow relative">
                {result.enhancedMonthlyPension <
                  result.standardMonthlyPension && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium rounded-bl-md">
                    ПРЕПОРЪЧИТЕЛНО
                  </div>
                )}
                <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center h-full">
                  <div
                    className={cn(
                      "text-3xl font-bold mb-2",
                      result.enhancedMonthlyPension <=
                        result.standardMonthlyPension && "text-primary",
                    )}
                  >
                    {formatCurrency(result.standardMonthlyPension)}
                  </div>
                  <p className="text-muted-foreground text-sm">Инфо</p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Pension */}
            <div className="flex flex-col">
              <div className="text-center pb-3">
                <span className="text-sm uppercase tracking-wider font-medium text-primary/80">
                  Две пенсии - от НОИ и УПФ
                </span>
              </div>
              <Card className="flex-1 bg-white border border-primary/20 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
                {result.enhancedMonthlyPension >
                  result.standardMonthlyPension && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium rounded-bl-md">
                    ПРЕПОРЪЧИТЕЛНО
                  </div>
                )}
                <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center h-full">
                  <div
                    className={cn(
                      "text-3xl font-bold mb-2",
                      result.enhancedMonthlyPension >
                        result.standardMonthlyPension && "text-primary",
                    )}
                  >
                    {formatCurrency(result.enhancedMonthlyPension)}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Още Информация
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
