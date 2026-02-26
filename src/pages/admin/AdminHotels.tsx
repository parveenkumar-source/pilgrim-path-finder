import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminHotels = () => {
  const [items, setItems] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", destination_id: "", category: "Standard", address: "", room_types: "", facilities: "", image_url: "", contact_phone: "", contact_email: "" });
  const { toast } = useToast();

  const fetchData = async () => {
    const [{ data: h }, { data: d }] = await Promise.all([
      supabase.from("hotels").select("*, destinations(name)").order("created_at", { ascending: false }),
      supabase.from("destinations").select("id, name"),
    ]);
    setItems(h || []);
    setDestinations(d || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    const payload = {
      ...form,
      room_types: form.room_types.split(",").map((s) => s.trim()).filter(Boolean),
      facilities: form.facilities.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (editing) {
      const { error } = await supabase.from("hotels").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("hotels").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: editing ? "Updated" : "Created" });
    setOpen(false); setEditing(null);
    setForm({ name: "", destination_id: "", category: "Standard", address: "", room_types: "", facilities: "", image_url: "", contact_phone: "", contact_email: "" });
    fetchData();
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ name: item.name, destination_id: item.destination_id, category: item.category || "Standard", address: item.address || "", room_types: (item.room_types || []).join(", "), facilities: (item.facilities || []).join(", "), image_url: item.image_url || "", contact_phone: item.contact_phone || "", contact_email: item.contact_email || "" });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("hotels").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  const resetForm = () => setForm({ name: "", destination_id: "", category: "Standard", address: "", room_types: "", facilities: "", image_url: "", contact_phone: "", contact_email: "" });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Hotels</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); resetForm(); } }}>
          <DialogTrigger asChild><Button className="font-body"><Plus className="w-4 h-4 mr-2" /> Add</Button></DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit" : "Add"} Hotel</DialogTitle></DialogHeader>
            <div className="space-y-4 font-body">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div>
                <Label>Destination</Label>
                <Select value={form.destination_id} onValueChange={(v) => setForm({ ...form, destination_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                  <SelectContent>{destinations.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div><Label>Room Types (comma-separated)</Label><Input value={form.room_types} onChange={(e) => setForm({ ...form, room_types: e.target.value })} /></div>
              <div><Label>Facilities (comma-separated)</Label><Input value={form.facilities} onChange={(e) => setForm({ ...form, facilities: e.target.value })} /></div>
              <div><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
              <div><Label>Contact Phone</Label><Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} /></div>
              <div><Label>Contact Email</Label><Input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead><tr className="border-b bg-muted/50"><th className="text-left p-3">Name</th><th className="text-left p-3 hidden sm:table-cell">Destination</th><th className="text-left p-3 hidden md:table-cell">Category</th><th className="p-3 w-24">Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3 text-muted-foreground hidden sm:table-cell">{(item as any).destinations?.name}</td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{item.category}</td>
                <td className="p-3"><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button><Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No hotels yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHotels;
