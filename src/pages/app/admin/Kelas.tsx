import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Power } from "lucide-react";
import { toast } from "sonner";

export default function AdminKelas() {
  const { classes, tutors, upsertClass, deleteClass } = useApp();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => classes.filter(c => {
    const t = tutors.find(x => x.id === c.tutorId);
    return `${c.title} ${c.subject} ${t?.name}`.toLowerCase().includes(q.toLowerCase());
  }), [classes, tutors, q]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Kelola Kelas" description={`Total: ${classes.length} kelas (${classes.filter(c => c.active).length} aktif).`} />
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Cari judul, mata kuliah, atau tutor..." value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <DataTable
        rows={filtered}
        empty="Tidak ada kelas"
        columns={[
          { key: "title", header: "Kelas", render: c => (
            <div>
              <div className="font-medium">{c.title}</div>
              <div className="text-xs text-muted-foreground">{c.subject}</div>
            </div>
          ) },
          { key: "tutor", header: "Tutor", render: c => tutors.find(t => t.id === c.tutorId)?.name || "-" },
          { key: "sched", header: "Jadwal", render: c => `${c.day} · ${c.startTime}–${c.endTime}` },
          { key: "cap", header: "Kapasitas", render: c => `${c.enrolled.length} / ${c.capacity}` },
          { key: "status", header: "Status", render: c => (
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${c.active ? "border-success/20 bg-success/10 text-success" : "border-muted bg-muted text-muted-foreground"}`}>
              {c.active ? "Aktif" : "Nonaktif"}
            </span>
          ) },
          { key: "act", header: "Aksi", className: "text-right", render: c => (
            <div className="flex justify-end gap-1">
              <Button size="sm" variant="ghost" className="hover-scale" onClick={() => { upsertClass({ ...c, active: !c.active }); toast(c.active ? "Kelas dinonaktifkan" : "Kelas diaktifkan"); }}>
                <Power className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="hover-scale" onClick={() => { if (confirm(`Hapus kelas "${c.title}"?`)) { deleteClass(c.id); toast.success("Kelas dihapus"); } }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ) },
        ]}
      />
    </div>
  );
}
