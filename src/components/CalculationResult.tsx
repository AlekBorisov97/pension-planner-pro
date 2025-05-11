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
    variant3CurrentMonthlyPensionWish?: number;
    variant3CurrentMonthlyPensionWishMonths?: number;
    showRecommend?: boolean;
    showSingleOption?: boolean;
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
            {result.showSingleOption ? (
              <>Първоначален размер на втора пенсия от УПФ</>
            ) : (
              <>Две пенсии повече от една ли са?</>
            )}
          </CardTitle>
          <CardDescription className="text-center">
            {result.showSingleOption ? (
              <>
                За да направите сравнение с държавната пенсия моля въведете
                данни за стаж и прогнозен размер на пенсия от ДОО.
              </>
            ) : (
              <>Две пенсии повече от една ли са?</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {result.showSingleOption ? (
            <div className="flex flex-col">
              <div className="text-center pb-3">
                <span className="text-sm uppercase tracking-wider font-medium text-primary/80">
                  Втора пенсия от УПФ
                </span>
              </div>
              <Card className="flex-1 bg-white border shadow-sm hover:shadow-md transition-shadow relative">
                <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center h-full">
                  <div
                    className={cn(
                      "text-3xl font-bold mb-2 flex",
                      "text-primary",
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <div>
                        {!!result.variant3CurrentMonthlyPensionWish &&
                          formatCurrency(
                            result.variant3CurrentMonthlyPensionWish,
                          ) + " / "}
                      </div>
                      <div
                        className="text-sm font-normal text-red-600
"
                      >
                        Разсрочено за{" "}
                        {result.variant3CurrentMonthlyPensionWishMonths} месеца
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div>{formatCurrency(result.enhancedMonthlyPension)}</div>
                      <div className="text-sm font-normal text-green-600">
                        Пожизнено
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
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
                    result.standardMonthlyPension &&
                    result.showRecommend && (
                      <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium rounded-bl-md">
                        По-благоприятно
                      </div>
                    )}
                  <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center h-full">
                    <div
                      className={cn(
                        "text-3xl font-bold mb-2",
                        result.enhancedMonthlyPension <
                          result.standardMonthlyPension &&
                          result.showRecommend &&
                          "text-primary",
                      )}
                    >
                      {formatCurrency(result.standardMonthlyPension)}
                    </div>
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
                    result.standardMonthlyPension &&
                    result.showRecommend && (
                      <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium rounded-bl-md">
                        По-благоприятно
                      </div>
                    )}
                  <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center h-full">
                    <div
                      className={cn(
                        "text-3xl font-bold mb-2",
                        result.enhancedMonthlyPension >
                          result.standardMonthlyPension &&
                          result.showRecommend &&
                          "text-primary",
                      )}
                    >
                      {!!result.variant3CurrentMonthlyPensionWish &&
                        formatCurrency(
                          result.variant3CurrentMonthlyPensionWish,
                        ) + " / "}
                      {formatCurrency(result.enhancedMonthlyPension)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
