
import { useState } from 'react';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, HelpCircle } from 'lucide-react';

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
import { cn } from '@/lib/utils';
import { calculateRetirement, pensionFunders, RetirementInputs } from '@/utils/calculatorUtils';
import CalculationResult from './CalculationResult';

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
  nationalPensionFunds: z.number()
    .min(0, 'Сумата трябва да е 0 или повече'),
});

type FormValues = z.infer<typeof formSchema>;

export default function RetirementCalculator() {
  const [calculationResult, setCalculationResult] = useState<ReturnType<typeof calculateRetirement> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workExperienceYears: 0,
      workExperienceMonths: 0,
      additionalPensionFunds: 0,
      nationalPensionFunds: 0,
    },
  });

  const onSubmit = (data: FormValues) => {
    // Ensure all required properties are present by casting the data to RetirementInputs
    const inputData: RetirementInputs = {
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      workExperienceYears: data.workExperienceYears,
      workExperienceMonths: data.workExperienceMonths,
      retirementDate: data.retirementDate,
      additionalPensionFunds: data.additionalPensionFunds,
      pensionFunder: data.pensionFunder,
      nationalPensionFunds: data.nationalPensionFunds
    };
    
    const result = calculateRetirement(inputData);
    setCalculationResult(result);
    
    // Scroll to result with smooth animation
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
              <div className="grid gap-6 md:grid-cols-2">
                {/* Date of Birth */}
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
                            disabled={(date) =>
                              date > new Date() || date < new Date("1930-01-01")
                            }
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

                {/* Gender */}
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
                        defaultValue={field.value}
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

              <Separator />

              {/* Work Experience and Retirement Date */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Work Experience Years */}
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
                        value={field.value}
                      />
                    )}
                  />
                  {form.formState.errors.workExperienceYears && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.workExperienceYears.message}
                    </p>
                  )}
                </div>

                {/* Work Experience Months */}
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
                        value={field.value}
                      />
                    )}
                  />
                  {form.formState.errors.workExperienceMonths && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.workExperienceMonths.message}
                    </p>
                  )}
                </div>

                {/* Retirement Date */}
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
                            disabled={(date) =>
                              date < new Date()
                            }
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

              <Separator />

              {/* Pension Funds */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Additional Pension Funds */}
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
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value}
                      />
                    )}
                  />
                  {form.formState.errors.additionalPensionFunds && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.additionalPensionFunds.message}
                    </p>
                  )}
                </div>

                {/* Pension Funder */}
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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

              {/* National Pension Funds */}
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
                      value={field.value}
                    />
                  )}
                />
                {form.formState.errors.nationalPensionFunds && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.nationalPensionFunds.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-2">
                <Button 
                  type="submit" 
                  size="lg"
                  className="rounded-full px-8 bg-primary hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
                >
                  Изчисли пенсионните фондове
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Section */}
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
