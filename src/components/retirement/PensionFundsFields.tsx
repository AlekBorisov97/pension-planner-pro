
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pensionFunders } from '@/utils/calculatorUtils';
import FormSection from './FormSection';

interface PensionFundsFieldsProps {
  control: Control<any>;
  errors: FieldErrors;
}

export default function PensionFundsFields({ control, errors }: PensionFundsFieldsProps) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <FormSection title="Допълнителни пенсионни фондове (лв.)" separator={false}>
          <Controller
            control={control}
            name="additionalPensionFunds"
            render={({ field }) => (
              <Input
                id="additionalPensionFunds"
                type="number"
                min={0}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                value={field.value === 0 ? "" : field.value}
                placeholder="Въведете сума"
              />
            )}
          />
          {errors.additionalPensionFunds && (
            <p className="text-sm text-destructive">
              {errors.additionalPensionFunds.message as string}
            </p>
          )}
        </FormSection>

        <FormSection title="Пенсионен фонд" separator={false}>
          <Controller
            control={control}
            name="pensionFunder"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
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
          {errors.pensionFunder && (
            <p className="text-sm text-destructive">
              {errors.pensionFunder.message as string}
            </p>
          )}
        </FormSection>
      </div>

      <FormSection title="Национални пенсионни фондове (лв.)" separator={false}>
        <Controller
          control={control}
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
        {errors.nationalPensionFunds && (
          <p className="text-sm text-destructive">
            {errors.nationalPensionFunds.message as string}
          </p>
        )}
      </FormSection>
    </>
  );
}
