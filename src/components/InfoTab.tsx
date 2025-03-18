
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function InfoTab() {
  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="border-primary/10 shadow-sm green-card">
        <CardHeader className="bg-primary/10 border-b border-primary/10">
          <CardTitle className="text-2xl font-medium text-primary">About Retirement Planning</CardTitle>
          <CardDescription>Learn more about planning for your retirement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">Understanding Pension Funds</h3>
            <p className="text-muted-foreground leading-relaxed">
              Pension funds are designed to provide financial security during retirement. In Bulgaria, 
              the pension system consists of three pillars: state pension, mandatory supplementary pension, 
              and voluntary supplementary pension.
            </p>
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">How Our Calculator Works</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our retirement calculator estimates your future pension based on your current age, work 
              experience, and pension contributions. The calculator shows two scenarios: with and without 
              additional pension funds, highlighting the potential benefits of supplementary savings.
            </p>
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">Retirement Age in Bulgaria</h3>
            <p className="text-muted-foreground leading-relaxed">
              The retirement age in Bulgaria is gradually increasing. As of 2023, the standard retirement 
              age for men is 64 years and 6 months, while for women it's 62 years. By 2037, the retirement 
              age for both genders will be 65.
            </p>
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">Additional Pension Funds</h3>
            <p className="text-muted-foreground leading-relaxed">
              Investing in additional pension funds can significantly increase your retirement income. 
              These funds are managed by private pension companies and offer various investment options 
              based on your risk tolerance and financial goals.
            </p>
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">Planning for the Future</h3>
            <p className="text-muted-foreground leading-relaxed">
              It's never too early to start planning for retirement. Regular contributions to pension 
              funds, even small amounts, can grow significantly over time due to compound interest. 
              Our calculator can help you understand the long-term impact of your current savings strategy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
