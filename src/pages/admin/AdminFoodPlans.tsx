import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AdminFoodPlans = () => {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", meal_type: "Vegetarian", meals_per_day: 3, dining_location: "Hotel", description: "", quality_standard: "", price: 0 });
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from("food_plans").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (editing) {
      const { error } = await supabase.from("food_plans").update(form).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("food_plans").insert(form);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: editing ? "Updated" : "Created" });
    setOpen(false); setEditing(null);
    setForm({ name: "", meal_type: "Vegetarian", meals_per_day: 3, dining_location: "Hotel", description: "", quality_standard: "", price: 0 });
    fetchData();
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ name: item.name, meal_type: item.meal_type, meals_per_day: item.meals_per_day, dining_location: item.dining_location || "Hotel", description: item.description || "", quality_standard: item.quality_standard || "", price: item.price });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("food_plans").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  const resetForm = () => setForm({ name: "", meal_type: "Vegetarian", meals_per_day: 3, dining_location: "Hotel", description: "", quality_standard: "", price: 0 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Food Plans</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); resetForm(); } }}>
          <DialogTrigger asChild><Button className="font-body"><Plus className="w-4 h-4 mr-2" /> Add</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit" : "Add"} Food Plan</DialogTitle></DialogHeader>
            <div className="space-y-4 font-body">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Meal Type</Label><Input value={form.meal_type} onChange={(e) => setForm({ ...form, meal_type: e.target.value })} placeholder="Vegetarian / Non-Veg / Jain" /></div>
              <div><Label>Meals per Day</Label><Input type="number" value={form.meals_per_day} onChange={(e) => setForm({ ...form, meals_per_day: Number(e.target.value) })} /></div>
              <div><Label>Dining Location</Label><Input value={form.dining_location} onChange={(e) => setForm({ ...form, dining_location: e.target.value })} /></div>
              <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>Quality Standard</Label><Input value={form.quality_standard} onChange={(e) => setForm({ ...form, quality_standard: e.target.value })} /></div>
              <div><Label>Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead><tr className="border-b bg-muted/50"><th className="text-left p-3">Name</th><th className="text-left p-3 hidden sm:table-cell">Type</th><th className="text-left p-3 hidden md:table-cell">Meals/Day</th><th className="text-left p-3">Price</th><th className="p-3 w-24">Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3 text-muted-foreground hidden sm:table-cell">{item.meal_type}</td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{item.meals_per_day}</td>
                <td className="p-3">₹{Number(item.price).toLocaleString()}</td>
                <td className="p-3"><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button><Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No food plans yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFoodPlans;
