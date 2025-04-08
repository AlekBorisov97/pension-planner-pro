
import { useState, useEffect } from 'react';
import { format, addYears } from 'date-fns';
import { bg } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, HelpCircle, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { calculateRetirement, pensionFunders, paymentOptions, RetirementInputs } from '@/utils/calculatorUtils';
import CalculationResult from './CalculationResult';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'retirement-calculator-form-data';
const DEFAULT_BIRTH_DATE = new Date('1960-01-01');
const MIN_BIRTH_DATE = new Date('1960-01-01'); // No dates before 1960-01-01
const TODAY = new Date();
const MAX_RETIREMENT_DATE = addYears(TODAY, 40); // Up to 40 years in future

const formSchema = z.object({
  dateOfBirth: z.date({
    required_error: 'Моля, изберете дата на раждане.',
  }),
  gender: z.enum(['male', 'female'], {
    required_error: 'Моля, изберете пол.',
  }),
  workExperienceYears: z.number()
    .int()
    .min(0, 'Годините трябва да са 0 или повече')
    .max(80, 'Годините трябва да са 80 или по-малко'),
  workExperienceMonths: z.number()
    .int()
    .min(0, 'Месеците трябва да са 0 или повече')
    .max(11, 'Месеците трябва да са 11 или по-малко'),
  retirementDate: z.date({
    required_error: 'Моля, изберете дата на пенсиониране.',
  }),
  additionalPensionFunds: z.number()
    .min(0, 'Сумата трябва да е 0 или повече'),
  pensionFunder: z.string({
    required_error: 'Моля, изберете пенсионен фонд.',
  }),
  selectedOption: z.enum(['option1', 'option2', 'option3']).optional(),
  periodYears: z.number()
    .int()
    .min(1, 'Периодът трябва да е поне 1 година')
    .optional(),
  installmentPeriod: z.number()
    .int()
    .min(1, 'Периодът трябва да е поне 1')
    .optional(),
  installmentAmount: z.number()
    .min(1, 'Сумата трябва да е поне 1')
    .optional(),
  nationalPensionFunds: z.number()
    .min(0, 'Сумата трябва да е 0 или повече'),
  paymentOption: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RetirementCalculator() {
  const { toast } = useToast();
  const [calculationResult, setCalculationResult] = useState<ReturnType<typeof calculateRetirement> | null>(null);
  const [basicInfoComplete, setBasicInfoComplete] = useState(false);
  const [step, setStep] = useState(1);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [isRetirementEligible, setIsRetirementEligible] = useState<boolean | null>(null);
  const [showOptionDropdown, setShowOptionDropdown] = useState(false);
  const [showNationalPensionStep, setShowNationalPensionStep] = useState(false);
  const [showSmallFundOptions, setShowSmallFundOptions] = useState(false);
  
  const loadSavedFormData = (): Partial<FormValues> => {
    if (typeof window === 'undefined') return {};
    
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return {};
    
    try {
      const parsedData = JSON.parse(savedData);
      
      if (parsedData.dateOfBirth) parsedData.dateOfBirth = new Date(parsedData.dateOfBirth);
      if (parsedData.retirementDate) parsedData.retirementDate = new Date(parsedData.retirementDate);
      
      return parsedData;
    } catch (e) {
      console.error('Failed to parse saved form data:', e);
      return {};
    }
  };

  const savedData = loadSavedFormData();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateOfBirth: savedData.dateOfBirth || DEFAULT_BIRTH_DATE,
      gender: savedData.gender || undefined,
      workExperienceYears: savedData.workExperienceYears || 0,
      workExperienceMonths: savedData.workExperienceMonths || 0,
      retirementDate: savedData.retirementDate || TODAY,
      additionalPensionFunds: savedData.additionalPensionFunds || 0,
      nationalPensionFunds: savedData.nationalPensionFunds || 0,
      pensionFunder: savedData.pensionFunder || undefined,
      selectedOption: savedData.selectedOption || undefined,
      periodYears: savedData.periodYears || undefined,
      installmentPeriod: savedData.installmentPeriod || undefined,
      installmentAmount: savedData.installmentAmount || undefined,
      paymentOption: savedData.paymentOption || undefined,
    },
  });

  const checkBasicInfoComplete = () => {
    const dateOfBirth = form.watch('dateOfBirth');
    const gender = form.watch('gender');
    const workExperienceYears = form.watch('workExperienceYears');
    const retirementDate = form.watch('retirementDate');
    
    const isComplete = Boolean(
      dateOfBirth && 
      gender && 
      (workExperienceYears !== undefined) && 
      retirementDate
    );
    
    setBasicInfoComplete(isComplete);
    
    if (isComplete) {
      // Calculate age at retirement
      const birthDate = new Date(dateOfBirth);
      const retirement = new Date(retirementDate);
      
      const ageAtRetirement = retirement.getFullYear() - birthDate.getFullYear();
      setCalculatedAge(ageAtRetirement);
      
      // Simple eligibility check (example logic - customize as needed)
      const minRetirementAge = gender === 'male' ? 64 : 61;
      const minWorkExperience = 15;
      
      setIsRetirementEligible(
        ageAtRetirement >= minRetirementAge && 
        workExperienceYears >= minWorkExperience
      );
      
      if (step === 1) {
        setStep(2);
      }
    } else {
      setCalculatedAge(null);
      setIsRetirementEligible(null);
      setStep(1);
    }
  };

  // Check pension fund amounts
  const checkPensionFundComplete = () => {
    const additionalFunds = form.watch('additionalPensionFunds') || 0;
    const pensionFunder = form.watch('pensionFunder');
    
    console.log("Check pension fund - funds:", additionalFunds, "funder:", pensionFunder);
    
    if (additionalFunds > 0 && pensionFunder) {
      // Check if funds are <= 10000 for small fund options
      const isSmallFund = additionalFunds <= 10000;
      setShowSmallFundOptions(isSmallFund);
      
      // Only show options for large funds (> 10000)
      const showOptions = additionalFunds > 10000;
      console.log("Additional funds:", additionalFunds, "Show options:", showOptions);
      
      setShowOptionDropdown(showOptions);
      
      if (showOptions) {
        console.log("Setting step to 3 for options");
        setStep(3); // Show options step for amounts > 10000
        
        // Reset the national pension step visibility
        // It will be shown again only if appropriate option conditions are met
        setShowNationalPensionStep(false);
      } else {
        console.log("Setting step to 2, small fund options");
        if (step > 2) setStep(2); // Reset to step 2 if we were further ahead
        setShowNationalPensionStep(false); // Don't show national pension step for small funds
      }
    }
  };

  // Check if option-specific fields are completed
  const checkOptionFieldsComplete = () => {
    if (step !== 3) return; // Only check when we're actually on the options step
    
    const additionalFunds = form.watch('additionalPensionFunds') || 0;
    const selectedOption = form.watch('selectedOption');
    console.log("Checking option fields, selected option:", selectedOption);
    
    // For small funds (≤10000), we don't show national pension step
    if (additionalFunds <= 10000) {
      console.log("Funds ≤ 10000, not showing national pension step");
      setShowNationalPensionStep(false);
      return;
    }
    
    // If Option 1 is selected with large funds, don't show national pension step
    if (selectedOption === 'option1') {
      console.log("Option 1 selected, not showing national pension step");
      setShowNationalPensionStep(false);
      return;
    }
    
    if (selectedOption === 'option2') {
      const periodYears = form.watch('periodYears');
      console.log("Option 2 selected, period years:", periodYears);
      
      if (periodYears && periodYears > 0) {
        console.log("Period years valid, showing national pension step");
        setShowNationalPensionStep(true);
        setStep(4);
      } else {
        setShowNationalPensionStep(false);
      }
    }
    
    if (selectedOption === 'option3') {
      const installmentPeriod = form.watch('installmentPeriod');
      const installmentAmount = form.watch('installmentAmount');
      console.log("Option 3 selected, period:", installmentPeriod, "amount:", installmentAmount);
      
      if (installmentPeriod && installmentPeriod > 0 && 
          installmentAmount && installmentAmount > 0) {
        console.log("Installment fields valid, showing national pension step");
        setShowNationalPensionStep(true);
        setStep(4);
      } else {
        setShowNationalPensionStep(false);
      }
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      // Save to localStorage
      const formValues = form.getValues();
      if (Object.keys(formValues).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
      }
      
      // Check step completion
      if (['dateOfBirth', 'gender', 'workExperienceYears', 'workExperienceMonths', 'retirementDate'].includes(name || '')) {
        checkBasicInfoComplete();
      }
      
      if (['additionalPensionFunds', 'pensionFunder'].includes(name || '')) {
        checkPensionFundComplete();
      }
      
      if (['selectedOption', 'periodYears', 'installmentPeriod', 'installmentAmount'].includes(name || '')) {
        checkOptionFieldsComplete();
      }

      if (['paymentOption'].includes(name || '')) {
        // When payment option changes for small funds, calculate and show result
        if (form.watch('additionalPensionFunds') <= 10000 && form.watch('paymentOption')) {
          const inputData: RetirementInputs = {
            dateOfBirth: form.getValues('dateOfBirth'),
            gender: form.getValues('gender'),
            workExperienceYears: form.getValues('workExperienceYears'),
            workExperienceMonths: form.getValues('workExperienceMonths'),
            retirementDate: form.getValues('retirementDate'),
            additionalPensionFunds: form.getValues('additionalPensionFunds'),
            pensionFunder: form.getValues('pensionFunder'),
            nationalPensionFunds: 0, // Not used for small funds
            paymentOption: form.getValues('paymentOption')
          };
          
          const result = calculateRetirement(inputData);
          setCalculationResult(result);
          
          setTimeout(() => {
            const resultElement = document.getElementById('calculation-result');
            if (resultElement) {
              resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      }
    });
    
    // Initial check
    checkBasicInfoComplete();
    checkPensionFundComplete();
    checkOptionFieldsComplete();
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Force re-check when additionalPensionFunds changes
  useEffect(() => {
    const additionalFunds = form.watch('additionalPensionFunds') || 0;
    const pensionFunder = form.watch('pensionFunder');
    
    // Update small fund options visibility
    setShowSmallFundOptions(additionalFunds <= 10000 && additionalFunds > 0);
    
    if (additionalFunds > 10000 && pensionFunder) {
      console.log("Additional funds changed and > 10000:", additionalFunds);
      setShowOptionDropdown(true);
      setShowSmallFundOptions(false);
      if (step === 2) {
        setStep(3);
      }
    } else if (additionalFunds <= 10000 && additionalFunds > 0 && pensionFunder) {
      // If funds <= 10000, hide large fund options and show small fund options
      console.log("Additional funds <= 10000, showing small fund options:", additionalFunds);
      setShowOptionDropdown(false);
      setShowSmallFundOptions(true);
      setShowNationalPensionStep(false); // Don't show national pension for small funds
      if (step > 2) {
        setStep(2);
      }
    }
  }, [form.watch('additionalPensionFunds'), form.watch('pensionFunder')]);

  // Watch for changes to selectedOption and its dependent fields
  useEffect(() => {
    const selectedOption = form.watch('selectedOption');
    const additionalFunds = form.watch('additionalPensionFunds') || 0;
    
    // Don't show national pension step for Option 1 or small funds
    if (additionalFunds <= 10000 || selectedOption === 'option1') {
      console.log("Small funds or Option 1 selected, not showing national pension step");
      setShowNationalPensionStep(false);
      return;
    }
    
    checkOptionFieldsComplete();
  }, [
    form.watch('selectedOption'), 
    form.watch('periodYears'), 
    form.watch('installmentPeriod'), 
    form.watch('installmentAmount')
  ]);

  const onSubmit = (data: FormValues) => {
    const inputData: RetirementInputs = {
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      workExperienceYears: data.workExperienceYears,
      workExperienceMonths: data.workExperienceMonths,
      retirementDate: data.retirementDate,
      additionalPensionFunds: data.additionalPensionFunds,
      pensionFunder: data.pensionFunder,
      nationalPensionFunds: data.nationalPensionFunds,
      paymentOption: data.paymentOption
    };
    
    const result = calculateRetirement(inputData);
    setCalculationResult(result);
    
    setTimeout(() => {
      const resultElement = document.getElementById('calculation-result');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-sm">
                            Вашата дата на раждане се използва за изчисляване на текущата възраст и допустимост за пенсиониране.
                          </p>
                        </TooltipContent>
                      </Tooltip>
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
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "dd.MM.yyyy", { locale: bg })
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-sm">
                            Полът е от значение, тъй като пенсионната възраст може да се различава при мъжете и жените.
                          </p>
                        </TooltipContent>
                      </Tooltip>
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
                            <Label htmlFor="male" className="font-normal cursor-pointer">Мъж</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female" className="font-normal cursor-pointer">Жена</Label>
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-sm">
                            Общият ви трудов стаж в години влияе на допустимостта и размера на пенсията.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Controller
                      control={form.control}
                      name="workExperienceYears"
                      render={({ field }) => (
                        <Input
                          id="workExperienceYears"
                          type="number"
                          min={0}
                          max={80}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                      <Label htmlFor="workExperienceMonths">Стаж (месеци)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-sm">
                            Допълнителни месеци трудов стаж.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Controller
                      control={form.control}
                      name="workExperienceMonths"
                      render={({ field }) => (
                        <Input
                          id="workExperienceMonths"
                          type="number"
                          min={0}
                          max={11}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                      <Label htmlFor="retirementDate">Дата на пенсиониране</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-sm">
                            Датата, на която планирате да се пенсионирате.
                          </p>
                        </TooltipContent>
                      </Tooltip>
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
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "dd.MM.yyyy", { locale: bg })
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
                              fromDate={TODAY}
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
                  </div>
                </div>

                {/* Eligibility Message */}
                <AnimatePresence>
                  {(calculatedAge !== null && isRetirementEligible !== null) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert variant={isRetirementEligible ? "default" : "destructive"} className={cn(
                        "mt-4 flex items-center",
                        isRetirementEligible ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200" 
                      )}>
                        {isRetirementEligible ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mr-2 shrink-0" />
                        )}
                        <AlertDescription className="text-sm">
                          {isRetirementEligible
                            ? `Отговаряте на условията за пенсиониране. Възрастта ви при пенсиониране ще бъде ${calculatedAge} години.`
                            : `Не отговаряте на условията за пенсиониране. Възрастта ви при пенсиониране ще бъде ${calculatedAge} години.`
                          }
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
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <Separator />
                    <h3 className="text-lg font-medium">Допълнителни пенсионни данни</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="additionalPensionFunds">Допълнителни пенсионни фондове (лв.)</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-sm">
                                Общата сума, натрупана в допълнителните ви пенсионни фондове в лева.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Controller
                          control={form.control}
                          name="additionalPensionFunds"
                          render={({ field }) => (
                            <Input
                              id="additionalPensionFunds"
                              type="number"
                              min={0}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                field.onChange(value);
                                // Debug
                                console.log("Input changed to:", value);
                              }}
                              value={field.value === 0 ? "" : field.value}
                              placeholder="Въведете сума"
                            />
                          )}
                        />
                        {form.formState.errors.additionalPensionFunds && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.additionalPensionFunds.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="pensionFunder">Пенсионен фонд</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-sm">
                                Компанията, управляваща допълнителните ви пенсионни фондове.
                              </p>
                            </TooltipContent>
                          </Tooltip>
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
                                {pensionFunders.map((funder) => (
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

                    {/* Small Fund Options - Only visible when funds <= 10000 */}
                    <AnimatePresence>
                      {showSmallFundOptions && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="paymentOption">Опции за плащане</Label>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-[200px] text-sm">
                                    Изберете опция за плащане за малки суми (под 10,000 лв).
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Controller
                              control={form.control}
                              name="paymentOption"
                              render={({ field }) => (
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    // Auto-calculate immediately when payment option changes for small funds
                                    if (form.watch('additionalPensionFunds') <= 10000) {
                                      const inputData: RetirementInputs = {
                                        dateOfBirth: form.getValues('dateOfBirth'),
                                        gender: form.getValues('gender'),
                                        workExperienceYears: form.getValues('workExperienceYears'),
                                        workExperienceMonths: form.getValues('workExperienceMonths'),
                                        retirementDate: form.getValues('retirementDate'),
                                        additionalPensionFunds: form.getValues('additionalPensionFunds'),
                                        pensionFunder: form.getValues('pensionFunder'),
                                        nationalPensionFunds: 0, // Not used for small funds
                                        paymentOption: value
                                      };
                                      
                                      const result = calculateRetirement(inputData);
                                      setCalculationResult(result);
                                    }
                                  }}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Изберете опция за плащане" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {paymentOptions.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 3: Options (shown only if additionalPensionFunds > 10000) */}
              <AnimatePresence>
                {step >= 3 && showOptionDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <Separator />
                    <h3 className="text-lg font-medium">Опции за изплащане</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="selectedOption">Изберете опция</Label>
                        <Controller
                          control={form.control}
                          name="selectedOption"
                          render={({ field }) => (
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                // Force check after option selection
                                setTimeout(() => checkOptionFieldsComplete(), 0);
                              }}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Изберете опция" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="option1">Опция 1</SelectItem>
                                <SelectItem value="option2">Опция 2</SelectItem>
                                <SelectItem value="option3">Опция 3</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      {/* Option 2 fields */}
                      <AnimatePresence>
                        {form.watch('selectedOption') === 'option2' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2"
                          >
                            <Label htmlFor="periodYears">Период (години)</Label>
                            <Controller
                              control={form.control}
                              name="periodYears"
                              render={({ field }) => (
                                <Input
                                  id="periodYears"
                                  type="number"
                                  min={1}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    field.onChange(value);
                                    // Force check after value change
                                    setTimeout(() => checkOptionFieldsComplete(), 0);
                                  }}
                                  value={field.value === 0 || !field.value ? "" : field.value}
                                  placeholder="Въведете период в години"
                                />
                              )}
                            />
                            {form.formState.errors.periodYears && (
                              <p className="text-sm text-destructive">
                                {form.formState.errors.periodYears.message}
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Option 3 fields */}
                      <AnimatePresence>
                        {form.watch('selectedOption') === 'option3' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="installmentPeriod">Период на разсрочване</Label>
                              <Controller
                                control={form.control}
                                name="installmentPeriod"
                                render={({ field }) => (
                                  <Input
                                    id="installmentPeriod"
                                    type="number"
                                    min={1}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value) || 0;
                                      field.onChange(value);
                                      // Force check after value change
                                      setTimeout(() => checkOptionFieldsComplete(), 0);
                                    }}
                                    value={field.value === 0 || !field.value ? "" : field.value}
                                    placeholder="Въведете период"
                                  />
                                )}
                              />
                              {form.formState.errors.installmentPeriod && (
                                <p className="text-sm text-destructive">
                                  {form.formState.errors.installmentPeriod.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="installmentAmount">Сума</Label>
                              <Controller
                                control={form.control}
                                name="installmentAmount"
                                render={({ field }) => (
                                  <Input
                                    id="installmentAmount"
                                    type="number"
                                    min={1}
                                    onChange={(e) => {
                                      const value = parseFloat(e.target.value) || 0;
                                      field.onChange(value);
                                      // Force check after value change
                                      setTimeout(() => checkOptionFieldsComplete(), 0);
                                    }}
                                    value={field.value === 0 || !field.value ? "" : field.value}
                                    placeholder="Въведете сума"
                                  />
                                )}
                              />
                              {form.formState.errors.installmentAmount && (
                                <p className="text-sm text-destructive">
                                  {form.formState.errors.installmentAmount.message}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* National Pension Funds - Only shown for Options 2 & 3 with completed fields */}
              <AnimatePresence>
                {showNationalPensionStep && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <Separator />
                    <h3 className="text-lg font-medium">Национални пенсионни данни</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="nationalPensionFunds">Национални пенсионни фондове (лв.)</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-sm">
                              Сумата, която сте натрупали в националната пенсионна система в лева.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Controller
                        control={form.control}
                        name="nationalPensionFunds"
                        render={({ field }) => (
                          <Input
                            id="nationalPensionFunds"
                            type="number"
                            min={0}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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

                    <div className="flex justify-center pt-2">
                      <Button 
                        type="submit" 
                        size="lg"
                        className="rounded-full px-8 bg-primary hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
                      >
                        Изчисли пенсионните фондове
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </CardContent>
        </Card>
      </motion.div>

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
