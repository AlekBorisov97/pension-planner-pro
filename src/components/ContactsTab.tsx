
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
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <Card className="border border-border/50 shadow-lg bg-gradient-to-br from-background to-secondary/20 w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-primary">Полезни контакти</CardTitle>
          <CardDescription className="text-base">Връзки към пенсионни дружества и държавни институции</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="institutions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="institutions">Държавни институции</TabsTrigger>
              <TabsTrigger value="companies">Пенсионни компании</TabsTrigger>
            </TabsList>
            
            <TabsContent value="institutions" className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                {governmentInstitutions.map((institution, i) => (
                  <Card key={i} className="overflow-hidden border border-border/50 transition-all hover:shadow-md hover:border-primary/20">
                    <Link to="/" className="block p-5">
                      <div className="flex items-start space-x-4">
                        <institution.icon className="h-6 w-6 text-primary mt-1 shrink-0" />
                        <div>
                          <h3 className="font-medium text-lg">{institution.title}</h3>
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
            
            <TabsContent value="companies" className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                {pensionCompanies.map((company, i) => (
                  <Card key={i} className="overflow-hidden border border-border/50 transition-all hover:shadow-md hover:border-primary/20 hover:bg-secondary/20">
                    <Link to="/" className="flex items-center p-5 space-x-4 h-full">
                      <Shield className="h-6 w-6 text-primary shrink-0" />
                      <span className="font-medium text-base">{company.name}</span>
                    </Link>
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

