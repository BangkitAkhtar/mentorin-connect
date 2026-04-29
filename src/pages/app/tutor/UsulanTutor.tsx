import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { formatDistanceToNow } from "@/lib/format";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";

export default function UsulanTutor() {
  const { proposed, mahasiswa, acceptProposed, currentUser } = useApp();

  return (
    <div className="space-y-6">
      <PageHeader title="Saran Kelas dari Mahasiswa" description="Buka kelas berdasarkan kebutuhan mahasiswa." />
      {proposed.length === 0 ? (
        <EmptyState icon={<Lightbulb className="h-6 w-6" />} title="Belum ada usulan" description="Usulan kelas dari mahasiswa akan muncul di sini." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {proposed.map(p => {
            const m = mahasiswa.find(x => x.id === p.mahasiswaId);
            return (
              <div key={p.id} className="rounded-xl border bg-card p-5 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">{p.subject}</span>
                    <h3 className="mt-2 font-display text-lg font-semibold">{p.title}</h3>
                  </div>
                  {p.acceptedBy && <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">Telah dibuka</span>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-3 text-xs text-muted-foreground">{p.preferredDay} · {p.preferredTime} · oleh {m?.name} · {formatDistanceToNow(p.createdAt)}</div>
                {!p.acceptedBy && (
                  <Button className="mt-4 gap-2" size="sm" onClick={() => { acceptProposed(p.id, currentUser!.id); toast.success("Kelas baru dibuat dari usulan ini"); }}>
                    <Lightbulb className="h-4 w-4" />Buka Kelas Ini
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
