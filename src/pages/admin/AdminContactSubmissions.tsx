import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, MailOpen, Trash2, Reply } from "lucide-react";

const AdminContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setSubmissions(data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const toggleRead = async (id: string, currentRead: boolean) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ is_read: !currentRead })
      .eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchData();
  };

  const deleteSubmission = async (id: string) => {
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchData(); }
  };

  const filtered = submissions.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.subject.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = submissions.filter((s) => !s.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-bold">Contact Submissions</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} new</Badge>
          )}
        </div>
        <Input className="max-w-xs font-body" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bg-card border rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3 hidden sm:table-cell">Email</th>
              <th className="text-left p-3">Subject</th>
              <th className="text-left p-3 hidden md:table-cell">Date</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <>
                <tr
                  key={s.id}
                  className={`border-b last:border-0 hover:bg-muted/30 cursor-pointer ${!s.is_read ? "bg-primary/5" : ""}`}
                  onClick={() => {
                    setExpanded(expanded === s.id ? null : s.id);
                    if (!s.is_read) toggleRead(s.id, false);
                  }}
                >
                  <td className="p-3">
                    {s.is_read ? (
                      <MailOpen className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Mail className="w-4 h-4 text-primary" />
                    )}
                  </td>
                  <td className={`p-3 ${!s.is_read ? "font-semibold" : ""}`}>{s.name}</td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">{s.email}</td>
                  <td className={`p-3 ${!s.is_read ? "font-semibold" : ""}`}>{s.subject}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button size="icon" variant="ghost" onClick={() => toggleRead(s.id, s.is_read)}>
                        {s.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteSubmission(s.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                {expanded === s.id && (
                  <tr key={`${s.id}-detail`} className="border-b">
                    <td colSpan={6} className="p-4 bg-muted/20">
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{s.email}</span>
                          {s.phone && <span>{s.phone}</span>}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{s.message}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No submissions found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContactSubmissions;
