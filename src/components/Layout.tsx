import { Calendar, Users, ShoppingCart, Package, Menu, X, FileText, Scissors } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: Users, label: "Clients", path: "/clients" },
    { icon: FileText, label: "Orders", path: "/orders" },
    { icon: ShoppingCart, label: "POS", path: "/pos" },
    { icon: Scissors, label: "Stylists", path: "/stylists" },
    { icon: Package, label: "Services", path: "/services" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-primary md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-secondary transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-6">
          <Link 
            to="/" 
            className="block text-2xl font-bold text-primary-foreground mb-8 hover:text-primary transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            Salon Manager
          </Link>
          <nav className="space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-accent hover:bg-primary/10 hover:text-primary-foreground"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "md:ml-64" : "md:ml-64"
      } p-8`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;