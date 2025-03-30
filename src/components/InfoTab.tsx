
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, Users, Info, ArrowRight } from "lucide-react";

export default function InfoTab({ onGoToCalculator }: { onGoToCalculator: () => void }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col items-center text-center space-y-6 py-8 mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Планирайте вашето финансово бъдеще</h1>
        <p className="text-xl max-w-2xl text-muted-foreground">
          Нашият пенсионен калкулатор ви помага да вземете информирани решения за вашето финансово бъдеще с лесни за използване инструменти и персонализирани изчисления.
        </p>
        <Button 
          onClick={onGoToCalculator} 
          size="lg" 
          className="rounded-full px-8 bg-primary hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg mt-4 gap-2"
        >
          Към калкулатора <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-primary/10 shadow-sm bg-secondary/30">
          <CardHeader className="pb-2">
            <Calculator className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-xl font-medium text-primary">Лесни изчисления</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Изчислете вашия очакван пенсионен доход с няколко прости стъпки, използвайки актуални данни и формули.
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/10 shadow-sm bg-secondary/30">
          <CardHeader className="pb-2">
            <TrendingUp className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-xl font-medium text-primary">Сравнете опциите</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Разберете как допълнителните пенсионни фондове могат да увеличат значително вашия пенсионен доход с времето.
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/10 shadow-sm bg-secondary/30">
          <CardHeader className="pb-2">
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-xl font-medium text-primary">Персонализиран подход</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Получете персонализирани резултати въз основа на вашата възраст, пол, трудов стаж и натрупани средства.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/10 shadow-sm green-card">
        <CardHeader className="bg-primary/10 border-b border-primary/10 flex flex-row items-center gap-4">
          <Info className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-2xl font-medium text-primary">За пенсионното планиране</CardTitle>
            <CardDescription>Научете повече за планирането на вашето пенсиониране</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">Разбиране на пенсионните фондове</h3>
            <p className="text-muted-foreground leading-relaxed">
              Пенсионните фондове са създадени, за да осигурят финансова сигурност по време на пенсиониране. В България пенсионната система се състои от три стълба: държавна пенсия, задължително допълнително пенсионно осигуряване и доброволно допълнително пенсионно осигуряване.
            </p>
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">Как работи нашият калкулатор</h3>
            <p className="text-muted-foreground leading-relaxed">
              Нашият пенсионен калкулатор изчислява вашата бъдеща пенсия въз основа на текущата ви възраст, трудов стаж и пенсионни вноски. Калкулаторът показва два сценария: със и без допълнителни пенсионни фондове, подчертавайки потенциалните ползи от допълнителните спестявания.
            </p>
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">Пенсионна възраст в България</h3>
            <p className="text-muted-foreground leading-relaxed">
              Пенсионната възраст в България постепенно се увеличава. Към 2023 г. стандартната пенсионна възраст за мъжете е 64 години и 6 месеца, докато за жените е 62 години. До 2037 г. пенсионната възраст и за двата пола ще бъде 65 години.
            </p>
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">Допълнителни пенсионни фондове</h3>
            <p className="text-muted-foreground leading-relaxed">
              Инвестирането в допълнителни пенсионни фондове може значително да увеличи вашия пенсионен доход. Тези фондове се управляват от частни пенсионни компании и предлагат различни инвестиционни опции в зависимост от вашата толерантност към риска и финансовите ви цели.
            </p>
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">Планиране за бъдещето</h3>
            <p className="text-muted-foreground leading-relaxed">
              Никога не е твърде рано да започнете да планирате пенсионирането си. Редовните вноски в пенсионни фондове, дори малки суми, могат да нараснат значително с течение на времето поради сложната лихва. Нашият калкулатор може да ви помогне да разберете дългосрочното въздействие на вашата текуща стратегия за спестяване.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
