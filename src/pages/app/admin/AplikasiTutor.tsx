import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Eye, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { TutorApplication } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";

function DetailDialog({ a }: { a: TutorApplication }) {
  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm" variant="ghost" className="hover-scale"><Eye className="h-4 w-4" /></Button></DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Detail Aplikasi — {a.name}</DialogTitle></DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div><div className="text-xs text-muted-foreground">Email</div><div className="font-medium">{a.email}</div></div>
            <div><div className="text-xs text-muted-foreground">Universitas</div><div className="font-medium">{a.university}</div></div>
            <div><div className="text-xs text-muted-foreground">Jurusan</div><div className="font-medium">{a.major || "—"}</div></div>
            <div><div className="text-xs text-muted-foreground">Semester</div><div className="font-medium">{a.semester || "—"}</div></div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Mata kuliah</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {a.subjects.map(s => <span key={s} className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">{s}</span>)}
            </div>
          </div>
          {a.bio && <div><div className="text-xs text-muted-foreground">Bio</div><p className="mt-1">{a.bio}</p></div>}
          <div><div className="text-xs text-muted-foreground">Motivasi</div><p className="mt-1">{a.motivation}</p></div>
          {a.experience && <div><div className="text-xs text-muted-foreground">Pengalaman</div><p className="mt-1">{a.experience}</p></div>}
          <div className="rounded-lg bg-muted/40 p-3 text-xs">
            Status: <StatusBadge status={a.status as any} /> · Dikirim {formatDate(a.createdAt)}
            {a.reviewNote && <div className="mt-1">Catatan: {a.reviewNote}</div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RejectDialog({ onReject }: { onReject: (note: string) => void }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="hover-scale"><X className="h-4 w-4 text-destructive" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Tolak Aplikasi</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Label>Catatan (opsional)</Label>
          <Textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Alasan penolakan..." />
          <Button variant="destructive" onClick={() => { onReject(note); setOpen(false); }}>Tolak</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminAplikasiTutor() {
  const { tutorApplications, approveTutorApplication, rejectTutorApplication, deleteTutorApplication } = useApp();
  const [q, setQ] = useState("");
  const filtered = useMemo(() =>
    tutorApplications.filter(a => `${a.name} ${a.email} ${a.subjects.join(" ")}`.toLowerCase().includes(q.toLowerCase())),
  [tutorApplications, q]);

  const pending = tutorApplications.filter(a => a.status === "Pending").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Aplikasi Tutor"
        description={`${tutorApplications.length} aplikasi · ${pending} menunggu review`}
      />
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Cari nama, email, mata kuliah..." value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <DataTable
        rows={filtered}
        empty="Belum ada aplikasi tutor masuk"
        columns={[
          { key: "n", header: "Pelamar", render: a => (
            <div>
              <div className="font-medium">{a.name}</div>
              <div className="text-xs text-muted-foreground">{a.email}</div>
            </div>
          ) },
          { key: "maj", header: "Jurusan", render: a => <span className="text-sm">{a.major || "—"}</span> },
          { key: "sub", header: "Mata Kuliah", render: a => (
            <div className="flex flex-wrap gap-1">
              {a.subjects.slice(0, 2).map(s => <span key={s} className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary">{s}</span>)}
              {a.subjects.length > 2 && <span className="text-[10px] text-muted-foreground">+{a.subjects.length - 2}</span>}
            </div>
          ) },
          { key: "d", header: "Tanggal", render: a => <span className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</span> },
          { key: "s", header: "Status", render: a => <StatusBadge status={a.status as any} /> },
          { key: "act", header: "Aksi", className: "text-right", render: a => (
            <div className="flex justify-end gap-1">
              <DetailDialog a={a} />
              {a.status === "Pending" && (
                <>
                  <Button size="sm" variant="ghost" className="hover-scale" onClick={() => {
                    approveTutorApplication(a.id);
                    toast.success(`${a.name} dijadikan tutor`);
                  }}><Check className="h-4 w-4 text-accent" /></Button>
                  <RejectDialog onReject={(note) => {
                    rejectTutorApplication(a.id, note);
                    toast.success("Aplikasi ditolak");
                  }} />
                </>
              )}
              <Button size="sm" variant="ghost" className="hover-scale" onClick={() => {
                if (confirm("Hapus aplikasi ini?")) {
                  deleteTutorApplication(a.id); toast.success("Aplikasi dihapus");
                }
              }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ) },
        ]}
      />
    </div>
  );
}
