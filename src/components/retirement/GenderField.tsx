
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FormSection from './FormSection';

interface GenderFieldProps {
  control: Control<any>;
  errors: FieldErrors;
}

export default function GenderField({ control, errors }: GenderFieldProps) {
  return (
    <FormSection title="Пол">
      <Controller
        control={control}
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
      {errors.gender && (
        <p className="text-sm text-destructive">
          {errors.gender.message as string}
        </p>
      )}
    </FormSection>
  );
}
