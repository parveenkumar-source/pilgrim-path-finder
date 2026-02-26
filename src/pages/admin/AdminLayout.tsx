import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, MapPin, Hotel, Utensils, Package, BookOpen,
  Users, Brush, Calendar, LogOut, Menu, X, ChevronRight
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Destinations", icon: MapPin, path: "/admin/destinations" },
  { label: "Hotels", icon: Hotel, path: "/admin/hotels" },
  { label: "Food Plans", icon: Utensils, path: "/admin/food-plans" },
  { label: "Packages", icon: Package, path: "/admin/packages" },
  { label: "Bookings", icon: BookOpen, path: "/admin/bookings" },
  { label: "Pilgrims", icon: Users, path: "/admin/pilgrims" },
  { label: "Cleaners", icon: Brush, path: "/admin/cleaners" },
  { label: "Schedules", icon: Calendar, path: "/admin/schedules" },
];

const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 border-b">
          <h2 className="font-display text-xl font-bold text-foreground">🙏 Admin Panel</h2>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-colors ${location.pathname === item.path ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button variant="ghost" className="w-full justify-start font-body text-sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="h-16 border-b bg-card flex items-center px-4 gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="font-display text-lg font-semibold">
            {navItems.find((i) => i.path === location.pathname)?.label || "Admin"}
          </h1>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
