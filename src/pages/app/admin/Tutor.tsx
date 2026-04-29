import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TutorProfile, SUBJECTS } from "@/types";
import { RatingStars } from "@/components/RatingStars";

function EditDialog({ user, onSave }: { user: TutorProfile; onSave: (p: any) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [major, setMajor] = useState(user.major);
  const [bio, setBio] = useState(user.bio);
  const [subjects, setSubjects] = useState<string[]>(user.subjects);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="ghost" className="hover-scale"><Pencil className="h-4 w-4" /></Button></DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Edit Tutor</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Nama</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
            <div><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} /></div>
          </div>
          <div><Label>Jurusan</Label><Input value={major} onChange={e => setMajor(e.target.value)} /></div>
          <div><Label>Bio</Label><Textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} /></div>
          <div>
            <Label>Mata kuliah</Label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SUBJECTS.map(s => {
                const active = subjects.includes(s);
                return (
                  <button key={s} type="button" onClick={() => setSubjects(p => active ? p.filter(x => x !== s) : [...p, s])}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${active ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/40"}`}>{s}</button>
                );
              })}
            </div>
          </div>
          <Button onClick={() => { onSave({ name, email, major, bio, subjects }); toast.success("Tutor diupdate"); setOpen(false); }}>Simpan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminTutor() {
  const { tutors, classes, adminUpdateUser, adminDeleteUser } = useApp();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => tutors.filter(t => `${t.name} ${t.email} ${t.subjects.join(" ")}`.toLowerCase().includes(q.toLowerCase())), [tutors, q]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Kelola Tutor" description={`Total: ${tutors.length} tutor terdaftar.`} />
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Cari nama, email, mata kuliah..." value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <DataTable
        rows={filtered}
        empty="Tidak ada tutor"
        columns={[
          { key: "u", header: "Tutor", render: t => (
            <div className="flex items-center gap-3">
              <img src={t.avatar} alt="" className="h-9 w-9 rounded-full bg-muted" />
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.email}</div>
              </div>
            </div>
          ) },
          { key: "maj", header: "Jurusan", render: t => t.major },
          { key: "subj", header: "Mata Kuliah", render: t => (
            <div className="flex flex-wrap gap-1">
              {t.subjects.slice(0, 2).map(s => <span key={s} className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary">{s}</span>)}
              {t.subjects.length > 2 && <span className="text-[10px] text-muted-foreground">+{t.subjects.length - 2}</span>}
            </div>
          ) },
          { key: "r", header: "Rating", render: t => <RatingStars value={t.rating} showNumber count={t.reviewCount} size={12} /> },
          { key: "c", header: "Kelas", render: t => classes.filter(c => c.tutorId === t.id).length },
          { key: "act", header: "Aksi", className: "text-right", render: t => (
            <div className="flex justify-end gap-1">
              <EditDialog user={t} onSave={p => adminUpdateUser(t.id, "tutor", p)} />
              <Button size="sm" variant="ghost" className="hover-scale" onClick={() => {
                if (confirm(`Hapus ${t.name}? Kelas, booking & review-nya juga akan terhapus.`)) {
                  adminDeleteUser(t.id, "tutor"); toast.success("Tutor dihapus");
                }
              }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ) },
        ]}
      />
    </div>
  );
}
