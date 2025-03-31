
import { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface FormSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
  separator?: boolean;
}

export default function FormSection({ 
  title, 
  children, 
  className = "",
  separator = true 
}: FormSectionProps) {
  return (
    <>
      {title && (
        <div className="flex items-center gap-2 h-6 mb-2">
          <Label>{title}</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-[200px] text-sm">{title}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      <div className={className}>
        {children}
      </div>
      {separator && <Separator className="my-6" />}
    </>
  );
}
