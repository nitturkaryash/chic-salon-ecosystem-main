import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Phone, Mail, Scissors, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: number;
  name: string;
  duration: string;
  price: number;
  description?: string;
}

interface Stylist {
  id: number;
  name: string;
  phone: string;
  email: string;
  specialization?: string;
  services: number[]; // Array of service IDs
  imageUrl?: string;
}

const Stylists = () => {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [newStylist, setNewStylist] = useState({
    name: "",
    phone: "",
    email: "",
    specialization: "",
  });

  // Load stylists and services from localStorage
  useEffect(() => {
    const savedStylists = localStorage.getItem('salonStylists');
    const savedServices = localStorage.getItem('salonServices');
    
    if (savedStylists) {
      setStylists(JSON.parse(savedStylists));
    }
    
    // Load services from the Services section
    if (savedServices) {
      try {
        const parsedServices = JSON.parse(savedServices);
        setServices(parsedServices);
      } catch (error) {
        console.error('Error loading services:', error);
        setServices([]);
      }
    }
  }, []);

  // Save stylists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('salonStylists', JSON.stringify(stylists));
  }, [stylists]);

  const handleCreateStylist = () => {
    if (!newStylist.name || !newStylist.phone) {
      alert("Please fill in required fields");
      return;
    }

    if (selectedServices.length === 0) {
      alert("Please select at least one service");
      return;
    }

    const stylist: Stylist = {
      id: Date.now(),
      ...newStylist,
      services: selectedServices,
    };

    setStylists(prev => [...prev, stylist]);
    setShowAddDialog(false);
    setNewStylist({
      name: "",
      phone: "",
      email: "",
      specialization: "",
    });
    setSelectedServices([]);
  };

  const handleDeleteStylist = (id: number) => {
    setStylists(stylists.filter(stylist => stylist.id !== id));
  };

  const toggleService = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stylists</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Stylist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Stylist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newStylist.name}
                  onChange={(e) => setNewStylist({ ...newStylist, name: e.target.value })}
                  placeholder="Enter stylist name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={newStylist.phone}
                  onChange={(e) => setNewStylist({ ...newStylist, phone: e.target.value })}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStylist.email}
                  onChange={(e) => setNewStylist({ ...newStylist, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={newStylist.specialization}
                  onChange={(e) => setNewStylist({ ...newStylist, specialization: e.target.value })}
                  placeholder="E.g., Hair Color Specialist"
                />
              </div>
              <div>
                <Label>Services</Label>
                {services.length === 0 ? (
                  <div className="text-sm text-muted-foreground mt-2 p-4 border rounded-lg text-center">
                    No services available. Please add services in the Services section first.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {services.map((service) => (
                      <Button
                        key={service.id}
                        variant={selectedServices.includes(service.id) ? "default" : "outline"}
                        className="justify-start text-left h-auto py-3"
                        onClick={() => toggleService(service.id)}
                      >
                        <div className="flex flex-col items-start">
                          <div className="flex items-center">
                            <Scissors className="h-4 w-4 mr-2" />
                            <span>{service.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground ml-6">
                            ₹{service.price} • {service.duration} min
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button 
                onClick={handleCreateStylist}
                disabled={!newStylist.name || !newStylist.phone || selectedServices.length === 0}
              >
                Add Stylist
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stylists.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <Scissors className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No stylists added</h3>
                <p className="text-sm text-muted-foreground">
                  Click the "Add Stylist" button to add your first stylist.
                </p>
              </div>
            </Card>
          </div>
        ) : (
          stylists.map((stylist) => (
            <Card key={stylist.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{stylist.name}</h3>
                    {stylist.specialization && (
                      <p className="text-sm text-muted-foreground mt-1">{stylist.specialization}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteStylist(stylist.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{stylist.phone}</span>
                  </div>
                  {stylist.email && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{stylist.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {stylist.services.map(serviceId => {
                      const service = services.find(s => s.id === serviceId);
                      return service ? (
                        <Badge key={service.id} variant="secondary" className="py-1">
                          <span>{service.name}</span>
                          <span className="ml-1 text-muted-foreground">• ₹{service.price}</span>
                        </Badge>
                      ) : null;
                    })}
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

export default Stylists; 