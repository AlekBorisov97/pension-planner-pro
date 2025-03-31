
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import FormSection from './FormSection';

interface BirthDateFieldProps {
  control: Control<any>;
  errors: FieldErrors;
  defaultBirthDate: Date;
  fromDate: Date;
  toDate: Date;
}

export default function BirthDateField({ 
  control, 
  errors, 
  defaultBirthDate,
  fromDate,
  toDate
}: BirthDateFieldProps) {
  return (
    <FormSection title="Дата на раждане">
      <Controller
        control={control}
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
                defaultMonth={defaultBirthDate}
                fromDate={fromDate}
                toDate={toDate}
                initialFocus
                className="rounded-md border p-3 pointer-events-auto"
                locale={bg}
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {errors.dateOfBirth && (
        <p className="text-sm text-destructive">
          {errors.dateOfBirth.message as string}
        </p>
      )}
    </FormSection>
  );
}
