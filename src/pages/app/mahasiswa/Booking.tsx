import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DAYS } from "@/types";
import { toast } from "sonner";

export default function Booking() {
  const { tutorId } = useParams();
  const nav = useNavigate();
  const { tutors, currentUser, createBooking } = useApp();
  const tutor = tutors.find(t => t.id === tutorId);
  const [subject, setSubject] = useState(tutor?.subjects[0] || "");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [topic, setTopic] = useState("");

  if (!tutor) return <div>Tutor tidak ditemukan</div>;

  const availableDays = DAYS.filter(d => (tutor.availability[d] || []).length > 0);
  const slots = day ? (tutor.availability[day] || []) : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !day || !time || !topic.trim()) { toast.error("Lengkapi semua kolom"); return; }
    createBooking({ mahasiswaId: currentUser!.id, tutorId: tutor.id, subject, day, time, topic: topic.trim() });
    toast.success("Booking terkirim! Menunggu konfirmasi tutor.");
    nav("/app/riwayat");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Booking Sesi Privat" description={`Booking dengan ${tutor.name}`} />
      <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-6 shadow-card">
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          <img src={tutor.avatar} alt="" className="h-12 w-12 rounded-full bg-muted" />
          <div>
            <div className="font-semibold">{tutor.name}</div>
            <div className="text-xs text-muted-foreground">{tutor.major}</div>
          </div>
        </div>

        <div>
          <Label>Mata kuliah</Label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger><SelectValue placeholder="Pilih mata kuliah" /></SelectTrigger>
            <SelectContent>{tutor.subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Hari</Label>
            <Select value={day} onValueChange={v => { setDay(v); setTime(""); }}>
              <SelectTrigger><SelectValue placeholder="Pilih hari" /></SelectTrigger>
              <SelectContent>{availableDays.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Jam</Label>
            <Select value={time} onValueChange={setTime} disabled={!day}>
              <SelectTrigger><SelectValue placeholder={day ? "Pilih slot" : "Pilih hari dulu"} /></SelectTrigger>
              <SelectContent>{slots.map(s => <SelectItem key={s} value={s.split("-")[0]}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Topik / pertanyaan yang ingin dibahas</Label>
          <Textarea rows={4} value={topic} onChange={e => setTopic(e.target.value)} placeholder="Contoh: Latihan soal turunan dan integral untuk UTS minggu depan." />
        </div>

        <div className="flex gap-3">
          <Button type="submit">Kirim Booking</Button>
          <Button type="button" variant="outline" onClick={() => nav(-1)}>Batal</Button>
        </div>
      </form>
    </div>
  );
}
