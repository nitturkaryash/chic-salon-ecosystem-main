import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import "react-day-picker/dist/style.css";

const services = [
  { id: 1, name: "Haircut & Style", duration: "60", price: 800 },
  { id: 2, name: "Hair Color", duration: "120", price: 2500 },
  { id: 3, name: "Manicure", duration: "45", price: 500 },
  { id: 4, name: "Pedicure", duration: "60", price: 700 },
  { id: 5, name: "Facial", duration: "90", price: 1500 },
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

interface AppointmentFormProps {
  onAppointmentCreated?: (appointment: {
    id: number;
    customerName: string;
    email: string;
    phone: string;
    service: string;
    date: string;
    time: string;
    price: number;
    duration: string;
  }) => void;
}

// Add custom styles for the calendar
const calendarStyles = `
  .rdp {
    --rdp-cell-size: 35px !important;
    margin: 0;
  }
  .rdp-month {
    width: fit-content;
  }
  .rdp-day {
    width: 35px;
    height: 35px;
    font-size: 0.875rem;
  }
  .rdp-head_cell {
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

export function AppointmentForm({ onAppointmentCreated }: AppointmentFormProps) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    serviceId: "",
    time: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !formData.serviceId || !formData.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const selectedService = services.find(s => s.id.toString() === formData.serviceId);
    
    if (!selectedService) {
      toast({
        title: "Error",
        description: "Please select a valid service",
        variant: "destructive",
      });
      return;
    }

    const appointment = {
      id: Date.now(),
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      service: selectedService.name,
      date: format(date, "PPP"),
      time: formData.time,
      price: selectedService.price,
      duration: selectedService.duration,
    };

    onAppointmentCreated?.(appointment);
    
    toast({
      title: "Success",
      description: "Appointment booked successfully!",
    });

    // Reset form
    setFormData({
      customerName: "",
      email: "",
      phone: "",
      serviceId: "",
      time: "",
    });
    setDate(undefined);
    setOpen(false);
  };

  const footer = showCalendar ? (
    <div className="mt-4 text-center">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowCalendar(false)}
      >
        Close Calendar
      </Button>
    </div>
  ) : null;

  return (
    <>
      <style>{calendarStyles}</style>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Book Appointment</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] overflow-visible">
          <DialogHeader>
            <DialogTitle>Book New Appointment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 relative">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Enter customer name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Service</Label>
              <Select
                value={formData.serviceId}
                onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 z-50 shadow-lg">
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name} - ₹{service.price} ({service.duration} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
                {showCalendar && (
                  <div className="absolute bottom-full left-0 z-50 mb-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
                    <DayPicker
                      mode="single"
                      selected={date}
                      onSelect={(day) => {
                        setDate(day);
                        setShowCalendar(false);
                      }}
                      disabled={{ before: new Date() }}
                      footer={footer}
                      className="p-2"
                      showOutsideDays={false}
                      captionLayout="dropdown-buttons"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Time</Label>
              <Select
                value={formData.time}
                onValueChange={(value) => setFormData({ ...formData, time: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 z-50 shadow-lg">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full">
              Confirm Booking
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
} 