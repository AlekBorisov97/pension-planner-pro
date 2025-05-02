import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Building, FileText, Shield, Key } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ContactsTab({
  defaultTabProp,
}: {
  defaultTabProp?: string;
}) {
  const governmentInstitutions = [
    {
      title: "Пенсионен калкулатор НОИ",
      description: "Изисква се ПИК на НОИ",
      icon: FileText,
      link: "https://reps.nssi.bg/PensionsCalc/",
    },
    {
      title: "Издаване на ПИК на НОИ през Евротръст",
      description: "",
      icon: Key,
      link: "https://reps.nssi.bg/epik/(S(zwcxdghyeyshsigi3yvfqkrz))/NSSIePIK.aspx",
    },
    {
      title: "Издаване ПИК на НОИ през ССЕВ + КЕП",
      description: "",
      icon: Key,
      link: "https://egov.bg/wps/portal/egov/dostavchitsi%20na%20uslugi/drugi%20administratsii,%20sazdadeni%20sas%20zakon/uslugi-1379/67?callerId=703fcb07-d000-4c86-82b1-51955c5aaa37&cP=1",
    },
    {
      title: "НАП Справка партида ДЗПО",
      description: "Изисква се ПИК на НАП",
      icon: FileText,
      link: "https://portal.nra.bg/details/report-dzpo",
    },
  ];

  const pensionCompanies = [
    {
      name: "ПОК Доверие",
      icon: Building,
      link: "https://www.poc-doverie.bg/bg",
    },
    { name: "ПОК ДСК-Родина", icon: Building, link: "https://dskrodina.bg/" },
    {
      name: "ПОД Алианц България",
      icon: Building,
      link: "https://www.allianz.bg/bg_BG/individuals/retirement-provision.html",
    },
    {
      name: "ОББ Пенсионно осигуряване",
      icon: Building,
      link: "https://ubb-pensions.bg/",
    },
    { name: "ПОК Съгласие", icon: Building, link: "https://www.saglasie.bg/" },
    {
      name: "ПОАД ЦКБ-Сила",
      icon: Building,
      link: "https://www.ccb-sila.com/",
    },
    { name: "ПОД Бъдеще АД", icon: Building, link: "https://www.budeshte.bg/" },
    {
      name: "ПОД Топлина",
      icon: Building,
      link: "https://www.pod-toplina.bg/",
    },
    {
      name: "Пенсионноосигурителен институт АД",
      icon: Building,
      link: "https://www.pensionins.com/",
    },
    {
      name: "ПОД ДаллБогг: Живот и Здраве ЕАД",
      icon: Building,
      link: "https://dallbogg.bg/",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <Card className="border border-border/50 shadow-lg bg-gradient-to-br from-background to-secondary/20 w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-primary">
            Полезни контакти
          </CardTitle>
          <CardDescription className="text-base">
            Връзки към пенсионни дружества и държавни институции
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={defaultTabProp ?? 'institutions'} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="institutions">
                Държавни институции
              </TabsTrigger>
              <TabsTrigger value="companies">Пенсионни компании</TabsTrigger>
            </TabsList>

            <TabsContent value="institutions" className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                {governmentInstitutions.map((institution) => (
                  <Card
                    key={institution.title}
                    className="overflow-hidden border border-border/50 transition-all hover:shadow-md hover:border-primary/20"
                  >
                    <a
                      href={institution.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-5"
                    >
                      <div className="flex items-start space-x-4">
                        <institution.icon className="h-6 w-6 text-primary mt-1 shrink-0" />
                        <div>
                          <h3 className="font-medium text-lg">
                            {institution.title}
                          </h3>
                          {institution.description && (
                            <p className="text-sm text-muted-foreground">
                              {institution.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </a>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="companies" className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                {pensionCompanies.map((company) => (
                  <Card
                    key={company.name}
                    className="overflow-hidden border border-border/50 transition-all hover:shadow-md hover:border-primary/20 hover:bg-secondary/20"
                  >
                    <a
                      href={company.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-5 space-x-4 h-full"
                    >
                      <Shield className="h-6 w-6 text-primary shrink-0" />
                      <span className="font-medium text-base">
                        {company.name}
                      </span>
                    </a>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
