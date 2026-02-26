import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, BookOpen, MapPin, Hotel, Users, Brush } from "lucide-react";

const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) => (
  <div className="bg-card border rounded-xl p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="font-body text-sm text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ destinations: 0, hotels: 0, packages: 0, bookings: 0, pilgrims: 0, cleaners: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [d, h, p, b, pr, c] = await Promise.all([
        supabase.from("destinations").select("id", { count: "exact", head: true }),
        supabase.from("hotels").select("id", { count: "exact", head: true }),
        supabase.from("packages").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("cleaners").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        destinations: d.count || 0, hotels: h.count || 0, packages: p.count || 0,
        bookings: b.count || 0, pilgrims: pr.count || 0, cleaners: c.count || 0,
      });
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Destinations" value={stats.destinations} icon={MapPin} color="bg-primary/10 text-primary" />
        <StatCard label="Hotels" value={stats.hotels} icon={Hotel} color="bg-accent/10 text-accent" />
        <StatCard label="Packages" value={stats.packages} icon={Package} color="bg-gold/10 text-gold" />
        <StatCard label="Bookings" value={stats.bookings} icon={BookOpen} color="bg-saffron/10 text-saffron" />
        <StatCard label="Pilgrims" value={stats.pilgrims} icon={Users} color="bg-earth-light/10 text-earth-light" />
        <StatCard label="Cleaners" value={stats.cleaners} icon={Brush} color="bg-destructive/10 text-destructive" />
      </div>
    </div>
  );
};

export default AdminDashboard;
