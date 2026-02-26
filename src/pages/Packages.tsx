import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, Bus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Packages = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false });
      setPackages(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-body text-saffron tracking-[0.2em] uppercase text-sm mb-3">Curated Journeys</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">All Packages</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">Browse all available pilgrimage packages with transparent pricing.</p>
        </div>

        {loading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
        ) : packages.length === 0 ? (
          <p className="text-center font-body text-muted-foreground">No packages available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className={`rounded-2xl border p-6 relative overflow-hidden transition-shadow hover:shadow-xl cursor-pointer ${pkg.is_featured ? "border-primary bg-primary/5 shadow-lg" : "border-border bg-card"}`} onClick={() => navigate(`/packages/${pkg.id}`)}>
                {pkg.is_featured && <div className="absolute top-4 right-4 bg-primary text-primary-foreground font-body text-xs px-3 py-1 rounded-full font-semibold">Featured</div>}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-display text-2xl font-bold text-foreground">{pkg.name}</h3>
                  <Badge className="uppercase text-xs">{pkg.tier}</Badge>
                </div>
                <div className="flex items-center gap-4 mb-4 font-body text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{pkg.duration_days}D</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" />{pkg.group_size}</span>
                  <span className="flex items-center gap-1"><Bus className="w-4 h-4" />{pkg.travel_type}</span>
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-gold text-gold" />{pkg.rating}</span>
                </div>
                {pkg.highlights?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pkg.highlights.slice(0, 4).map((h: string) => (
                      <span key={h} className="bg-secondary text-secondary-foreground font-body text-xs px-3 py-1 rounded-full">{h}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Starting from</p>
                    <p className="font-display text-2xl font-bold text-foreground">₹{Number(pkg.total_price).toLocaleString()}</p>
                    <p className="font-body text-xs text-muted-foreground">per person</p>
                  </div>
                  <Button className="rounded-full font-body" size="sm">View Details</Button>
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

export default Packages;
