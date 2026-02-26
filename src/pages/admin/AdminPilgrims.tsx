import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

const AdminPilgrims = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      setProfiles(data || []);
    };
    fetch();
  }, []);

  const filtered = profiles.filter((p) =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Pilgrims</h2>
        <Input className="max-w-xs font-body" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead><tr className="border-b bg-muted/50"><th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3 hidden sm:table-cell">Phone</th><th className="text-left p-3 hidden md:table-cell">Joined</th></tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{p.full_name || "—"}</td>
                <td className="p-3 text-muted-foreground">{p.email}</td>
                <td className="p-3 text-muted-foreground hidden sm:table-cell">{p.phone || "—"}</td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No pilgrims found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPilgrims;
