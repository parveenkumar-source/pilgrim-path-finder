import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Packages from "./pages/Packages";
import PackageDetails from "./pages/PackageDetails";
import MyBookings from "./pages/MyBookings";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDestinations from "./pages/admin/AdminDestinations";
import AdminHotels from "./pages/admin/AdminHotels";
import AdminFoodPlans from "./pages/admin/AdminFoodPlans";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminPilgrims from "./pages/admin/AdminPilgrims";
import AdminCleaners from "./pages/admin/AdminCleaners";
import AdminSchedules from "./pages/admin/AdminSchedules";
import CleanerPortal from "./pages/CleanerPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:id" element={<PackageDetails />} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="destinations" element={<AdminDestinations />} />
              <Route path="hotels" element={<AdminHotels />} />
              <Route path="food-plans" element={<AdminFoodPlans />} />
              <Route path="packages" element={<AdminPackages />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="pilgrims" element={<AdminPilgrims />} />
              <Route path="cleaners" element={<AdminCleaners />} />
              <Route path="schedules" element={<AdminSchedules />} />
            </Route>

            {/* Cleaner routes */}
            <Route path="/cleaner" element={<ProtectedRoute allowedRoles={["cleaner"]}><CleanerPortal /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
