import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const AdminDestinations = () => {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", location: "", image_url: "", highlights: "" });
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from("destinations").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    const payload = { ...form, highlights: form.highlights.split(",").map((s) => s.trim()).filter(Boolean), is_active: true };
    if (editing) {
      const { error } = await supabase.from("destinations").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("destinations").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: editing ? "Updated" : "Created" });
    setOpen(false); setEditing(null); setForm({ name: "", description: "", location: "", image_url: "", highlights: "" });
    fetchData();
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description || "", location: item.location || "", image_url: item.image_url || "", highlights: (item.highlights || []).join(", ") });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("destinations").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Destinations</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setForm({ name: "", description: "", location: "", image_url: "", highlights: "" }); } }}>
          <DialogTrigger asChild><Button className="font-body"><Plus className="w-4 h-4 mr-2" /> Add</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit" : "Add"} Destination</DialogTitle></DialogHeader>
            <div className="space-y-4 font-body">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
              <div><Label>Highlights (comma-separated)</Label><Input value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} /></div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead><tr className="border-b bg-muted/50"><th className="text-left p-3">Name</th><th className="text-left p-3 hidden sm:table-cell">Location</th><th className="text-left p-3 hidden md:table-cell">Highlights</th><th className="p-3 w-24">Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3 text-muted-foreground hidden sm:table-cell">{item.location}</td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{(item.highlights || []).join(", ")}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No destinations yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDestinations;
