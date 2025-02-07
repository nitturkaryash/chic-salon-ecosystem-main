import { Card } from "@/components/ui/card";
import { Calendar, Users, DollarSign, Package } from "lucide-react";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";

const Index = () => {
  const stats = [
    { icon: Calendar, label: "Appointments Today", value: "0" },
    { icon: Users, label: "Total Clients", value: "0" },
    { icon: DollarSign, label: "Today's Revenue", value: "$0" },
    { icon: Package, label: "Active Services", value: "0" },
  ];

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <AppointmentForm />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              No appointments scheduled for today
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Clients</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              No clients yet
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;