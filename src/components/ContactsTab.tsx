import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";

export default function ContactsTab() {
  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">Contact Us</CardTitle>
          <CardDescription>Reach out to our pension advisors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Phone Support</h3>
                  <p className="text-muted-foreground">+359 2 123 4567</p>
                  <p className="text-sm text-muted-foreground">
                    Monday to Friday, 9:00 - 17:00
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">
                    support@retirementplanner.bg
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We usually respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Office Location</h3>
                  <p className="text-muted-foreground">15 Vitosha Boulevard</p>
                  <p className="text-muted-foreground">Sofia 1000, Bulgaria</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Working Hours</h3>
                  <p className="text-muted-foreground">
                    Monday to Friday: 9:00 - 17:00
                  </p>
                  <p className="text-muted-foreground">
                    Saturday and Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden border border-border h-[200px] relative">
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    Interactive map would appear here
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Pension Fund Partners</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    asChild
                  >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Rodina Pension Fund
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    asChild
                  >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      DSK Pension Fund
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    asChild
                  >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Unicredit Pension Fund
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
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
