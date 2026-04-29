import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DAYS, SUBJECTS } from "@/types";
import { toast } from "sonner";
import { Lightbulb } from "lucide-react";
import { formatDistanceToNow } from "@/lib/format";
import { EmptyState } from "@/components/EmptyState";

export default function Usulan() {
  const { proposed, currentUser, addProposed, mahasiswa, tutors } = useApp();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [day, setDay] = useState(DAYS[0]);
  const [time, setTime] = useState("10:00");
  const [desc, setDesc] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) { toast.error("Judul dan deskripsi wajib"); return; }
    addProposed({ mahasiswaId: currentUser!.id, title: title.trim(), subject, preferredDay: day, preferredTime: time, description: desc.trim() });
    toast.success("Usulan terkirim ke tutor!");
    setTitle(""); setDesc("");
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Saran Kelas" description="Usulkan kelas yang kamu butuhkan — tutor bisa langsung membuka kelasnya." />

      <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-card">
        <div><Label>Judul kelas</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Persiapan UTS Statistika" /></div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Mata kuliah</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Preferensi hari</Label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Preferensi jam</Label><Input type="time" value={time} onChange={e => setTime(e.target.value)} /></div>
        </div>
        <div><Label>Deskripsi kebutuhan</Label><Textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ceritakan materi apa yang ingin dipelajari..." /></div>
        <Button type="submit" className="gap-2"><Lightbulb className="h-4 w-4" />Kirim Usulan</Button>
      </form>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold">Usulan terbaru dari mahasiswa</h2>
        {proposed.length === 0 ? (
          <EmptyState icon={<Lightbulb className="h-6 w-6" />} title="Belum ada usulan" description="Jadilah yang pertama mengusulkan kelas." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {proposed.map(p => {
              const m = mahasiswa.find(x => x.id === p.mahasiswaId);
              const acceptedTutor = p.acceptedBy ? tutors.find(t => t.id === p.acceptedBy) : null;
              return (
                <div key={p.id} className="rounded-xl border bg-card p-4 shadow-card">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">{p.subject}</span>
                      <h3 className="mt-2 font-display font-semibold">{p.title}</h3>
                    </div>
                    {acceptedTutor && <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">Dibuka oleh {acceptedTutor.name.split(" ")[0]}</span>}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{p.preferredDay} · {p.preferredTime}</span>
                    <span>oleh {m?.name} · {formatDistanceToNow(p.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
