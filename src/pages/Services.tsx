import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Service {
  id: number;
  name: string;
  duration: string;
  price: number;
  description?: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({});

  // Load services from localStorage on component mount
  useEffect(() => {
    const savedServices = localStorage.getItem('salonServices');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
  }, []);

  // Save services to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('salonServices', JSON.stringify(services));
  }, [services]);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (newService.name && newService.duration && newService.price) {
      const service: Service = {
        id: Date.now(),
        name: newService.name,
        duration: newService.duration,
        price: Number(newService.price),
        description: newService.description
      };

      setServices(prevServices => [...prevServices, service]);
      setNewService({});
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteService = (id: number) => {
    setServices(prevServices => prevServices.filter(service => service.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={newService.name || ""}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="Enter service name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  value={newService.duration || ""}
                  onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  placeholder="Enter duration in minutes"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newService.price || ""}
                  onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={newService.description || ""}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Enter service description"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={!newService.name || !newService.duration || !newService.price}
              >
                Add Service
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <Plus className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No services added</h3>
                <p className="text-sm text-muted-foreground">
                  Click the "Add Service" button to add your first service.
                </p>
              </div>
            </Card>
          </div>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  <p className="text-muted-foreground mt-1">{service.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-bold">₹{service.price}</span>
                <span className="text-muted-foreground">{service.duration} min</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Services; 