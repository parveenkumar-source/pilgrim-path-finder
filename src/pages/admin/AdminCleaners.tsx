import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminCleaners = () => {
  const [items, setItems] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ full_name: "", phone: "", hotel_id: "", email: "", password: "" });
  const { toast } = useToast();

  const fetchData = async () => {
    const [{ data: c }, { data: h }] = await Promise.all([
      supabase.from("cleaners").select("*, hotels(name)").order("created_at", { ascending: false }),
      supabase.from("hotels").select("id, name"),
    ]);
    setItems(c || []); setHotels(h || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (editing) {
      const { error } = await supabase.from("cleaners").update({
        full_name: form.full_name, phone: form.phone, hotel_id: form.hotel_id || null,
      }).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Updated" });
    } else {
      // Create auth user for cleaner, then add cleaner record
      // For now, admin adds cleaner with existing user_id placeholder
      toast({ title: "Note", description: "To add a cleaner, first register them as a user, then assign the cleaner role via the admin panel." });
      return;
    }
    setOpen(false); setEditing(null); fetchData();
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ full_name: item.full_name, phone: item.phone || "", hotel_id: item.hotel_id || "", email: "", password: "" });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("cleaners").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Cleaners</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild><Button className="font-body"><Plus className="w-4 h-4 mr-2" /> Add</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit" : "Add"} Cleaner</DialogTitle></DialogHeader>
            <div className="space-y-4 font-body">
              <div><Label>Full Name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div>
                <Label>Assigned Hotel</Label>
                <Select value={form.hotel_id} onValueChange={(v) => setForm({ ...form, hotel_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select hotel" /></SelectTrigger>
                  <SelectContent>{hotels.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead><tr className="border-b bg-muted/50"><th className="text-left p-3">Name</th><th className="text-left p-3 hidden sm:table-cell">Phone</th><th className="text-left p-3 hidden md:table-cell">Hotel</th><th className="text-left p-3">Status</th><th className="p-3 w-24">Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{item.full_name}</td>
                <td className="p-3 text-muted-foreground hidden sm:table-cell">{item.phone || "—"}</td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{(item as any).hotels?.name || "—"}</td>
                <td className="p-3">{item.is_active ? <span className="text-green-600 text-xs font-semibold">Active</span> : <span className="text-red-600 text-xs font-semibold">Inactive</span>}</td>
                <td className="p-3"><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button><Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No cleaners yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCleaners;
