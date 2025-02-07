import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastVisit?: string;
  totalVisits: number;
  totalSpent: number;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedClients = localStorage.getItem('salonClients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4 mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, email, or phone..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <User className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No clients found</h3>
                <p className="text-sm text-muted-foreground">
                  Clients will appear here when appointments are booked.
                </p>
              </div>
            </Card>
          </div>
        ) : (
          filteredClients.map((client) => (
            <Card key={client.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{client.name}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID: #{client.id}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                  {client.lastVisit && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Last visit: {client.lastVisit}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Visits</p>
                    <p className="font-medium">{client.totalVisits}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="font-medium">₹{client.totalSpent}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Clients; 