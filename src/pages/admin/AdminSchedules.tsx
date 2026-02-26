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

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

const AdminSchedules = () => {
  const [items, setItems] = useState<any[]>([]);
  const [cleaners, setCleaners] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ cleaner_id: "", hotel_id: "", scheduled_date: "", status: "pending" as "pending" | "in_progress" | "completed", notes: "" });
  const { toast } = useToast();

  const fetchData = async () => {
    const [{ data: s }, { data: c }, { data: h }] = await Promise.all([
      supabase.from("cleaning_schedules").select("*, cleaners(full_name), hotels(name)").order("scheduled_date", { ascending: false }),
      supabase.from("cleaners").select("id, full_name"),
      supabase.from("hotels").select("id, name"),
    ]);
    setItems(s || []); setCleaners(c || []); setHotels(h || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (editing) {
      const { error } = await supabase.from("cleaning_schedules").update(form).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("cleaning_schedules").insert(form);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: editing ? "Updated" : "Created" });
    setOpen(false); setEditing(null); fetchData();
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ cleaner_id: item.cleaner_id, hotel_id: item.hotel_id, scheduled_date: item.scheduled_date, status: item.status, notes: item.notes || "" });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("cleaning_schedules").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Cleaning Schedules</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild><Button className="font-body"><Plus className="w-4 h-4 mr-2" /> Add</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit" : "Add"} Schedule</DialogTitle></DialogHeader>
            <div className="space-y-4 font-body">
              <div>
                <Label>Cleaner</Label>
                <Select value={form.cleaner_id} onValueChange={(v) => setForm({ ...form, cleaner_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select cleaner" /></SelectTrigger>
                  <SelectContent>{cleaners.map((c) => <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Hotel</Label>
                <Select value={form.hotel_id} onValueChange={(v) => setForm({ ...form, hotel_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select hotel" /></SelectTrigger>
                  <SelectContent>{hotels.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Date</Label><Input type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} /></div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v: "pending" | "in_progress" | "completed") => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Notes</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead><tr className="border-b bg-muted/50"><th className="text-left p-3">Cleaner</th><th className="text-left p-3 hidden sm:table-cell">Hotel</th><th className="text-left p-3">Date</th><th className="text-left p-3">Status</th><th className="p-3 w-24">Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{(item as any).cleaners?.full_name}</td>
                <td className="p-3 text-muted-foreground hidden sm:table-cell">{(item as any).hotels?.name}</td>
                <td className="p-3">{new Date(item.scheduled_date).toLocaleDateString()}</td>
                <td className="p-3"><Badge className={statusColors[item.status] || ""}>{item.status.replace("_", " ")}</Badge></td>
                <td className="p-3"><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button><Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No schedules yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSchedules;
