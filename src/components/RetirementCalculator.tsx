import { useState, useEffect, useMemo } from "react";
import { format, addYears } from "date-fns";
import { bg } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import {
  CalendarIcon,
  HelpCircle,
  CheckCircle,
  XCircle,
  InfoIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  pensionFunders,
  getMinimumRetirementAge,
  getMinimumWorkExperience,
  calculateMonthlySumF6,
  minimumOSVPension,
  formatCurrency,
  calculateMonthlyGuaranteedSumG6,
  calculateMonthlyScheduledSumH6,
  formatYearsAndMonths,
  calculateRetirementDateFromBirth,
} from "@/utils/calculatorUtils";
import CalculationResult from "./CalculationResult";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const STORAGE_KEY = "retirement-calculator-form-data";
const DEFAULT_BIRTH_DATE = new Date("1960-01-01");
const MIN_BIRTH_DATE = new Date("1960-01-01"); // No dates before 1960-01-01
const TODAY = new Date();
const MAX_RETIREMENT_DATE = addYears(TODAY, 40); // Up to 40 years in future
const MIN_RETIREMENT_DATE = new Date();

const formSchema = (
  minInstallmentAmount: number,
  maxInstallmentAmount: number,
) =>
  z.object({
    dateOfBirth: z.date({
      required_error: "Моля, изберете дата на раждане.",
    }),
    gender: z.enum(["male", "female"], {
      required_error: "Моля, изберете пол.",
    }),
    workExperienceYears: z
      .number()
      .int()
      .min(0, "Годините трябва да са 0 или повече")
      .max(80, "Годините трябва да са 80 или по-малко"),
    workExperienceMonths: z
      .number({
        invalid_type_error: "Моля, въведете месеци",
      })
      .int()
      .optional(),
    retirementDate: z.date({
      required_error: "Моля, изберете дата на пенсиониране.",
    }),
    additionalPensionFunds: z
      .number()
      .min(0, "Сумата трябва да е 0 или повече"),
    pensionFunder: z.string({
      required_error: "Моля, изберете пенсионен фонд.",
    }),
    selectedOption: z.enum(["option1", "option2", "option3"]).optional(),
    periodYears: z
      .number({
        invalid_type_error: "Моля, въведете години",
      })
      .int()
      .min(2, "Периодът трябва да e между 2 и 10 години")
      .max(10, "Периодът трябва да e между 2 и 10 години")
      .optional(),
    installmentPeriod: z
      .number({
        invalid_type_error: "Моля, въведете период в месеци",
      })
      .int()
      .min(1, "Периодът на разсрочване е от 1 до 240 месеца.")
      .max(240, "Периодът на разсрочване е от 1 до 240 месеца.")
      .optional(),
    installmentAmount: z
      .number()
      .min(
        minInstallmentAmount,
        `Сумата не може да бъде по-малка от ${formatCurrency(minInstallmentAmount)}`,
      )
      .max(
        maxInstallmentAmount,
        `Сумата не може да бъде по-голяма от ${formatCurrency(maxInstallmentAmount)}`,
      )
      .optional(),
    nationalPensionFunds: z
      .number()
      .min(0, "Сумата трябва да е 0 или повече")
      .optional(),
    nationalPensionFundsCutOut: z
      .number()
      .min(0, "Сумата трябва да е 0 или повече")
      .optional(),
    monthlyPaymentForSmallFunds: z
      .number()
      .int()
      .min(1, "Периодът трябва да е поне 1 месец")
      .optional(),
  });

type FormValues = z.infer<ReturnType<typeof formSchema>>;

