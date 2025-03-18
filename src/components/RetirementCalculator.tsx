
import { useState } from 'react';
import { format } from 'date-fns';
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
import { calculateRetirement, pensionFunders } from '@/utils/calculatorUtils';
import CalculationResult from './CalculationResult';

const formSchema = z.object({
  dateOfBirth: z.date({
    required_error: 'Please select your date of birth.',
  }),
  sex: z.enum(['male', 'female'], {
    required_error: 'Please select your gender.',
  }),
  workExperienceYears: z.number()
    .int()
    .min(0, 'Years must be 0 or greater')
    .max(80, 'Years must be 80 or less'),
  workExperienceMonths: z.number()
    .int()
    .min(0, 'Months must be 0 or greater')
    .max(11, 'Months must be 11 or less'),
  retirementDate: z.date({
    required_error: 'Please select your retirement date.',
  }),
  additionalPensionFunds: z.number()
    .min(0, 'Amount must be 0 or greater'),
  pensionFunder: z.string({
    required_error: 'Please select a pension funder.',
  }),
  nationalPensionFunds: z.number()
    .min(0, 'Amount must be 0 or greater'),
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
    const result = calculateRetirement(data);
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
                  <div className="flex items-center gap-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-sm">
                          Your date of birth is used to calculate your current age and retirement eligibility.
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
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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

                {/* Sex */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Sex</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-sm">
                          Sex is relevant as retirement ages can differ for males and females.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Controller
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {form.formState.errors.sex && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.sex.message}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Work Experience */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label>Work Experience</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-sm">
                          Your total work experience in years and months affects your pension eligibility and amount.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workExperienceYears">Years</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor="workExperienceMonths">Months</Label>
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
                  </div>
                </div>

                {/* Retirement Date */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="retirementDate">Retirement Date</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-sm">
                          The date when you plan to retire or your official retirement age anniversary.
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
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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
                    <Label htmlFor="additionalPensionFunds">Additional Pension Funds (BGN)</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-sm">
                          The total amount accumulated in your additional pension funds in BGN.
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
                    <Label htmlFor="pensionFunder">Pension Funder</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-sm">
                          The company managing your additional pension funds.
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
                          <SelectValue placeholder="Select a pension funder" />
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
                  <Label htmlFor="nationalPensionFunds">National Pension Funds (BGN)</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-sm">
                        The amount you've accumulated in the national pension system in BGN.
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
                  Calculate Retirement Funds
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
