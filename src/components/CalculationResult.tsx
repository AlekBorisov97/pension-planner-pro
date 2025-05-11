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
    showMonths?: boolean,
    showMonthsValue?: number
  };
}

export default function CalculationResult({ result }: CalculationResultProps) {
  const PensionValue = ({
    amount,
    label,
    color = "text-green-600",
    isSplit = false,
    months,
  }: {
    amount: number | undefined;
    label: string;
    color?: string;
    isSplit?: boolean;
    months?: number;
  }) => {
    if (!amount) return null;
    return (
      <div className="flex flex-col items-center max-w-[160px] text-center">
        <div className="text-2xl sm:text-xl md:text-2xl font-semibold break-words">
          {formatCurrency(amount)}
        </div>
        <div
          className={cn(
            "text-sm font-normal",
            color,
            "leading-tight break-words",
          )}
        >
          {isSplit ? `Разсрочено за ${months} месеца` : label}
        </div>
      </div>
    );
  };

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
            {result.showSingleOption
              ? "Първоначален размер на втора пенсия от УПФ"
              : "Две пенсии повече от една ли са?"}
          </CardTitle>
          <CardDescription className="text-center text-sm">
            {result.showSingleOption ? (
              <>
                За да направите сравнение с държавната пенсия моля въведете
                данни за стаж и прогнозен размер на пенсия от ДОО.
              </>
            ) : (
              "Две пенсии повече от една ли са?"
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {result.showSingleOption ? (
            <div className="flex flex-col">
              <div className="text-center pb-3">
                <span className="text-sm uppercase tracking-wide font-medium text-primary/80">
                  Втора пенсия от УПФ
                </span>
              </div>
              <Card className="flex-1 bg-white border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center h-full">
                  <div className="flex flex-wrap gap-4 justify-center text-center">
                    {!!result.variant3CurrentMonthlyPensionWish && (
                      <PensionValue
                        amount={result.variant3CurrentMonthlyPensionWish}
                        label=""
                        color="text-red-600"
                        isSplit
                        months={result.variant3CurrentMonthlyPensionWishMonths}
                      />
                    )}
                    <PensionValue
                      amount={result.enhancedMonthlyPension}
                      label="Пожизнено"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 pb-6">
              {/* One Pension Card */}
              <div className="flex flex-col">
                <div className="text-center pb-3">
                  <span className="text-sm uppercase tracking-wide font-medium text-primary/80">
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
                        "flex flex-wrap justify-center gap-4 text-2xl font-bold text-center",
                        result.enhancedMonthlyPension <
                          result.standardMonthlyPension &&
                          result.showRecommend &&
                          "text-primary",
                      )}
                    >
                      <PensionValue
                        amount={result.standardMonthlyPension}
                        label="Пожизнено"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Two Pensions Card */}
              <div className="flex flex-col">
                <div className="text-center pb-3">
                  <span className="text-sm uppercase tracking-wide font-medium text-primary/80">
                    Две пенсии - от НОИ и УПФ
                  </span>
                </div>
                <Card className="flex-1 bg-white border border-primary/20 shadow-md hover:shadow-lg transition-shadow relative">
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
                        "flex flex-wrap justify-center gap-4 text-center",
                        result.enhancedMonthlyPension >
                          result.standardMonthlyPension &&
                          result.showRecommend &&
                          "text-primary",
                      )}
                    >
                      {!!result.variant3CurrentMonthlyPensionWish && (
                        <PensionValue
                          amount={result.variant3CurrentMonthlyPensionWish}
                          label=""
                          color="text-red-600"
                          isSplit
                          months={
                            result.variant3CurrentMonthlyPensionWishMonths
                          }
                        />
                      )}
                      <PensionValue
                        amount={result.enhancedMonthlyPension}
                        label={result.showMonths ? `Разсрочено за ${result.showMonthsValue} месеца` : "Пожизнено"}
                      />
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
