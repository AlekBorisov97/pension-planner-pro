
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  Building,
  FileText,
  Shield,
  Key,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ContactsTab() {
  const governmentInstitutions = [
    {
      title: "Пенсионен калкулатор НОИ",
      description: "Изисква се ПИК на НОИ",
      icon: FileText,
    },
    {
      title: "Издаване на ПИК на НОИ през Евротръст",
      description: "",
      icon: Key,
    },
    {
      title: "Издаване ПИК на НОИ през ССЕВ + КЕП",
      description: "",
      icon: Key,
    },
    {
      title: "НАП Справка партида ДЗПО",
      description: "Изисква се ПИК на НАП",
      icon: FileText,
    },
  ];

  const pensionCompanies = [
    { name: "ПОК Доверие", icon: Building },
    { name: "ПОК ДСК-Родина", icon: Building },
    { name: "ПОД Алианц България", icon: Building },
    { name: "ОББ Пенсионно осигуряване", icon: Building },
    { name: "ПОК Съгласие", icon: Building },
    { name: "ПОАД ЦКБ-Сила", icon: Building },
    { name: "ПОД Бъдеще АД", icon: Building },
    { name: "ПОД Топлина", icon: Building },
    { name: "Пенсионноосигурителен институт АД", icon: Building },
    { name: "ПОД ДаллБогг: Живот и Здраве ЕАД", icon: Building },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="border border-border/50 shadow-sm bg-gradient-to-br from-background to-secondary/10">
        <CardHeader>
          <CardTitle className="text-2xl font-medium text-primary">Полезни контакти</CardTitle>
          <CardDescription>Връзки към пенсионни дружества и държавни институции</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="institutions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="institutions">Държавни институции</TabsTrigger>
              <TabsTrigger value="companies">Пенсионни компании</TabsTrigger>
            </TabsList>
            
            <TabsContent value="institutions" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {governmentInstitutions.map((institution, i) => (
                  <Card key={i} className="overflow-hidden border border-border/50 transition-all hover:shadow-md hover:border-primary/20">
                    <Link to="/" className="block p-4">
                      <div className="flex items-start space-x-3">
                        <institution.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <h3 className="font-medium">{institution.title}</h3>
                          {institution.description && (
                            <p className="text-sm text-muted-foreground">
                              {institution.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="companies" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {pensionCompanies.map((company, i) => (
                  <Card key={i} className="overflow-hidden border border-border/50 transition-all hover:shadow-md hover:border-primary/20 hover:bg-secondary/20">
                    <Link to="/" className="flex items-center p-4 space-x-3 h-full">
                      <Shield className="h-5 w-5 text-primary shrink-0" />
                      <span className="font-medium">{company.name}</span>
                    </Link>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">Свържете се с нас</CardTitle>
          <CardDescription>Нашите пенсионни консултанти са на разположение</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Телефон</h3>
                  <p className="text-muted-foreground">+359 2 123 4567</p>
                  <p className="text-sm text-muted-foreground">
                    Понеделник до Петък, 9:00 - 17:00
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Имейл</h3>
                  <p className="text-muted-foreground">
                    support@retirementplanner.bg
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Отговаряме в рамките на 24 часа
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Адрес</h3>
                  <p className="text-muted-foreground">бул. Витоша 15</p>
                  <p className="text-muted-foreground">София 1000, България</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Работно време</h3>
                  <p className="text-muted-foreground">
                    Понеделник до Петък: 9:00 - 17:00
                  </p>
                  <p className="text-muted-foreground">
                    Събота и Неделя: Затворено
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden border border-border h-[200px] relative">
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    Интерактивна карта
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Бърз достъп</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    asChild
                  >
                    <Link to="/">
                      <FileText className="h-4 w-4 mr-2" />
                      Калкулатор
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    asChild
                  >
                    <Link to="/">
                      <FileText className="h-4 w-4 mr-2" />
                      Информация
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
