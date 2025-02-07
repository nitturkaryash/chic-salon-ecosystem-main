import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, User, Scissors } from "lucide-react";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";

interface Appointment {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  price: number;
  duration: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastVisit?: string;
  totalVisits: number;
  totalSpent: number;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  // Load appointments and clients from localStorage on component mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('salonAppointments');
    const savedClients = localStorage.getItem('salonClients');
    
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('salonAppointments', JSON.stringify(appointments));
  }, [appointments]);

  // Save clients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('salonClients', JSON.stringify(clients));
  }, [clients]);

  const handleAppointmentCreated = (appointment: Appointment) => {
    // Add the new appointment to the appointments list
    setAppointments(prevAppointments => [...prevAppointments, appointment]);
    
    // Update or create client information
    const existingClient = clients.find(
      client => 
        client.email === appointment.email || 
        client.phone === appointment.phone
    );

    if (existingClient) {
      // Update existing client
      const updatedClients = clients.map(client => {
        if (client.id === existingClient.id) {
          return {
            ...client,
            lastVisit: appointment.date,
            totalVisits: client.totalVisits + 1,
            totalSpent: client.totalSpent + appointment.price
          };
        }
        return client;
      });
      setClients(updatedClients);
    } else {
      // Create new client
      const newClient: Client = {
        id: Date.now(),
        name: appointment.customerName,
        email: appointment.email,
        phone: appointment.phone,
        lastVisit: appointment.date,
        totalVisits: 1,
        totalSpent: appointment.price
      };
      setClients(prevClients => [...prevClients, newClient]);
    }
  };

  // Sort appointments by date and time
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.time);
    const dateB = new Date(b.date + ' ' + b.time);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <AppointmentForm onAppointmentCreated={handleAppointmentCreated} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedAppointments.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <Calendar className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No appointments scheduled</h3>
                <p className="text-sm text-muted-foreground">
                  Click the "Book Appointment" button to schedule a new appointment.
                </p>
              </div>
            </Card>
          </div>
        ) : (
          sortedAppointments.map((appointment) => (
            <Card key={appointment.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{appointment.customerName}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID: #{appointment.id}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Scissors className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.service}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.time}</span>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{appointment.duration} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">₹{appointment.price}</p>
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

export default Appointments; 