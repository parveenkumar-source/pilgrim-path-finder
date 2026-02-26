import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    setBookings(data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status: status as "pending" | "confirmed" | "cancelled" | "completed" }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Status updated" }); fetchData(); }
  };

  const filtered = bookings.filter((b) =>
    b.package_name.toLowerCase().includes(search.toLowerCase()) ||
    b.contact_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Bookings</h2>
        <Input className="max-w-xs font-body" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bg-card border rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead><tr className="border-b bg-muted/50">
            <th className="text-left p-3">Package</th>
            <th className="text-left p-3 hidden sm:table-cell">Contact</th>
            <th className="text-left p-3 hidden md:table-cell">Date</th>
            <th className="text-left p-3">Travelers</th>
            <th className="text-left p-3">Total</th>
            <th className="text-left p-3">Status</th>
          </tr></thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{b.package_name}<br/><span className="text-xs text-muted-foreground uppercase">{b.tier}</span></td>
                <td className="p-3 text-muted-foreground hidden sm:table-cell">{b.contact_name}<br/><span className="text-xs">{b.contact_phone}</span></td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{new Date(b.travel_date).toLocaleDateString()}</td>
                <td className="p-3">{b.num_travelers}</td>
                <td className="p-3 font-semibold">₹{Number(b.total_price).toLocaleString()}</td>
                <td className="p-3">
                  <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No bookings found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
