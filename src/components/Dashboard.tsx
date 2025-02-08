import { Card } from "@/components/ui/card";
import { Calendar, Users, DollarSign, Package } from "lucide-react";

const stats = [
  { icon: Calendar, label: "Appointments Today", value: "0" },
  { icon: Users, label: "Total Clients", value: "0" },
  { icon: DollarSign, label: "Today's Revenue", value: "₹0" },
  { icon: Package, label: "Active Services", value: "0" },
];

export function Dashboard() {
  return (
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
  );
} 