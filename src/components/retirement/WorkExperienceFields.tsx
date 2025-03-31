
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import FormSection from './FormSection';

interface WorkExperienceFieldsProps {
  control: Control<any>;
  errors: FieldErrors;
}

export default function WorkExperienceFields({ control, errors }: WorkExperienceFieldsProps) {
  const currentDate = new Date();
  const minRetirementDate = new Date('2016-01-01');

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <FormSection title="Стаж (години)" separator={false}>
        <Controller
          control={control}
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
        {errors.workExperienceYears && (
          <p className="text-sm text-destructive">
            {errors.workExperienceYears.message as string}
          </p>
        )}
      </FormSection>

      <FormSection title="Стаж (месеци)" separator={false}>
        <Controller
          control={control}
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
        {errors.workExperienceMonths && (
          <p className="text-sm text-destructive">
            {errors.workExperienceMonths.message as string}
          </p>
        )}
      </FormSection>

      <FormSection title="Дата на пенсиониране" separator={false}>
        <Controller
          control={control}
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
                  defaultMonth={minRetirementDate}
                  fromDate={minRetirementDate}
                  toDate={currentDate}
                  initialFocus
                  className="rounded-md border p-3 pointer-events-auto"
                  locale={bg}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.retirementDate && (
          <p className="text-sm text-destructive">
            {errors.retirementDate.message as string}
          </p>
        )}
      </FormSection>
    </div>
  );
}
