 import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ClassItem, DAYS, SUBJECTS, TutorProfile } from "@/types";
import { toast } from "sonner";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

function ClassForm({ initial, onSubmit, onClose }: { initial?: ClassItem; onSubmit: (c: ClassItem) => void; onClose: () => void }) {
  const { currentUser } = useApp();
  const t = currentUser as TutorProfile;
  const subjects = t.subjects || [];
  const [title, setTitle] = useState(initial?.title || "");
  const [subject, setSubject] = useState(initial?.subject || (subjects[0] || SUBJECTS[0]));
  const [description, setDescription] = useState(initial?.description || "");
  const [day, setDay] = useState(initial?.day || DAYS[0]);
  const [startTime, setStartTime] = useState(initial?.startTime || "10:00");
  const [endTime, setEndTime] = useState(initial?.endTime || "12:00");
  const [capacity, setCapacity] = useState(initial?.capacity || 8);
  const [meetingLink, setMeetingLink] = useState(initial?.meetingLink || "");
  const [materials, setMaterials] = useState(initial?.materials || "");

  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (!title.trim()) { toast.error("Judul wajib"); return; }
      onSubmit({
        id: initial?.id || "c_" + Math.random().toString(36).slice(2, 10),
        tutorId: t.id, title: title.trim(), subject, description: description.trim(),
        day, startTime, endTime, capacity, enrolled: initial?.enrolled || [], active: true,
        meetingLink: meetingLink.trim(), materials: materials.trim()
      });
      onClose();
    }} className="space-y-4">
      <div><Label>Judul kelas</Label><Input value={title} onChange={e => setTitle(e.target.value)} required /></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Mata kuliah</Label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{(subjects.length ? subjects : SUBJECTS).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Hari</Label>
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Jam mulai</Label><Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} /></div>
        <div><Label>Jam selesai</Label><Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label>Kuota maksimal</Label><Input type="number" min={1} max={50} value={capacity} onChange={e => setCapacity(Number(e.target.value))} /></div>
      </div>
      <div><Label>Link Zoom / Google Meet</Label><Input type="url" placeholder="https://zoom.us/j/..." value={meetingLink} onChange={e => setMeetingLink(e.target.value)} /></div>
      <div><Label>Link Materi / Drive</Label><Input type="url" placeholder="https://drive.google.com/..." value={materials} onChange={e => setMaterials(e.target.value)} /></div>
      <div><Label>Deskripsi</Label><Textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} /></div>
      <Button type="submit" className="w-full">{initial ? "Update" : "Buat Kelas"}</Button>
    </form>
  );
}

export default function KelasSaya() {
  const { classes, currentUser, upsertClass, deleteClass, completeClass } = useApp();
  const mine = classes.filter(c => c.tutorId === currentUser!.id);
  const [openNew, setOpenNew] = useState(false);
  const [edit, setEdit] = useState<ClassItem | null>(null);
  const [confirmComplete, setConfirmComplete] = useState<string | null>(null);

  const handleComplete = async (classId: string) => {
    await completeClass(classId);
    toast.success("Kelas ditandai selesai!");
    setConfirmComplete(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Kelas"
        description="Buat dan kelola kelas yang kamu tawarkan."
        action={
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Buat Kelas</Button></DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Buat Kelas Baru</DialogTitle></DialogHeader><ClassForm onSubmit={c => { upsertClass(c); toast.success("Kelas dibuat"); }} onClose={() => setOpenNew(false)} /></DialogContent>
          </Dialog>
        }
      />

      {mine.length === 0 ? (
        <EmptyState icon={<BookOpen className="h-6 w-6" />} title="Belum ada kelas" description="Buat kelas pertama untuk dilihat mahasiswa." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {mine.map(c => (
            <div key={c.id} className={`rounded-2xl border bg-card p-5 shadow-card ${c.completed ? "opacity-80" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold text-primary">{c.subject}</span>
                  {c.completed && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      ✓ Kelas Selesai
                    </span>
                  )}
                  {!c.completed && !c.active && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      Ditutup
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{c.enrolled.length}/{c.capacity} terdaftar</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-3 text-xs text-muted-foreground">{c.day} · {c.startTime}–{c.endTime}</div>

              {c.completed ? (
                <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3 text-center text-sm text-emerald-700 dark:text-emerald-300">
                  Kelas ini sudah selesai. Mahasiswa dapat memberikan review.
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Dialog open={edit?.id === c.id} onOpenChange={o => !o && setEdit(null)}>
                    <DialogTrigger asChild><Button size="sm" variant="outline" onClick={() => setEdit(c)}>Edit</Button></DialogTrigger>
                    <DialogContent><DialogHeader><DialogTitle>Edit Kelas</DialogTitle></DialogHeader>{edit && <ClassForm initial={edit} onSubmit={c => { upsertClass(c); toast.success("Kelas diupdate"); }} onClose={() => setEdit(null)} />}</DialogContent>
                  </Dialog>
                  <Button size="sm" variant="outline" onClick={() => { upsertClass({ ...c, active: !c.active }); toast(c.active ? "Kelas ditutup" : "Kelas dibuka kembali"); }}>{c.active ? "Tutup" : "Buka"}</Button>

                  {/* Selesai Button with Confirmation */}
                  <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setConfirmComplete(c.id)}>
                    ✓ Selesai
                  </Button>

                  <Button size="sm" variant="ghost" onClick={() => { deleteClass(c.id); toast("Kelas dihapus"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog (rendered once outside the loop) */}
      <Dialog open={confirmComplete !== null} onOpenChange={o => !o && setConfirmComplete(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Selesaikan Kelas?</DialogTitle></DialogHeader>
          {confirmComplete && (() => {
            const c = classes.find(x => x.id === confirmComplete);
            if (!c) return null;
            return (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Kelas <strong>"{c.title}"</strong> akan ditandai sebagai selesai. Hal ini akan:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Menutup kelas secara permanen</li>
                  <li>Menandai semua booking terkait sebagai "Selesai"</li>
                  <li>Mengirim notifikasi ke {c.enrolled.length} mahasiswa untuk memberikan review</li>
                </ul>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setConfirmComplete(null)}>Batal</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleComplete(c.id)}>
                    Ya, Selesaikan Kelas
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
