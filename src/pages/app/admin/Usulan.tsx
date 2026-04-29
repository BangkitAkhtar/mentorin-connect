import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "@/lib/format";

export default function AdminUsulan() {
  const { proposed, mahasiswa, tutors, adminDeleteProposed } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Saran Kelas" description={`Total: ${proposed.length} usulan.`} />
      <DataTable
        rows={proposed.sort((a, b) => b.createdAt - a.createdAt)}
        empty="Tidak ada usulan"
        columns={[
          { key: "title", header: "Judul", render: p => (
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.subject}</div>
            </div>
          ) },
          { key: "by", header: "Oleh", render: p => mahasiswa.find(m => m.id === p.mahasiswaId)?.name || "-" },
          { key: "pref", header: "Preferensi", render: p => `${p.preferredDay} · ${p.preferredTime}` },
          { key: "status", header: "Status", render: p => p.acceptedBy
            ? <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">Dibuka oleh {tutors.find(t => t.id === p.acceptedBy)?.name}</span>
            : <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">Menunggu</span> },
          { key: "when", header: "Dibuat", render: p => formatDistanceToNow(p.createdAt) },
          { key: "act", header: "Aksi", className: "text-right", render: p => (
            <Button size="sm" variant="ghost" className="hover-scale" onClick={() => { if (confirm("Hapus usulan?")) { adminDeleteProposed(p.id); toast.success("Dihapus"); } }}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          ) },
        ]}
      />
    </div>
  );
}
