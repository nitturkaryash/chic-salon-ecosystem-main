import { Calendar as CalendarIcon, Users as UsersIcon, Wallet as WalletIcon, Layers as LayersIcon } from 'lucide-react';
import React from 'react';

export const stats = [
  { icon: CalendarIcon, label: "Appointments Today", value: "0" },
  { icon: UsersIcon, label: "Total Clients", value: "0" },
  { icon: WalletIcon, label: "Today's Revenue", value: "₹0" },
  { icon: LayersIcon, label: "Active Services", value: "0" }
];

export const Dashboard: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center gap-2">
            <stat.icon className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard; 