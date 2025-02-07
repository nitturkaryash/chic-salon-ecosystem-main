import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Minus, X, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface Service {
  id: number;
  name: string;
  price: number;
  duration: string;
}

interface CartItem extends Service {
  quantity: number;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
}

interface Order {
  id: number;
  date: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "paid" | "pending";
}

interface AppointmentCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const services: Service[] = [
  { id: 1, name: "Haircut & Style", price: 800, duration: "60" },
  { id: 2, name: "Hair Color", price: 2500, duration: "120" },
  { id: 3, name: "Manicure", price: 500, duration: "45" },
  { id: 4, name: "Pedicure", price: 700, duration: "60" },
  { id: 5, name: "Facial", price: 1500, duration: "90" },
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

const POS = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [customerType, setCustomerType] = useState<"walk-in" | "appointment" | null>(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [appointmentCustomers, setAppointmentCustomers] = useState<AppointmentCustomer[]>([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Load appointment customers from localStorage
  useEffect(() => {
    const savedClients = localStorage.getItem('salonClients');
    if (savedClients) {
      setAppointmentCustomers(JSON.parse(savedClients));
    }
  }, []);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = appointmentCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.phone.includes(customerSearchTerm)
  );

  const addToCart = (service: Service) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === service.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...service, quantity: 1 }];
    });
  };

  const removeFromCart = (serviceId: number) => {
    setCart(cart.filter(item => item.id !== serviceId));
  };

  const updateQuantity = (serviceId: number, change: number) => {
    setCart(currentCart =>
      currentCart.map(item => {
        if (item.id === serviceId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = paymentMethod === "Cash" ? 0 : subtotal * 0.18; // Only apply GST for non-cash payments
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  const getNextOrderNumber = () => {
    const existingOrders = JSON.parse(localStorage.getItem('salonOrders') || '[]');
    if (existingOrders.length === 0) {
      return 1; // Start from 1 if no orders exist
    }
    // Find the highest order number and add 1
    const maxOrderId = Math.max(...existingOrders.map((order: Order) => order.id));
    return maxOrderId + 1;
  };

  const handleCreateOrder = () => {
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    // Create new order with sequential order number
    const newOrder: Order = {
      id: getNextOrderNumber(),
      date: new Date().toLocaleDateString(),
      customerName: selectedCustomer.name,
      items: cart,
      subtotal,
      tax,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "BNPL" ? "pending" : "paid"
    };

    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('salonOrders') || '[]');
    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem('salonOrders', JSON.stringify(updatedOrders));

    // Reset form
    setCart([]);
    setSelectedCustomer(null);
    setPaymentMethod("");
    setSearchTerm("");
    setSelectedTimeSlot("");

    // Show success message
    alert("Order created successfully!");
  };

  const handleCreateNewCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert("Please fill in required fields");
      return;
    }

    const customer: AppointmentCustomer = {
      id: Date.now(),
      ...newCustomer
    };

    setAppointmentCustomers([...appointmentCustomers, customer]);
    setSelectedCustomer(customer);
    setShowCustomerDialog(false);
    setNewCustomer({ name: "", email: "", phone: "" });

    // Save to localStorage
    const updatedCustomers = [...appointmentCustomers, customer];
    localStorage.setItem('salonClients', JSON.stringify(updatedCustomers));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Services Selection */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-bold">Services</h2>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="p-4 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => addToCart(service)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.duration} min</p>
                  </div>
                  <p className="font-semibold">₹{service.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Side - Cart & Payment */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            
            {/* Customer Selection */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Customer</h3>
                </div>
                {selectedCustomer && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(null);
                      setCustomerType(null);
                    }}
                  >
                    Change
                  </Button>
                )}
              </div>

              {!selectedCustomer ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={customerType === "walk-in" ? "default" : "outline"}
                      onClick={() => {
                        setCustomerType("walk-in");
                        setSelectedCustomer({ id: 0, name: "Walk-in Customer", phone: "" });
                      }}
                      className="w-full"
                    >
                      Walk-in
                    </Button>
                    <Button
                      variant={customerType === "appointment" ? "default" : "outline"}
                      onClick={() => {
                        setCustomerType("appointment");
                        setShowCustomerDialog(true);
                      }}
                      className="w-full"
                    >
                      Select Customer
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
                </div>
              )}
            </Card>

            {/* Time Slot Selection */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Time Slot</h3>
              </div>
              <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            {/* Customer Selection Dialog */}
            <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Select Customer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search customers..."
                        className="pl-8"
                        value={customerSearchTerm}
                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className="p-2 hover:bg-accent cursor-pointer"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowCustomerDialog(false);
                          }}
                        >
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.phone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Create New Customer</h4>
                    <div className="space-y-3">
                      <Input
                        placeholder="Name *"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      />
                      <Input
                        placeholder="Phone *"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      />
                      <Button 
                        onClick={handleCreateNewCustomer}
                        className="w-full"
                        disabled={!newCustomer.name || !newCustomer.phone}
                      >
                        Create Customer
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Cart Items */}
            <Card className="p-4">
              <h3 className="font-medium mb-4">Cart Items</h3>
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No items in cart
                  </p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">₹{item.price} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Payment Summary */}
            <Card className="p-4">
              <h3 className="font-medium mb-4">Payment</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {paymentMethod !== "Cash" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Select 
              value={paymentMethod} 
              onValueChange={(value) => {
                setPaymentMethod(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent position="top">
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Cash">Cash (No GST)</SelectItem>
                <SelectItem value="BNPL">Buy Now Pay Later</SelectItem>
              </SelectContent>
            </Select>

            {/* Create Order Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleCreateOrder}
              disabled={cart.length === 0 || !selectedCustomer || !paymentMethod}
            >
              Create Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS; 