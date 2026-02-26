import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, Users, Star, MapPin, Utensils, Hotel, Bus, IndianRupee, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [pkg, setPkg] = useState<any>(null);
  const [hotel, setHotel] = useState<any>(null);
  const [foodPlan, setFoodPlan] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [numTravelers, setNumTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    const fetchPackage = async () => {
      const { data } = await supabase.from("packages").select("*").eq("id", id).single();
      if (data) {
        setPkg(data);
        if (data.hotel_id) {
          const { data: h } = await supabase.from("hotels").select("*").eq("id", data.hotel_id).single();
          setHotel(h);
        }
        if (data.food_plan_id) {
          const { data: f } = await supabase.from("food_plans").select("*").eq("id", data.food_plan_id).single();
          setFoodPlan(f);
        }
        if (data.destination_id) {
          const { data: d } = await supabase.from("destinations").select("*").eq("id", data.destination_id).single();
          setDestination(d);
        }
      }
      setLoading(false);
    };
    if (id) fetchPackage();
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate("/auth"); return; }
    if (!pkg) return;

    setBooking(true);
    const totalPrice = Number(pkg.total_price) * numTravelers;

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      package_id: pkg.id,
      package_name: pkg.name,
      tier: pkg.tier,
      num_travelers: numTravelers,
      travel_date: travelDate,
      total_price: totalPrice,
      travel_details: `${pkg.travel_type} - ${pkg.duration_days} days`,
      hotel_details: hotel ? `${hotel.name} (${hotel.category})` : "N/A",
      food_details: foodPlan ? `${foodPlan.name} - ${foodPlan.meals_per_day} meals/day` : "N/A",
      contact_name: contactName,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      special_requests: specialRequests,
    });

    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking confirmed! 🙏", description: "Check your bookings for details." });
      navigate("/my-bookings");
    }
    setBooking(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  if (!pkg) return <div className="min-h-screen flex items-center justify-center font-body text-muted-foreground">Package not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 font-body">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Package info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{pkg.name}</h1>
                <Badge className="uppercase">{pkg.tier}</Badge>
              </div>
              {destination && (
                <p className="font-body text-muted-foreground flex items-center gap-1"><MapPin className="w-4 h-4" /> {destination.name}, {destination.location}</p>
              )}
            </div>

            <p className="font-body text-foreground/80">{pkg.description}</p>

            <div className="flex flex-wrap gap-4 font-body text-sm">
              <span className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full"><Clock className="w-4 h-4" /> {pkg.duration_days} Days</span>
              <span className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full"><Users className="w-4 h-4" /> {pkg.group_size}</span>
              <span className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full"><Bus className="w-4 h-4" /> {pkg.travel_type}</span>
              <span className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full"><Star className="w-4 h-4 fill-gold text-gold" /> {pkg.rating}</span>
            </div>

            {/* Price breakdown */}
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-display text-xl font-semibold mb-4">Price Breakdown</h3>
              <div className="space-y-2 font-body text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Travel ({pkg.travel_type})</span><span>₹{Number(pkg.travel_cost).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Accommodation</span><span>₹{Number(pkg.accommodation_cost).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Food & Meals</span><span>₹{Number(pkg.food_cost).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Taxes</span><span>₹{Number(pkg.tax_amount).toLocaleString()}</span></div>
                <div className="border-t pt-2 flex justify-between font-semibold text-base"><span>Total per person</span><span className="text-primary">₹{Number(pkg.total_price).toLocaleString()}</span></div>
              </div>
            </div>

            {/* Hotel info */}
            {hotel && (
              <div className="bg-card border rounded-xl p-6">
                <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2"><Hotel className="w-5 h-5" /> Hotel Details</h3>
                <div className="font-body text-sm space-y-2">
                  <p><span className="text-muted-foreground">Hotel:</span> {hotel.name}</p>
                  <p><span className="text-muted-foreground">Category:</span> {hotel.category}</p>
                  <p><span className="text-muted-foreground">Room Types:</span> {hotel.room_types?.join(", ") || "Standard"}</p>
                  <p><span className="text-muted-foreground">Facilities:</span> {hotel.facilities?.join(", ") || "Basic amenities"}</p>
                </div>
              </div>
            )}

            {/* Food info */}
            {foodPlan && (
              <div className="bg-card border rounded-xl p-6">
                <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2"><Utensils className="w-5 h-5" /> Food & Meals</h3>
                <div className="font-body text-sm space-y-2">
                  <p><span className="text-muted-foreground">Plan:</span> {foodPlan.name}</p>
                  <p><span className="text-muted-foreground">Meal Type:</span> {foodPlan.meal_type}</p>
                  <p><span className="text-muted-foreground">Meals per Day:</span> {foodPlan.meals_per_day}</p>
                  <p><span className="text-muted-foreground">Dining:</span> {foodPlan.dining_location}</p>
                  {foodPlan.quality_standard && <p><span className="text-muted-foreground">Quality:</span> {foodPlan.quality_standard}</p>}
                </div>
              </div>
            )}

            {/* Highlights */}
            {pkg.highlights?.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-semibold mb-3">Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {pkg.highlights.map((h: string) => (
                    <span key={h} className="bg-secondary text-secondary-foreground font-body text-xs px-3 py-1 rounded-full">{h}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border rounded-xl p-6">
              <h3 className="font-display text-xl font-semibold mb-4">Book This Package</h3>
              <form onSubmit={handleBook} className="space-y-4 font-body">
                <div><Label>Your Name</Label><Input value={contactName} onChange={(e) => setContactName(e.target.value)} required /></div>
                <div><Label>Email</Label><Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required /></div>
                <div><Label>Phone</Label><Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required /></div>
                <div><Label>Travel Date</Label><Input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} required /></div>
                <div><Label>Number of Travelers</Label><Input type="number" min={1} max={20} value={numTravelers} onChange={(e) => setNumTravelers(Number(e.target.value))} /></div>
                <div><Label>Special Requests</Label><Input value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Any special needs..." /></div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-body text-sm mb-1"><span>₹{Number(pkg.total_price).toLocaleString()} × {numTravelers}</span></div>
                  <div className="flex justify-between font-semibold text-lg"><span>Total</span><span className="text-primary">₹{(Number(pkg.total_price) * numTravelers).toLocaleString()}</span></div>
                </div>

                <Button type="submit" className="w-full rounded-full" disabled={booking}>
                  {booking ? "Booking..." : "Confirm Booking"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PackageDetails;
