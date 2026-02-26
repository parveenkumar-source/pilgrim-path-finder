import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Users, ArrowLeft } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setBookings(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 font-body">
          <ArrowLeft className="w-4 h-4 mr-2" /> Home
        </Button>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">My Bookings</h1>

        {loading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-muted-foreground mb-4">No bookings yet</p>
            <Button onClick={() => navigate("/")} className="rounded-full font-body">Explore Packages</Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-card border rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold">{b.package_name}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 font-body text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(b.travel_date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {b.num_travelers} travelers</span>
                      <Badge className={statusColors[b.status] || ""}>{b.status}</Badge>
                      <Badge variant="outline" className="uppercase">{b.tier}</Badge>
                    </div>
                    <div className="mt-2 font-body text-xs text-muted-foreground space-y-0.5">
                      <p>Travel: {b.travel_details}</p>
                      <p>Hotel: {b.hotel_details}</p>
                      <p>Food: {b.food_details}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-primary">₹{Number(b.total_price).toLocaleString()}</p>
                    <p className="font-body text-xs text-muted-foreground">{b.payment_status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyBookings;
