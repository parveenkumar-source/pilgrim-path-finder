import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, CheckCircle, Clock, Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

const CleanerPortal = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cleanerId, setCleanerId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchTasks = async () => {
      const { data: cleaner } = await supabase.from("cleaners").select("id").eq("user_id", user.id).maybeSingle();
      if (!cleaner) { setLoading(false); return; }
      setCleanerId(cleaner.id);
      const { data } = await supabase
        .from("cleaning_schedules")
        .select("*, hotels(name)")
        .eq("cleaner_id", cleaner.id)
        .order("scheduled_date", { ascending: true });
      setTasks(data || []);
      setLoading(false);
    };
    fetchTasks();
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("cleaning_schedules").update({ status: status as "pending" | "in_progress" | "completed" }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Status updated" });
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b bg-card flex items-center justify-between px-4">
        <h1 className="font-display text-xl font-bold">🧹 Cleaner Portal</h1>
        <Button variant="ghost" onClick={signOut} className="font-body"><LogOut className="w-4 h-4 mr-2" /> Sign Out</Button>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="font-display text-2xl font-bold mb-6">My Tasks</h2>

        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
        ) : !cleanerId ? (
          <p className="font-body text-muted-foreground text-center py-8">You are not assigned as a cleaner yet. Contact your admin.</p>
        ) : tasks.length === 0 ? (
          <p className="font-body text-muted-foreground text-center py-8">No tasks assigned yet.</p>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-card border rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{(task as any).hotels?.name}</h3>
                    <p className="font-body text-sm text-muted-foreground">
                      {new Date(task.scheduled_date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    {task.notes && <p className="font-body text-xs text-muted-foreground mt-1">Note: {task.notes}</p>}
                    <Badge className={`mt-2 ${statusColors[task.status] || ""}`}>{task.status.replace("_", " ")}</Badge>
                  </div>
                  <div className="flex gap-2">
                    {task.status === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(task.id, "in_progress")} className="font-body">
                        <Loader2 className="w-4 h-4 mr-1" /> Start
                      </Button>
                    )}
                    {task.status === "in_progress" && (
                      <Button size="sm" onClick={() => updateStatus(task.id, "completed")} className="font-body">
                        <CheckCircle className="w-4 h-4 mr-1" /> Complete
                      </Button>
                    )}
                    {task.status === "completed" && (
                      <span className="text-green-600 font-body text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Done</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CleanerPortal;
