import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, Users, Info, ArrowRight } from "lucide-react";

export default function InfoTab({
  onGoToCalculator,
  onGoToContacts,
}: {
  onGoToCalculator: () => void;
  onGoToContacts: () => void;
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col items-center text-center space-y-6 py-8 mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Направете избор за Вашата пенсия
        </h1>
        <p className="text-xl max-w-2xl text-muted-foreground">
          С помощта на нашия пенсионен калкулатор, сравнете дали във Вашия
          случай е по-благоприятно да изберете две пенсии – държавна пенсия в
          намален размер плюс втора пенсия от частен пенсионен фонд или само
          една пенсия – държавна пенсия в пълен размер от НОИ.
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
            <CardTitle className="text-xl font-medium text-primary">
              Държавна пенсия
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Можете да проверите какъв е размерът на Вашата държавна пенсия на
              сайта на НОИ{" "}
              <a
                href="https://reps.nssi.bg/PensionsCalc/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary hover:opacity-80 font-semibold"
              >
                тук
              </a>{" "}
              (изисква се ПИК на НОИ).
            </p>
            <p className="text-muted-foreground">
              Ако нямате издаден ПИК на НОИ, можете да заявите такъв{" "}
              <a
                href="https://reps.nssi.bg/epik/(S(zwcxdghyeyshsigi3yvfqkrz))/NSSIePIK.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary hover:opacity-80 font-semibold"
              >
                тук.
              </a>
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/10 shadow-sm bg-secondary/30">
          <CardHeader className="pb-2">
            <TrendingUp className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-xl font-medium text-primary">
              Втора пенсия
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Можете да проверите какъв е размерът на Вашата втора пенсия с
              помощта на нашия калкулатор или на сайта на Вашия УПФ{" "}
              <span
                onClick={onGoToContacts}
                className="underline cursor-pointer text-primary hover:opacity-80 font-semibold"
              >
                тук
              </span>
              .
            </p>
            <p className="text-muted-foreground">
              Ако не знаете кой е вашият настоящ УПФ, можете да направите
              проверка{" "}
              <a
                href="https://portal.nra.bg/details/report-dzpo"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary hover:opacity-80 font-semibold"
              >
                тук.
              </a>
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/10 shadow-sm bg-secondary/30">
          <CardHeader className="pb-2">
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-xl font-medium text-primary">
              Две пенсии повече от една ли са?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Можете да направите сравнение дали във Вашия случай е
              по-благоприятно да получавате две пенсии – пенсия от НОИ в намален
              размер плюс втора пенсия от УПФ или само една пенсия от НОИ в
              пълен размер{" "}
              <span
                onClick={onGoToCalculator}
                className="underline cursor-pointer text-primary hover:opacity-80 font-semibold"
              >
                тук
              </span>{" "}
              .
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/10 shadow-sm green-card">
        <CardHeader className="bg-primary/10 border-b border-primary/10 flex flex-row items-center gap-4">
          <Info className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-2xl font-medium text-primary">
              Как да се пенсионираме?
            </CardTitle>
            <CardDescription>
              Планирайте навреме и внимателно Вашето пенсиониране.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">Къде?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Задължителното осигуряване за пенсия, за което на всеки, роден
              след 1959 г., работещ по договор при трета категория труд се
              удържат осигуровки от НАП, е два вида:
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed">
                <li className="ml-2 pl-6">
                  Държавно обществено осигуряване (ДОО), което се извършва от
                  Националния осигурителен институт (НОИ);
                </li>
                <li className="ml-2 pl-6">
                  Допълнително задължително пенсионно осигуряване (ДЗПО), което
                  се извършва чрез частни универсални пенсионни фондове (УПФ).
                  <br />
                  Ако не сте сигурни в кой УПФ се осигурявате, можете да
                  направите проверка на сайта на НАП{" "}
                  <a
                    href="https://nra.bg/wps/portal/nra/nachalo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-primary hover:opacity-80  font-semibold"
                  >
                    тук
                  </a>{" "}
                  (изисква се ПИК на НАП), или да потърсите последното
                  извлечение от Вашата пенсионна партида, което УПФ е длъжен да
                  Ви праща ежегодно по пощата (или мейл);
                </li>
              </ul>
            </p>
          </div>

          <Separator className="bg-primary/10" />

          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">Кога?</h3>
            <p className="text-muted-foreground leading-relaxed">
              За да добие човек в България право на пенсия от НОИ обичайно са
              необходими две неща:
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed mt-2">
                <li className="ml-2 pl-6">
                  Да е навършил възраст за пенсиониране.
                </li>
                <li className="ml-2 pl-6">
                  Да има определения от закона осигурителен стаж.
                </li>
              </ul>
              <p>
                {" "}
                С помощта на нашия калкулатор можете да проверите дали сте
                навършили възрастта за пенсиониране и дали имате изискуемия от
                закона осигурителен стаж за пенсия от НОИ.{" "}
              </p>
              <p>
                {" "}
                За да добие човек право на пенсия от УПФ е достатъчно само да е
                навършил възрастта за пенсиониране.
              </p>
            </p>
          </div>

          <Separator className="bg-primary/10" />

          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">Какво?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Как се определя каква пенсия ще получите, когато дойде време за
              пенсиониране:
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed">
                <li className="ml-2 pl-6">
                  Ако се осигурявате и за държавна пенсия в НОИ и за втора
                  пенсия в УПФ, след пенсиониране ще получавате държавна пенсия
                  „в намален размер“ от НОИ плюс втора пенсия, изчислена от УПФ;
                </li>
                <li className="ml-2 pl-6">
                  Законът, обаче, Ви дава право, ако пожелаете, да се откажете
                  от осигуряването за втора пенсия в УПФ и да прехвърлите изцяло
                  осигуряването си за пенсия в НОИ. (Ако след време размислите,
                  имате право да върнете осигуровките си от НОИ обратно в някой
                  УПФ);
                </li>
                <li className="ml-2 pl-6">
                  Ако сте прехвърлили осигуряването си за пенсия изцяло към НОИ,
                  ще получавате само една пенсия – от НОИ – „в пълен размер“;
                </li>
              </ul>
            </p>
          </div>

          <Separator className="bg-primary/10" />

          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">Колко?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Колко голям ще бъде размерът на Вашата пенсия зависи от няколко
              неща:
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed">
                <li className="ml-2 pl-6">
                  Държавната пенсия зависи от натрупания от Вас осигурителен
                  стаж, средния осигурителен доход, изчислен от НОИ, процентът
                  за всяка година стаж за определяне на пенсията и намеление,
                  пропорционално на месеците осигуряване за втора пенсия в УПФ.;
                </li>
                <li className="ml-2 pl-6">
                  Втората пенсия зависи от възрастта Ви към момента на
                  пенсиониране, брутния размер на осигурителните вноски,
                  преведени за Вас в УПФ, доходността, която е постигнал фондът
                  при инвестиране на Вашите спестявания и техническия лихвен
                  процент.
                </li>
              </ul>
              Важно е да се знае, че първоначално определения размер на
              пенсията, както държавната, така и втората, може да се променя
              ежегодно след това.
            </p>
          </div>

          <Separator className="bg-primary/10" />

          <div>
            <h3 className="text-lg font-medium mb-2 text-primary/90">
              Изберете
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Така се стига до въпроса дали „Две пенсии са повече от една?“ и
              отговорът е, зависи:
              <ul className="list-disc list-inside text-muted-foreground leading-relaxed">
                <li className="ml-2 pl-6">
                  Ако частният УПФ Ви предлага втора пенсия, която е по-голяма
                  от намалението на държавната пенсия от НОИ, тогава двете
                  пенсии са повече от една;
                </li>
                <li className="ml-2 pl-6">
                  Ако частният УПФ Ви предлага втора пенсия, която е по-малка от
                  намалението на държавната пенсия от НОИ, тогава двете пенсии
                  са по-малко от една;
                </li>
              </ul>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
