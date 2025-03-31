
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { calculateRetirement, RetirementInputs } from '@/utils/calculatorUtils';
import BirthDateField from './BirthDateField';
import GenderField from './GenderField';
import WorkExperienceFields from './WorkExperienceFields';
import PensionFundsFields from './PensionFundsFields';

const STORAGE_KEY = 'retirement-calculator-form-data';
const DEFAULT_BIRTH_DATE = new Date('1960-01-01');

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

interface RetirementFormProps {
  onCalculate: (result: ReturnType<typeof calculateRetirement>) => void;
}

export default function RetirementForm({ onCalculate }: RetirementFormProps) {
  const currentDate = new Date();
  const minRetirementDate = new Date('2016-01-01');
  const birthDateFromYear = new Date('1930-01-01');
  const birthDateToYear = new Date();

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
      retirementDate: savedData.retirementDate || undefined,
      additionalPensionFunds: savedData.additionalPensionFunds || 0,
      nationalPensionFunds: savedData.nationalPensionFunds || 0,
      pensionFunder: savedData.pensionFunder || undefined,
    },
  });

  // Save form data to localStorage when it changes
  useEffect(() => {
    const subscription = form.watch((formValues) => {
      if (Object.keys(formValues).length === 0) return;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = (data: FormValues) => {
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
    onCalculate(result);
    
    setTimeout(() => {
      const resultElement = document.getElementById('calculation-result');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <motion.div className="form-appear">
      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <BirthDateField 
                control={form.control} 
                errors={form.formState.errors}
                defaultBirthDate={DEFAULT_BIRTH_DATE}
                fromDate={birthDateFromYear}
                toDate={birthDateToYear}
              />
              <GenderField 
                control={form.control} 
                errors={form.formState.errors} 
              />
            </div>

            <Separator />

            <WorkExperienceFields 
              control={form.control} 
              errors={form.formState.errors} 
            />

            <Separator />

            <PensionFundsFields 
              control={form.control} 
              errors={form.formState.errors} 
            />

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
  );
}
