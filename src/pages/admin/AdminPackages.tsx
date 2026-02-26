import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const AdminPackages = () => {
  const [items, setItems] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [foodPlans, setFoodPlans] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", description: "", destination_id: "", hotel_id: "", food_plan_id: "",
    tier: "basic" as "basic" | "premium", duration_days: 1, group_size: "10-20", travel_type: "Bus",
    travel_cost: 0, accommodation_cost: 0, food_cost: 0, tax_amount: 0, total_price: 0,
    highlights: "", is_featured: false, rating: 4.5,
  });
  const { toast } = useToast();

  const fetchData = async () => {
    const [{ data: p }, { data: d }, { data: h }, { data: f }] = await Promise.all([
      supabase.from("packages").select("*, destinations(name)").order("created_at", { ascending: false }),
      supabase.from("destinations").select("id, name"),
      supabase.from("hotels").select("id, name"),
      supabase.from("food_plans").select("id, name"),
    ]);
    setItems(p || []); setDestinations(d || []); setHotels(h || []); setFoodPlans(f || []);
  };

  useEffect(() => { fetchData(); }, []);

  // Auto-calc total
  useEffect(() => {
    setForm((f) => ({ ...f, total_price: f.travel_cost + f.accommodation_cost + f.food_cost + f.tax_amount }));
  }, [form.travel_cost, form.accommodation_cost, form.food_cost, form.tax_amount]);

  const handleSave = async () => {
    const payload = {
      ...form,
      highlights: form.highlights.split(",").map((s) => s.trim()).filter(Boolean),
      destination_id: form.destination_id || null,
      hotel_id: form.hotel_id || null,
      food_plan_id: form.food_plan_id || null,
    };
    if (editing) {
      const { error } = await supabase.from("packages").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("packages").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: editing ? "Updated" : "Created" });
    setOpen(false); setEditing(null); fetchData();
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({
      name: item.name, description: item.description || "", destination_id: item.destination_id || "",
      hotel_id: item.hotel_id || "", food_plan_id: item.food_plan_id || "", tier: item.tier,
      duration_days: item.duration_days, group_size: item.group_size || "10-20", travel_type: item.travel_type || "Bus",
      travel_cost: Number(item.travel_cost), accommodation_cost: Number(item.accommodation_cost),
      food_cost: Number(item.food_cost), tax_amount: Number(item.tax_amount), total_price: Number(item.total_price),
      highlights: (item.highlights || []).join(", "), is_featured: item.is_featured, rating: Number(item.rating),
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("packages").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Packages</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild><Button className="font-body"><Plus className="w-4 h-4 mr-2" /> Add</Button></DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto max-w-lg">
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit" : "Add"} Package</DialogTitle></DialogHeader>
            <div className="space-y-4 font-body">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tier</Label>
                  <Select value={form.tier} onValueChange={(v: "basic" | "premium") => setForm({ ...form, tier: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="basic">Basic</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label>Duration (days)</Label><Input type="number" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })} /></div>
              </div>
              <div>
                <Label>Destination</Label>
                <Select value={form.destination_id} onValueChange={(v) => setForm({ ...form, destination_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{destinations.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Hotel</Label>
                <Select value={form.hotel_id} onValueChange={(v) => setForm({ ...form, hotel_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{hotels.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Food Plan</Label>
                <Select value={form.food_plan_id} onValueChange={(v) => setForm({ ...form, food_plan_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{foodPlans.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Travel Type</Label><Input value={form.travel_type} onChange={(e) => setForm({ ...form, travel_type: e.target.value })} /></div>
                <div><Label>Group Size</Label><Input value={form.group_size} onChange={(e) => setForm({ ...form, group_size: e.target.value })} /></div>
              </div>
              <p className="text-xs font-semibold text-muted-foreground pt-2">Price Breakdown</p>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Travel Cost</Label><Input type="number" value={form.travel_cost} onChange={(e) => setForm({ ...form, travel_cost: Number(e.target.value) })} /></div>
                <div><Label>Accommodation</Label><Input type="number" value={form.accommodation_cost} onChange={(e) => setForm({ ...form, accommodation_cost: Number(e.target.value) })} /></div>
                <div><Label>Food Cost</Label><Input type="number" value={form.food_cost} onChange={(e) => setForm({ ...form, food_cost: Number(e.target.value) })} /></div>
                <div><Label>Tax</Label><Input type="number" value={form.tax_amount} onChange={(e) => setForm({ ...form, tax_amount: Number(e.target.value) })} /></div>
              </div>
              <div className="bg-muted p-3 rounded-lg flex justify-between items-center">
                <span className="font-semibold">Total Price</span>
                <span className="font-display text-xl font-bold text-primary">₹{form.total_price.toLocaleString()}</span>
              </div>
              <div><Label>Highlights (comma-separated)</Label><Input value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} /></div>
              <div><Label>Rating</Label><Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={(c) => setForm({ ...form, is_featured: c })} /><Label>Featured</Label></div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead><tr className="border-b bg-muted/50"><th className="text-left p-3">Name</th><th className="text-left p-3 hidden sm:table-cell">Tier</th><th className="text-left p-3 hidden md:table-cell">Duration</th><th className="text-left p-3">Price</th><th className="p-3 w-24">Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{item.name} {item.is_featured && <Badge className="ml-2 text-xs">Featured</Badge>}</td>
                <td className="p-3 text-muted-foreground hidden sm:table-cell uppercase">{item.tier}</td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{item.duration_days} days</td>
                <td className="p-3 font-semibold">₹{Number(item.total_price).toLocaleString()}</td>
                <td className="p-3"><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button><Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No packages yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPackages;
