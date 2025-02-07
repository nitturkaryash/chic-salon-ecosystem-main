import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Textarea } from "@/components/ui/textarea";
import { Search, Trash2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CartItem {
  id: number;
  name: string;
  price: number;
  duration: string;
  quantity: number;
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
  paymentStatus: "paid" | "pending" | "failed";
  fulfillmentStatus?: "pending" | "fulfilled" | "cancelled";
  notes?: OrderNote[];
}

interface OrderNote {
  id: number;
  text: string;
  date: string;
}

type OrderWithNotes = Order;

const Orders = () => {
  const [orders, setOrders] = useState<OrderWithNotes[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithNotes | null>(null);
  const [newNote, setNewNote] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showFulfillAlert, setShowFulfillAlert] = useState(false);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('salonOrders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      // Add fulfillmentStatus if not present
      const ordersWithStatus = parsedOrders.map((order: Order) => ({
        ...order,
        fulfillmentStatus: order.fulfillmentStatus || "pending",
        notes: order.notes || []
      }));
      setOrders(ordersWithStatus);
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('salonOrders', JSON.stringify(orders));
  }, [orders]);

  const handleAddNote = (orderId: number) => {
    if (!newNote.trim()) return;

    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          notes: [
            ...(order.notes || []),
            {
              id: Date.now(),
              text: newNote,
              date: new Date().toLocaleString(),
            }
          ]
        };
      }
      return order;
    }));
    setNewNote("");
  };

  const handleDeleteOrder = (orderId: number) => {
    setOrders(orders.filter(order => order.id !== orderId));
    setSelectedOrder(null);
    setShowDeleteAlert(false);
  };

  const handleDeleteClick = (order: OrderWithNotes) => {
    setSelectedOrder(order);
    setShowDeleteAlert(true);
  };

  const handleFulfillClick = (order: OrderWithNotes) => {
    setSelectedOrder(order);
    setShowFulfillAlert(true);
  };

  const handleFulfillOrder = (orderId: number) => {
    updateFulfillmentStatus(orderId, "fulfilled");
    setSelectedOrder(null);
    setShowFulfillAlert(false);
  };

  const updateFulfillmentStatus = (orderId: number, status: "pending" | "fulfilled" | "cancelled") => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, fulfillmentStatus: status };
      }
      return order;
    }));
  };

  const updatePaymentStatus = (orderId: number, status: "paid" | "pending") => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, paymentStatus: status };
      }
      return order;
    }));
  };

  const getStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "";
    }
  };

  const getFulfillmentColor = (status: string = "pending") => {
    switch (status) {
      case "fulfilled":
        return "bg-green-500/10 text-green-500";
      case "cancelled":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-yellow-500/10 text-yellow-500";
    }
  };

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm)
  ).sort((a, b) => b.id - a.id);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="text-right">Tax</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fulfillment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-32 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <Dialog key={order.id}>
                  <DialogTrigger asChild>
                    <TableRow className="cursor-pointer hover:bg-accent/50">
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell className="text-right">₹{order.subtotal}</TableCell>
                      <TableCell className="text-right">₹{order.tax.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(order.paymentStatus)}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getFulfillmentColor(order.fulfillmentStatus)}>
                          {order.fulfillmentStatus || "pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader className="border-b pb-4 relative">
                      <div className="flex justify-between items-center pr-8">
                        <DialogTitle className="text-xl">Order #{order.id}</DialogTitle>
                        <div className="flex items-center gap-3">
                          <Button
                            variant={order.paymentStatus === "paid" ? "default" : "outline"}
                            size="sm"
                            onClick={() => updatePaymentStatus(order.id, order.paymentStatus === "paid" ? "pending" : "paid")}
                            className="px-4"
                          >
                            {order.paymentStatus === "paid" ? "Paid" : "Mark as Paid"}
                          </Button>
                          <Button
                            variant={order.fulfillmentStatus === "fulfilled" ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateFulfillmentStatus(order.id, order.fulfillmentStatus === "fulfilled" ? "pending" : "fulfilled")}
                            className="px-4"
                          >
                            {order.fulfillmentStatus === "fulfilled" ? "Fulfilled" : "Mark as Fulfilled"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(order);
                            }}
                            className="px-3"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </DialogHeader>

                    <div className="mt-6 grid grid-cols-2 gap-6">
                      {/* Order Details */}
                      <div>
                        <h3 className="font-semibold mb-2">Order Details</h3>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-muted-foreground">Date:</span> {order.date}</p>
                          <p><span className="text-muted-foreground">Customer:</span> {order.customerName}</p>
                          <p><span className="text-muted-foreground">Payment Method:</span> {order.paymentMethod}</p>
                          <p className="flex items-center gap-2">
                            <span className="text-muted-foreground">Payment Status:</span>
                            <Badge variant="secondary" className={getStatusColor(order.paymentStatus)}>
                              {order.paymentStatus}
                            </Badge>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-muted-foreground">Fulfillment:</span>
                            <Badge variant="secondary" className={getFulfillmentColor(order.fulfillmentStatus)}>
                              {order.fulfillmentStatus || "pending"}
                            </Badge>
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h3 className="font-semibold mb-2">Items</h3>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.name} × {item.quantity}</span>
                              <span>₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>₹{order.subtotal}</span>
                            </div>
                            {order.tax > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax (18%)</span>
                                <span>₹{order.tax.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-medium mt-2">
                              <span>Total</span>
                              <span>₹{order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div className="mt-6">
                      <h3 className="font-semibold mb-2">Notes</h3>
                      <div className="space-y-4">
                        {order.notes?.map((note) => (
                          <div key={note.id} className="bg-accent/50 p-3 rounded-lg">
                            <p className="text-sm">{note.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">{note.date}</p>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Add a note..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                          />
                          <Button onClick={() => handleAddNote(order.id)}>Add Note</Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={showDeleteAlert} 
        onOpenChange={(open) => {
          setShowDeleteAlert(open);
          if (!open) setSelectedOrder(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order #{selectedOrder?.id}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (selectedOrder) {
                  handleDeleteOrder(selectedOrder.id);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Fulfill Confirmation Dialog */}
      <AlertDialog 
        open={showFulfillAlert} 
        onOpenChange={(open) => {
          setShowFulfillAlert(open);
          if (!open) setSelectedOrder(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fulfill Order #{selectedOrder?.id}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this order as fulfilled? This will update the order's status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-500 hover:bg-green-600"
              onClick={() => {
                if (selectedOrder) {
                  handleFulfillOrder(selectedOrder.id);
                }
              }}
            >
              Mark as Fulfilled
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Orders; 