export default function RetirementCalculator() {
  const { toast } = useToast();
  const [calculationResult, setCalculationResult] = useState<{
    standardMonthlyPension: number;
    enhancedMonthlyPension: number;
    variant3CurrentMonthlyPensionWish: number | undefined;
    variant3CurrentMonthlyPensionWishMonths: number;
    showRecommend: boolean;
    showSingleOption: boolean;
    isOption3Selected: boolean;
  } | null>(null);
  const [partialCalculationResult, setPartialCalculationResult] = useState<
    number | null
  >(null);
  const [
    showMonthlyPaymentForSmallFundsError,
    setShowMonthlyPaymentForSmallFundsError,
  ] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [minWorkExperience, setMinWorkExperience] = useState<number | null>(
    null,
  );
  const [currentWorkExperience, setCurrentWorkExperience] = useState<
    number | null
  >(null);

  const [isRetirementEligible, setIsRetirementEligible] = useState<
    boolean | null
  >(null);
  const [transferToNOIDate, setTransferToNOIDate] = useState<string | null>(
    null,
  );
  const [isTransferToNOIPossible, setIsTransferToNOIPossible] = useState<
    "available" | "unavailable" | null
  >(null);
  const [isExperienceEnough, setIsExperienceEnough] = useState<boolean | null>(
    null,
  );
  const [nn, setNN] = useState<number>(0);
  const [isRetirementAge, setIsRetirementAge] = useState<boolean | null>(null);
  const [calculatedRetirementDate, setCalculatedRetirementDate] = useState<
    string | null
  >(null);
  const [showOptionDropdown, setShowOptionDropdown] = useState(false);
  const [showNationalPensionStep, setShowNationalPensionStep] = useState(false);
  const [showSmallFundOptions, setShowSmallFundOptions] = useState(false);
  const [showOneTimePaymentOption, setShowOneTimePaymentOption] =
    useState(false);
  const [previousFundsThreshold, setPreviousFundsThreshold] = useState<
    "small" | "large" | null
  >(null);
  const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false);

  const loadSavedFormData = (): Partial<FormValues> => {
    if (typeof window === "undefined") return {};

    const savedData = sessionStorage.getItem(STORAGE_KEY);
    if (!savedData) return {};

    try {
      const parsedData = JSON.parse(savedData);

      if (parsedData.dateOfBirth)
        parsedData.dateOfBirth = new Date(parsedData.dateOfBirth);
      if (parsedData.retirementDate)
        parsedData.retirementDate = new Date(parsedData.retirementDate);

      return parsedData;
    } catch (e) {
      console.error("Failed to parse saved form data:", e);
      return {};
    }
  };

  const [minInstallmentAmount, setMinInstallmentAmount] = useState(0);
  const [maxInstallmentAmount, setMaxInstallmentAmount] = useState(1);

  const savedData = loadSavedFormData();

  const schema = useMemo(
    () => formSchema(minInstallmentAmount, maxInstallmentAmount),
    [minInstallmentAmount, maxInstallmentAmount],
  );

  useMemo(() => {
    setCalculationResult(null);
  }, [isRetirementEligible]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      dateOfBirth: savedData.dateOfBirth || DEFAULT_BIRTH_DATE,
      gender: savedData.gender || undefined,
      workExperienceYears: savedData.workExperienceYears || 0,
      workExperienceMonths: savedData.workExperienceMonths || 0,
      retirementDate: savedData.retirementDate || TODAY,
      additionalPensionFunds: savedData.additionalPensionFunds || 0,
      nationalPensionFunds: savedData.nationalPensionFunds || 0,
      nationalPensionFundsCutOut: savedData.nationalPensionFundsCutOut || 0,
      pensionFunder: savedData.pensionFunder || undefined,
      selectedOption: savedData.selectedOption || undefined,
      periodYears: savedData.periodYears || undefined,
      installmentPeriod: savedData.installmentPeriod || undefined,
      installmentAmount: savedData.installmentAmount || undefined,
      monthlyPaymentForSmallFunds:
        savedData.monthlyPaymentForSmallFunds || undefined,
    },
  });

  const resetBigFundsInputs = () => {
    setPartialCalculationResult(null);
    setShowMonthlyPaymentForSmallFundsError(false);
    form.setValue("periodYears", undefined);
    form.setValue("installmentPeriod", undefined);
    form.setValue("installmentAmount", undefined);
  };

  // Reset form state when threshold is crossed
  const resetFormStateForThreshold = (isSmallFund: boolean) => {
    // Reset calculation results
    setCalculationResult(null);

    // Reset form fields that are specific to the path
    if (isSmallFund) {
      form.setValue("selectedOption", undefined);
      form.setValue("periodYears", undefined);
      form.setValue("installmentPeriod", undefined);
      form.setValue("installmentAmount", undefined);
      form.setValue("nationalPensionFunds", undefined);
      form.setValue("nationalPensionFundsCutOut", undefined);

      // Reset UI states for large funds
      setShowOptionDropdown(false);
      setShowNationalPensionStep(false);
      setShowSmallFundOptions(true);
      setStep(2);
    } else {
      form.setValue("monthlyPaymentForSmallFunds", undefined);

      // Reset UI states for small funds
      setShowSmallFundOptions(false);
      setShowOptionDropdown(true);
      setStep(3);
    }
  };

  const checkBasicInfoComplete = () => {
    const dateOfBirth = form.watch("dateOfBirth");
    const gender = form.watch("gender");
    const workExperienceYears = form.watch("workExperienceYears");
    const workExperienceMonths = form.watch("workExperienceMonths");
    const retirementDate = form.watch("retirementDate");

    const isComplete = Boolean(
      dateOfBirth &&
        gender &&
        workExperienceYears !== undefined &&
        retirementDate,
    );

    if (isComplete) {
      const birthDate = new Date(dateOfBirth);
      const retirement = new Date(retirementDate);

      const diffMs = retirement.getTime() - birthDate.getTime();

      // add one day
      const ageAtRetirement =
        (diffMs + 86400000) / (1000 * 60 * 60 * 24 * 365.25);

      setCalculatedAge(ageAtRetirement);

      const { years, months } = getMinimumRetirementAge(
        retirement.getFullYear(),
        gender,
      );

      const minRetirementAge = years + months / 12;

      const minWorkExperience = getMinimumWorkExperience(
        retirement.getFullYear(),
        gender,
      );

      const totalWorkExperience =
        workExperienceYears + workExperienceMonths / 12;

      const autoRetirementDate = calculateRetirementDateFromBirth(
        birthDate,
        gender,
      );

      const transferDate = (() => {
        const year = autoRetirementDate.getFullYear();
        const month = autoRetirementDate.getMonth();
        const day = autoRetirementDate.getDate();

        if (year >= 2038) {
          return new Date(year - 5, month, day);
        } else if (year >= 2036) {
          return new Date(year - 4, month, day);
        } else if (year >= 2031) {
          return new Date(year - 3, month, day);
        } else if (year >= 2026) {
          return new Date(year - 2, month, day);
        } else {
          return new Date(year - 1, month, day);
        }
      })();

      const isTransferBeforeRetirement = transferDate.getTime() <= Date.now();
      setIsTransferToNOIPossible(
        isTransferBeforeRetirement ? "unavailable" : "available",
      );
      setTransferToNOIDate(
        format(transferDate, "dd.MM.yyyy", {
          locale: bg,
        }),
      );

      setCalculatedRetirementDate(
        format(autoRetirementDate, "dd.MM.yyyy", { locale: bg }),
      );
      setIsExperienceEnough(totalWorkExperience >= minWorkExperience);
      setIsRetirementAge(ageAtRetirement >= minRetirementAge);
      setIsRetirementEligible(
        ageAtRetirement >= minRetirementAge && totalWorkExperience > 0,
      );
      setMinWorkExperience(minWorkExperience);
      setCurrentWorkExperience(totalWorkExperience);

      if (step === 1 && ageAtRetirement >= minRetirementAge) {
        setStep(2);
      } else if (step !== 1 && ageAtRetirement < minRetirementAge) {
        form.setValue("additionalPensionFunds", 0);
        form.setValue("additionalPensionFunds", 0);
        form.setValue("nationalPensionFunds", 0);
        form.setValue("nationalPensionFundsCutOut", 0);
        form.setValue("pensionFunder", undefined);
        form.setValue("selectedOption", undefined);
        form.setValue("periodYears", undefined);
        form.setValue("installmentPeriod", undefined);
        form.setValue("installmentAmount", undefined);
        form.setValue("monthlyPaymentForSmallFunds", undefined);

        setStep(1);
      }
    } else {
      setCalculatedAge(null);
      setMinWorkExperience(null);
      setCurrentWorkExperience(null);
      setIsTransferToNOIPossible(null);
      setIsExperienceEnough(null);
      setIsRetirementAge(null);
      setIsRetirementEligible(null);
      setStep(1);
    }
  };

  // Check pension fund amounts
  const checkPensionFundComplete = () => {
    const additionalFunds = form.watch("additionalPensionFunds") || 0;
    const pensionFunder = form.watch("pensionFunder");
    const retirementDate = form.watch("retirementDate");

    if (additionalFunds > 0 && pensionFunder) {
      const monthlySum = calculateMonthlySumF6(
        additionalFunds,
        Math.floor(calculatedAge),
        pensionFunders[pensionFunder],
      );

      const minOSV = minimumOSVPension(retirementDate);
      setMinInstallmentAmount(0.15 * minOSV);
      setMaxInstallmentAmount(minOSV);
      const isMonthlySumLessThan15Percent = monthlySum < 0.15 * minOSV;

      // Check if we crossed the threshold
      const currentThreshold = isMonthlySumLessThan15Percent
        ? "small"
        : "large";
      if (
        previousFundsThreshold !== null &&
        previousFundsThreshold !== currentThreshold
      ) {
        resetFormStateForThreshold(isMonthlySumLessThan15Percent);
      }

      if (isMonthlySumLessThan15Percent) {
        if (additionalFunds < 3 * minOSV) {
          setShowOneTimePaymentOption(true);
          setShowSubmitButton(false);
        } else {
          setShowOneTimePaymentOption(false);
          setShowSubmitButton(true);
        }
      }

      // Update threshold state for future comparison
      setPreviousFundsThreshold(currentThreshold);

      // Update UI states based on fund amount

      setShowSmallFundOptions(isMonthlySumLessThan15Percent);
      setShowOptionDropdown(!isMonthlySumLessThan15Percent);

      if (!isMonthlySumLessThan15Percent) {
        if (step < 3) setStep(3);

        // Reset the national pension step visibility for large funds
        // It will be shown again only if appropriate option conditions are met
        setShowNationalPensionStep(false);
      } else {
        if (step > 2) setStep(2);
        setShowNationalPensionStep(false); // Don't show national pension step for small funds
      }
    }
  };

  const checkOptionFieldsComplete = () => {
    if (step < 3) return;

    const selectedOption = form.watch("selectedOption");
    if (selectedOption) {
      setShowNationalPensionStep(isRetirementEligible);
      setStep(4);
      return;
    }
    setShowNationalPensionStep(false);
  };

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      const formValues = form.getValues();
      if (Object.keys(formValues).length > 0) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
      }

      if (
        [
          "dateOfBirth",
          "gender",
          "workExperienceYears",
          "workExperienceMonths",
          "retirementDate",
        ].includes(name || "")
      ) {
        checkBasicInfoComplete();
      }

      if (["additionalPensionFunds", "pensionFunder"].includes(name || "")) {
        checkPensionFundComplete();
      }

      if (
        [
          "selectedOption",
          "periodYears",
          "installmentPeriod",
          "installmentAmount",
        ].includes(name || "")
      ) {
        checkOptionFieldsComplete();
      }

      if (["selectedOption"].includes(name)) {
        resetBigFundsInputs();
        if (formValues.selectedOption) setShowSubmitButton(true);
      }
    });

    checkBasicInfoComplete();
    checkPensionFundComplete();
    checkOptionFieldsComplete();

    return () => subscription.unsubscribe();
  }, [form.watch]);

  useEffect(() => {
    if (form.watch("selectedOption")) setShowSubmitButton(true);
  }, [form.watch("selectedOption")]);

  // Force re-check when additionalPensionFunds changes
  useEffect(() => {
    const additionalFunds = form.watch("additionalPensionFunds") || 0;
    const pensionFunder = form.watch("pensionFunder");

    if (additionalFunds > 0 && pensionFunder) {
      // Determine if this is a small or large fund
      const isSmallFund = additionalFunds <= 10000;
      const currentThreshold = isSmallFund ? "small" : "large";

      // Check if we crossed the threshold
      if (
        previousFundsThreshold !== null &&
        previousFundsThreshold !== currentThreshold
      ) {
        resetFormStateForThreshold(isSmallFund);
      }

      // Update threshold state
      setPreviousFundsThreshold(currentThreshold);

      // Update UI based on fund size
      if (isSmallFund) {
        // Set up UI for small funds
        setShowOptionDropdown(false);
        setShowSmallFundOptions(true);
        setShowNationalPensionStep(false);
        if (step > 2) {
          setStep(2);
        }
      } else {
        setShowOptionDropdown(true);
        setShowSmallFundOptions(false);
        if (step < 3) {
          setStep(3);
        }
      }
    }
  }, [form.watch("additionalPensionFunds")]);

  // Watch for changes to selectedOption and its dependent fields
  useEffect(() => {
    const selectedOption = form.watch("selectedOption");
    const additionalFunds = form.watch("additionalPensionFunds") || 0;

    // Reset calculation result when option changes
    setCalculationResult(null);

    // Don't show national pension step for small funds
    if (additionalFunds <= 10000) {
      setShowNationalPensionStep(false);
      return;
    }

    // For Option 1 with large funds, show national pension step immediately
    if (selectedOption === "option1") {
      setShowNationalPensionStep(isRetirementEligible);
      setStep(4);
      return;
    }

    // For other options, check conditions
    checkOptionFieldsComplete();
  }, [form.watch("selectedOption")]);

  // Separate effect for option-specific fields
  useEffect(() => {
    // Reset calculation result when option-specific fields change
    setCalculationResult(null);

    checkOptionFieldsComplete();
  }, [
    form.watch("periodYears"),
    form.watch("installmentPeriod"),
    form.watch("installmentAmount"),
  ]);

  const onSubmit = (data: FormValues) => {
    const pp = form.watch("monthlyPaymentForSmallFunds");
    setNN(pp);
    if (showSmallFundOptions) {
      if (showOneTimePaymentOption) return;
      const firstMonthlyPayment =
        data.additionalPensionFunds / data.monthlyPaymentForSmallFunds;
      if (
        firstMonthlyPayment < minInstallmentAmount ||
        firstMonthlyPayment > maxInstallmentAmount
      ) {
        setPartialCalculationResult(null);
        setShowMonthlyPaymentForSmallFundsError(true);
        return;
      }

      if (isRetirementEligible) {
        if (!data.nationalPensionFunds || !data.nationalPensionFundsCutOut) {
          toast({
            title: "Прогнозна пенсия е непопълнена",
            variant: "destructive",
            duration: 2000,
          });
          return;
        }
        setCalculationResult({
          standardMonthlyPension: data.nationalPensionFunds,
          enhancedMonthlyPension: data.nationalPensionFundsCutOut,
          showRecommend: false,
          variant3CurrentMonthlyPensionWish:
            data.nationalPensionFundsCutOut + firstMonthlyPayment,
          variant3CurrentMonthlyPensionWishMonths:
            data.monthlyPaymentForSmallFunds,
          showSingleOption: false,
          isOption3Selected: true,
        });
        setTimeout(() => {
          const resultElement = document.getElementById("calculation-result");
          if (resultElement) {
            resultElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      } else {
        setShowMonthlyPaymentForSmallFundsError(false);
        setPartialCalculationResult(firstMonthlyPayment);
        setCalculationResult(null);
      }
      return;
    }

    let result = 0;
    switch (data.selectedOption) {
      case "option1":
        result = calculateMonthlySumF6(
          data.additionalPensionFunds,
          customAgeRound(calculatedAge),
          pensionFunders[data.pensionFunder],
        );
        break;
      case "option2":
        if (!data.periodYears) {
          toast({
            title: "Период е непопълнен",
            variant: "destructive",
            duration: 2000,
          });
          return;
        }
        result = calculateMonthlyGuaranteedSumG6(
          data.additionalPensionFunds,
          customAgeRound(calculatedAge),
          pensionFunders[data.pensionFunder],
          data.periodYears,
        );
        break;
      case "option3":
        if (!data.installmentPeriod || !data.installmentAmount) {
          toast({
            title: "Период и/или сума са непопълнени",
            variant: "destructive",
            duration: 2000,
          });
          return;
        }
        result = calculateMonthlyScheduledSumH6(
          data.additionalPensionFunds,
          customAgeRound(calculatedAge),
          pensionFunders[data.pensionFunder],
          data.installmentPeriod,
          data.installmentAmount,
        );

        if (result < minInstallmentAmount) {
          toast({
            title: `Сумата на пожизнената пенсия не може да е по-малка от ${formatCurrency(minInstallmentAmount)}. Моля изберете по-кратък срок за разсрочване И/ИЛИ по-малка разсрочена песния.`,
            variant: "destructive",
            duration: 4000,
          });
          return;
        }
        break;

      default:
        console.error("SOMETHIGNS WRONG");
        return;
    }

    if (isRetirementEligible) {
      if (!data.nationalPensionFunds || !data.nationalPensionFundsCutOut) {
        toast({
          title: "Прогнозна пенсия е непопълнена",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }
      setCalculationResult({
        standardMonthlyPension: data.nationalPensionFunds,
        enhancedMonthlyPension: data.nationalPensionFundsCutOut + result,
        showRecommend: data.selectedOption != "option3",
        variant3CurrentMonthlyPensionWish:
          data.selectedOption === "option3"
            ? data.installmentAmount + data.nationalPensionFundsCutOut
            : undefined,
        variant3CurrentMonthlyPensionWishMonths:
          data.selectedOption === "option3" ? data.installmentPeriod : 0,
        showSingleOption: false,
        isOption3Selected: data.selectedOption === "option3",
      });
    } else {
      setCalculationResult({
        standardMonthlyPension: 0,
        enhancedMonthlyPension: result,
        showRecommend: false,
        variant3CurrentMonthlyPensionWish:
          data.selectedOption === "option3"
            ? data.installmentAmount
            : undefined,
        variant3CurrentMonthlyPensionWishMonths:
          data.selectedOption === "option3" ? data.installmentPeriod : 0,
        showSingleOption: true,
        isOption3Selected: data.selectedOption === "option3",
      });
    }
    setTimeout(() => {
      const resultElement = document.getElementById("calculation-result");
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  function PensionTooltip() {
    const conetnt = `Ако сте роден след 1959 г., задължително подлежите на осигуряване за пенсия, както в Държавното обществено осигуряване (ДОО), което се извършва от Националния осигурителен институт (НОИ), така и на Допълнително задължително пенсионно осигуряване (ДЗПО), което се извършва чрез частни пенсионно-осигурителни дружества (ПОД).
След пенсиониране, осигуряването в ДОО Ви дава право на „държавна пенсия“, която получавате от НОИ, а осигуряването в ДЗПО Ви дава право на т.нар. „втора пенсия“, която получавате от Вашето частно ПОД.
Законът Ви дава право, ако пожелаете, да се откажете от осигуряването за втора пенсия в частно ПОД и да прехвърлите изцяло осигуряването си за пенсия към НОИ. Важно е, да знаете, обаче, че ако решите да прехвърлите спестяванията си за втора пенсия от частно ПОД към НОИ има краен срок за това прехвърляне, който изтича преди навършване на възрастта за пенсиониране.`;
    return (
      <>
        <div className="sm:hidden">
          <Dialog>
            <DialogTrigger asChild>
              <button>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Допълнително пенсионно осигуряване</DialogTitle>
              </DialogHeader>
              <p>{conetnt}</p>
            </DialogContent>
          </Dialog>
        </div>

        <div className="hidden sm:block">
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="w-[500px]">{conetnt}</TooltipContent>
          </Tooltip>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <motion.div className="form-appear">
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Основна информация</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 h-6">
                      <Label htmlFor="dateOfBirth">Дата на раждане</Label>
                    </div>
                    <Controller
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "dd.MM.yyyy", {
                                  locale: bg,
                                })
                              ) : (
                                <span>Изберете дата</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              defaultMonth={DEFAULT_BIRTH_DATE}
                              fromDate={MIN_BIRTH_DATE} // No dates before 1960-01-01
                              toDate={TODAY}
                              initialFocus
                              className="rounded-md border p-3 pointer-events-auto"
                              locale={bg}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {form.formState.errors.dateOfBirth && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 h-6">
                      <Label>Пол</Label>
                    </div>
                    <Controller
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label
                              htmlFor="male"
                              className="font-normal cursor-pointer"
                            >
                              Мъж
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label
                              htmlFor="female"
                              className="font-normal cursor-pointer"
                            >
                              Жена
                            </Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                    {form.formState.errors.gender && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 h-6">
                      <Label htmlFor="workExperienceYears">Стаж (години)</Label>
                    </div>
                    <Controller
                      control={form.control}
                      name="workExperienceYears"
                      render={({ field }) => (
                        <Input
                          onWheel={(e) => e.currentTarget.blur()}
                          id="workExperienceYears"
                          type="number"
                          min={0}
                          max={80}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          value={field.value === 0 ? "" : field.value}
                          placeholder="Въведете години"
                        />
                      )}
                    />
                    {form.formState.errors.workExperienceYears && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.workExperienceYears.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 h-6">
                      <Label htmlFor="workExperienceMonths">
                        Стаж (месеци)
                      </Label>
                    </div>
                    <Controller
                      control={form.control}
                      name="workExperienceMonths"
                      render={({ field }) => (
                        <Input
                          onWheel={(e) => e.currentTarget.blur()}
                          id="workExperienceMonths"
                          type="number"
                          min={0}
                          max={11}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          value={field.value === 0 ? "" : field.value}
                          placeholder="Въведете месеци"
                        />
                      )}
                    />
                    {form.formState.errors.workExperienceMonths && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.workExperienceMonths.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 h-6">
                      <Label htmlFor="retirementDate">
                        Дата на пенсиониране
                      </Label>
                    </div>
                    <Controller
                      control={form.control}
                      name="retirementDate"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "dd.MM.yyyy", {
                                  locale: bg,
                                })
                              ) : (
                                <span>Изберете дата</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              defaultMonth={TODAY}
                              fromDate={MIN_RETIREMENT_DATE}
                              toDate={MAX_RETIREMENT_DATE} // Up to 40 years in future
                              initialFocus
                              className="rounded-md border p-3 pointer-events-auto"
                              locale={bg}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {form.formState.errors.retirementDate && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.retirementDate.message}
                      </p>
                    )}
                    {isRetirementAge !== null && isRetirementAge === false && (
                      <p className="text-sm text-destructive">
                        За да продължите, моля въведете дата на пенсиониране,
                        когато ще имате навършени години за пенсия.
                      </p>
                    )}
                  </div>
                </div>

                {/* Eligibility Message */}
                <AnimatePresence>
                  {calculatedAge !== null && isRetirementEligible !== null && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert
                        variant={isRetirementAge ? "default" : "destructive"}
                        className={cn(
                          "mt-4 flex items-center",
                          isRetirementAge
                            ? "bg-green-50 text-green-800 border-green-200"
                            : "bg-red-50 text-red-800 border-red-200",
                        )}
                      >
                        {isRetirementAge ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mr-2 shrink-0" />
                        )}
                        <AlertDescription className="text-sm">
                          {isRetirementAge
                            ? `Към избраната дата имате навършени години за пенсия. Навършили сте години за пенсия на ${calculatedRetirementDate}.`
                            : `Към избраната дата нямате навършени години за пенсия. Ще навършите години за пенсия на ${calculatedRetirementDate}.`}
                        </AlertDescription>
                      </Alert>
                      {isRetirementAge && (
                        <Alert
                          variant={
                            isExperienceEnough ? "default" : "destructive"
                          }
                          className={cn(
                            "mt-4 flex items-center",
                            isExperienceEnough
                              ? "bg-green-50 text-green-800 border-green-200"
                              : "bg-red-50 text-red-800 border-red-200",
                          )}
                        >
                          {isExperienceEnough ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mr-2 shrink-0" />
                          )}
                          <AlertDescription className="text-sm">
                            {isExperienceEnough
                              ? `Към избраната дата имате необходимия стаж за пенсия от НОИ. Необходимият стаж за пенсия е ${formatYearsAndMonths(minWorkExperience)}`
                              : `Към избраната дата нямате необходимия стаж за пенсия от НОИ. Не ви достигат ${formatYearsAndMonths(minWorkExperience - currentWorkExperience)} стаж за пенсия.`}
                          </AlertDescription>
                        </Alert>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {calculatedAge !== null &&
                    isRetirementAge &&
                    isTransferToNOIPossible && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert
                          variant={
                            isTransferToNOIPossible === "available"
                              ? "default"
                              : "destructive"
                          }
                          className={cn(
                            "mt-4 flex items-center",
                            isTransferToNOIPossible === "available"
                              ? "bg-green-50 text-green-800 border-green-200"
                              : "bg-red-50 text-red-800 border-red-200",
                          )}
                        >
                          {isTransferToNOIPossible === "available" ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mr-2 shrink-0" />
                          )}
                          <AlertDescription className="text-sm">
                            {isTransferToNOIPossible === "available"
                              ? `Срокът за прехвърляне на Вашите спестявания за втора пенсия от УПФ в НОИ изтича на  `
                              : `Срокът за прехвърляне на Вашите спестявания за втора пенсия от УПФ в НОИ е изтекъл на `}
                            {transferToNOIDate}
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>

              {/* Step 2: Pension Funds */}
              <AnimatePresence>
                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <Separator />
                    <h3 className="text-lg font-medium">
                      Размер на натрупани средства за втора пенсия
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="additionalPensionFunds">
                            Сума по Вашата партида в УПФ (лв.)
                          </Label>
                        </div>
                        <Controller
                          control={form.control}
                          name="additionalPensionFunds"
                          render={({ field }) => (
                            <Input
                              onWheel={(e) => e.currentTarget.blur()}
                              id="additionalPensionFunds"
                              type="number"
                              step="any"
                              min={0}
                              onChange={(e) => {
                                if (e.target.value === "") {
                                  field.onChange(0);
                                  return;
                                }
                                if (/^\d+(\.\d{0,2})?$/.test(e.target.value)) {
                                  let value = parseFloat(e.target.value) || 0;
                                  if (value > 999999) {
                                    field.onChange(999999);
                                    return;
                                  }
                                  field.onChange(value);
                                }
                              }}
                              value={field.value === 0 ? "" : field.value}
                              placeholder="Въведете сума"
                            />
                          )}
                        />
                        {form.formState.errors.additionalPensionFunds && (
                          <p className="text-sm text-destructive">
                            {
                              form.formState.errors.additionalPensionFunds
                                .message
                            }
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="pensionFunder">
                            Настоящ Универсален пенсионен фонд
                          </Label>
                          <PensionTooltip />
                        </div>
                        <Controller
                          control={form.control}
                          name="pensionFunder"
                          render={({ field }) => (
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                // Force check after selection
                                setTimeout(() => checkPensionFundComplete(), 0);
                              }}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Изберете пенсионен фонд" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.keys(pensionFunders).map((funder) => (
                                  <SelectItem key={funder} value={funder}>
                                    {funder}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {form.formState.errors.pensionFunder && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.pensionFunder.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Small Fund Options */}
                    <AnimatePresence>
                      {showSmallFundOptions && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div>
                            <Label>
                              Според натрупаната сума по Вашата пенсионна
                              партида:
                            </Label>

                            {showOneTimePaymentOption ? (
                              <div className="flex flex-col gap-2">
                                <Alert
                                  variant={"default"}
                                  className={cn(
                                    "mt-4 flex items-center",

                                    "bg-blue-50 text-blue-600 border-blue-200",
                                  )}
                                >
                                  <InfoIcon className="h-5 w-5 text-blue-600 mr-2 shrink-0" />
                                  <AlertDescription className="text-sm">
                                    Имате право на еднократно плащане
                                  </AlertDescription>
                                </Alert>
                                <Card className="flex-1 bg-white border shadow-sm hover:shadow-md transition-shadow">
                                  <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center h-full">
                                    <div className="text-3xl font-bold mb-2">
                                      {formatCurrency(
                                        form.watch("additionalPensionFunds") ??
                                          0,
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            ) : (
                              <>
                                <Alert
                                  variant={"default"}
                                  className={cn(
                                    "mt-4 mb-2 flex items-center",
                                    "bg-blue-50 text-blue-600 border-blue-200",
                                  )}
                                >
                                  <InfoIcon className="h-5 w-5 text-blue-600 mr-2 shrink-0" />
                                  <AlertDescription className="text-sm">
                                    Имате право на разсрочена пенсия
                                  </AlertDescription>
                                </Alert>
                                <div className="flex items-center gap-2 mb-2">
                                  <Label htmlFor="monthlyPaymentForSmallFunds">
                                    Период на разсрочване (в месеци){" "}
                                  </Label>
                                </div>
                                <Controller
                                  control={form.control}
                                  name="monthlyPaymentForSmallFunds"
                                  render={({ field }) => (
                                    <Input
                                      onWheel={(e) => e.currentTarget.blur()}
                                      id="monthlyPaymentForSmallFunds"
                                      type="number"
                                      onChange={(e) =>
                                        field.onChange(
                                          parseInt(e.target.value) || 0,
                                        )
                                      }
                                      value={
                                        field.value === 0 ? "" : field.value
                                      }
                                      placeholder="Въведете месеци"
                                    />
                                  )}
                                />
                                {form.formState.errors
                                  .monthlyPaymentForSmallFunds && (
                                  <p className="text-sm text-destructive">
                                    {
                                      form.formState.errors
                                        .monthlyPaymentForSmallFunds.message
                                    }
                                  </p>
                                )}

                                {showMonthlyPaymentForSmallFundsError && (
                                  <p className="text-sm text-destructive">
                                    <div>
                                      {`Сумата за месец трябва да е между ${formatCurrency(minInstallmentAmount)} и ${formatCurrency(maxInstallmentAmount)}`}
                                    </div>
                                    <div>
                                      {form.watch("additionalPensionFunds") &&
                                        `Периодът може да е между ${Math.ceil(form.watch("additionalPensionFunds") / maxInstallmentAmount)} и ${Math.floor(form.watch("additionalPensionFunds") / minInstallmentAmount)} месеца`}
                                    </div>
                                  </p>
                                )}

                                {!isNaN(partialCalculationResult) &&
                                  partialCalculationResult &&
                                  !isRetirementEligible && (
                                    <div className="flex flex-col pt-3">
                                      <Separator className="my-6" />

                                      <h3 className="text-lg font-medium mb-4">
                                        Резултат от изчислението
                                      </h3>
                                      <div className="text-center">
                                        <span className="text-2xl font-medium text-center text-primary">
                                          Първоначален размер на втора пенсия
                                        </span>
                                      </div>

                                      <Card className="flex-1 bg-white border shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center h-full">
                                          <div className="text-3xl font-bold mb-2">
                                            {formatCurrency(
                                              partialCalculationResult,
                                            )}
                                          </div>
                                          <div
                                            className={cn(
                                              "text-sm font-normal text-red-600",
                                              "leading-tight break-words",
                                            )}
                                          >
                                            {`За период от ${nn} месеца`}
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <div className="text-center pb-3">
                                        <span className="text-xs font-medium text-red-600">
                                          За да направите сравнение с държавната
                                          пенсия моля въведете данни за стаж и
                                          прогнозен размер на пенсия от ДОО.
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                {step === 2 &&
                                  isRetirementEligible &&
                                  !showOneTimePaymentOption &&
                                  showSmallFundOptions && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="space-y-6 mt-2"
                                    >
                                      <Separator />
                                      <h3 className="text-lg font-medium">
                                        Прогнозна пенсия от Държавното
                                        обществено осигуряване (ДОО)
                                      </h3>
                                      <div className="space-y-2 max-w-md">
                                        <div className="flex items-center gap-2">
                                          <Label htmlFor="nationalPensionFunds">
                                            Пенсия от НОИ в пълен размер (лв.)
                                          </Label>
                                        </div>
                                        <Controller
                                          control={form.control}
                                          name="nationalPensionFunds"
                                          render={({ field }) => (
                                            <Input
                                              onWheel={(e) =>
                                                e.currentTarget.blur()
                                              }
                                              id="nationalPensionFunds"
                                              type="number"
                                              min={0}
                                              step="any"
                                              onChange={(e) => {
                                                if (e.target.value === "") {
                                                  field.onChange(0);
                                                  return;
                                                }
                                                if (
                                                  /^\d+(\.\d{0,2})?$/.test(
                                                    e.target.value,
                                                  )
                                                ) {
                                                  let value =
                                                    parseFloat(
                                                      e.target.value,
                                                    ) || 0;
                                                  if (value > 9999) {
                                                    field.onChange(9999);
                                                    return;
                                                  }
                                                  field.onChange(value);
                                                }
                                              }}
                                              value={
                                                field.value === 0
                                                  ? ""
                                                  : field.value
                                              }
                                              placeholder="Въведете сума"
                                            />
                                          )}
                                        />
                                        {form.formState.errors
                                          .nationalPensionFunds && (
                                          <p className="text-sm text-destructive">
                                            {
                                              form.formState.errors
                                                .nationalPensionFunds.message
                                            }
                                          </p>
                                        )}
                                      </div>
                                      <div className="space-y-2 max-w-md">
                                        <div className="flex items-center gap-2">
                                          <Label htmlFor="nationalPensionFundsCutOut">
                                            Пенсия от НОИ в намален размер (лв.)
                                          </Label>
                                        </div>
                                        <Controller
                                          control={form.control}
                                          name="nationalPensionFundsCutOut"
                                          render={({ field }) => (
                                            <Input
                                              onWheel={(e) =>
                                                e.currentTarget.blur()
                                              }
                                              id="nationalPensionFundsCutOut"
                                              type="number"
                                              step="any"
                                              min={0}
                                              onChange={(e) => {
                                                if (e.target.value === "") {
                                                  field.onChange(0);
                                                  return;
                                                }
                                                if (
                                                  /^\d+(\.\d{0,2})?$/.test(
                                                    e.target.value,
                                                  )
                                                ) {
                                                  let value =
                                                    parseFloat(
                                                      e.target.value,
                                                    ) || 0;
                                                  if (value > 9999)
                                                    value = 9999;
                                                  field.onChange(value);
                                                }
                                              }}
                                              value={
                                                field.value === 0
                                                  ? ""
                                                  : field.value
                                              }
                                              placeholder="Въведете сума"
                                            />
                                          )}
                                        />
                                        {form.formState.errors
                                          .nationalPensionFundsCutOut && (
                                          <p className="text-sm text-destructive">
                                            {
                                              form.formState.errors
                                                .nationalPensionFundsCutOut
                                                .message
                                            }
                                          </p>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 3: Options for large funds */}
              <AnimatePresence>
                {step >= 3 && showOptionDropdown && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <Separator />
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label>
                          Според натрупаната сума по Вашата пенсионна партида:
                        </Label>

                        <Alert
                          variant={"default"}
                          className={cn(
                            "mt-4 flex items-center",

                            "bg-blue-50 text-blue-600 border-blue-200",
                          )}
                        >
                          <InfoIcon className="h-5 w-5 text-blue-600 mr-2 shrink-0" />
                          <AlertDescription className="text-sm">
                            Имате право на пожизнена пенсия
                          </AlertDescription>
                        </Alert>
                      </div>
                    </motion.div>

                    <div className="space-y-4">
                      <Controller
                        control={form.control}
                        name="selectedOption"
                        render={({ field }) => (
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Reset calculation result when option changes
                              setCalculationResult(null);
                            }}
                            value={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem
                                value="option1"
                                id="option1"
                                className="mt-1"
                              />
                              <div>
                                <Label
                                  htmlFor="option1"
                                  className="font-medium cursor-pointer"
                                >
                                  Пожизнена пенсия без допълнителни условия
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Това е пожизнената пенсия от УПФ с най-голям
                                  размер, но при нея няма наследяване. В случай
                                  на смърт на пенсионера наследниците не
                                  получават нищо.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start space-x-2">
                              <RadioGroupItem
                                value="option2"
                                id="option2"
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor="option2"
                                  className="font-medium cursor-pointer"
                                >
                                  Пожизнена пенсия с гарантиран период
                                </Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                  При тази пожизнена пенсия, в случай на смърт
                                  на пенсионера наследниците получават остатъка
                                  до края на периода на гаранция. След края на
                                  периода на гаранция размерът на пенсията се
                                  запазва, но вече няма наследяване.
                                </p>

                                <AnimatePresence>
                                  {field.value === "option2" && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <div className="space-y-2 ml-0 mt-2">
                                        <div className="flex items-center gap-2">
                                          <Label htmlFor="periodYears">
                                            Период на гаранция (в години)
                                          </Label>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="w-[200px] text-sm">
                                                Периодът, през който желаете да
                                                получавате месечни плащания.
                                              </p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </div>
                                        <Controller
                                          control={form.control}
                                          name="periodYears"
                                          render={({ field }) => (
                                            <Input
                                              onWheel={(e) =>
                                                e.currentTarget.blur()
                                              }
                                              id="periodYears"
                                              type="number"
                                              min={1}
                                              max={30}
                                              onChange={(e) =>
                                                field.onChange(
                                                  parseInt(e.target.value) ||
                                                    "",
                                                )
                                              }
                                              value={field.value || ""}
                                              placeholder="Въведете години"
                                              className="max-w-[200px]"
                                            />
                                          )}
                                        />
                                        {form.formState.errors.periodYears && (
                                          <p className="text-sm text-destructive">
                                            {
                                              form.formState.errors.periodYears
                                                .message
                                            }
                                          </p>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>

                            <div className="flex items-start space-x-2">
                              <RadioGroupItem
                                value="option3"
                                id="option3"
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor="option3"
                                  className="font-medium cursor-pointer"
                                >
                                  Пожизнена пенсия с разсрочено плащане
                                </Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                  При тази пожизнена пенсия също има
                                  наследяване, в случай на смърт на пенсионера
                                  наследниците получават остатъка до края на
                                  периода на разсрочване. След края на периода
                                  на разсрочване сумата на пенсията се променя
                                  съобразно остатъка по партидата на пенсионера,
                                  но вече няма наследяване.
                                </p>

                                <AnimatePresence>
                                  {field.value === "option3" && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="space-y-4 mt-2"
                                    >
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <Label htmlFor="installmentPeriod">
                                            Период на разсрочване (в
                                            месеци){" "}
                                          </Label>
                                        </div>
                                        <Controller
                                          control={form.control}
                                          name="installmentPeriod"
                                          render={({ field }) => (
                                            <Input
                                              onWheel={(e) =>
                                                e.currentTarget.blur()
                                              }
                                              id="installmentPeriod"
                                              type="number"
                                              min={1}
                                              onChange={(e) =>
                                                field.onChange(
                                                  parseInt(e.target.value) ||
                                                    "",
                                                )
                                              }
                                              value={field.value || ""}
                                              placeholder="Въведете месеци"
                                              className="max-w-[200px]"
                                            />
                                          )}
                                        />
                                        {form.formState.errors
                                          .installmentPeriod && (
                                          <p className="text-sm text-destructive">
                                            {
                                              form.formState.errors
                                                .installmentPeriod.message
                                            }
                                          </p>
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <Label htmlFor="installmentAmount">
                                            Месечна сума на разсроченото плащане
                                            (лв.)
                                          </Label>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="w-[200px] text-sm">
                                                Сумата, която желаете да
                                                получавате.
                                              </p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </div>
                                        <Controller
                                          control={form.control}
                                          name="installmentAmount"
                                          render={({ field }) => (
                                            <Input
                                              onWheel={(e) =>
                                                e.currentTarget.blur()
                                              }
                                              id="installmentAmount"
                                              type="number"
                                              min={1}
                                              step="any"
                                              onChange={(e) => {
                                                if (e.target.value === "") {
                                                  field.onChange(0);
                                                  return;
                                                }
                                                if (
                                                  /^\d+(\.\d{0,2})?$/.test(
                                                    e.target.value,
                                                  )
                                                ) {
                                                  const value =
                                                    parseFloat(
                                                      e.target.value,
                                                    ) || "";
                                                  field.onChange(value);
                                                }
                                              }}
                                              value={field.value || ""}
                                              placeholder="Въведете сума"
                                              className="max-w-[200px]"
                                            />
                                          )}
                                        />
                                        {form.formState.errors
                                          .installmentAmount && (
                                          <p className="text-sm text-destructive">
                                            {
                                              form.formState.errors
                                                .installmentAmount.message
                                            }
                                          </p>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </RadioGroup>
                        )}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 4: National Pension Funds */}
              <AnimatePresence>
                {step >= 4 && showNationalPensionStep && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <Separator />
                    <h3 className="text-lg font-medium">
                      Прогнозна пенсия от Държавното обществено осигуряване
                      (ДОО)
                    </h3>
                    <div className="space-y-2 max-w-md">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="nationalPensionFunds">
                          Пенсия от НОИ в пълен размер (лв.)
                        </Label>
                      </div>
                      <Controller
                        control={form.control}
                        name="nationalPensionFunds"
                        render={({ field }) => (
                          <Input
                            onWheel={(e) => e.currentTarget.blur()}
                            id="nationalPensionFunds"
                            type="number"
                            min={0}
                            step="any"
                            onChange={(e) => {
                              if (e.target.value === "") {
                                field.onChange(0);
                                return;
                              }
                              if (/^\d+(\.\d{0,2})?$/.test(e.target.value)) {
                                let value = parseFloat(e.target.value) || 0;
                                if (value > 9999) {
                                  field.onChange(9999);
                                  return;
                                }
                                field.onChange(value);
                              }
                            }}
                            value={field.value === 0 ? "" : field.value}
                            placeholder="Въведете сума"
                          />
                        )}
                      />
                      {form.formState.errors.nationalPensionFunds && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.nationalPensionFunds.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 max-w-md">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="nationalPensionFundsCutOut">
                          Пенсия от НОИ в намален размер (лв.)
                        </Label>
                      </div>
                      <Controller
                        control={form.control}
                        name="nationalPensionFundsCutOut"
                        render={({ field }) => (
                          <Input
                            onWheel={(e) => e.currentTarget.blur()}
                            id="nationalPensionFundsCutOut"
                            type="number"
                            step="any"
                            min={0}
                            onChange={(e) => {
                              if (e.target.value === "") {
                                field.onChange(0);
                                return;
                              }
                              if (/^\d+(\.\d{0,2})?$/.test(e.target.value)) {
                                let value = parseFloat(e.target.value) || 0;
                                if (value > 9999) {
                                  field.onChange(9999);
                                  return;
                                }
                                field.onChange(value);
                              }
                            }}
                            value={field.value === 0 ? "" : field.value}
                            placeholder="Въведете сума"
                          />
                        )}
                      />
                      {form.formState.errors.nationalPensionFundsCutOut && (
                        <p className="text-sm text-destructive">
                          {
                            form.formState.errors
                              .nationalPensionFundsCutOut.message
                          }
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showSubmitButton && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <Separator />
                    <div>
                      <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="mt-2"
                      >
                        {!isRetirementEligible ? "Изчисли" : "Сравни"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Calculation Result */}
              <AnimatePresence>
                {calculationResult && (
                  <motion.div
                    id="calculation-result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Separator className="my-6" />
                    <h3 className="text-lg font-medium mb-4">
                      Резултат от изчислението
                    </h3>
                    <CalculationResult result={calculationResult} />
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function customAgeRound(age: number) {
  return age % 1 >= 0.5 ? Math.ceil(age) : Math.floor(age);
}
