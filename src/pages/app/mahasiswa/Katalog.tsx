import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DAYS, SUBJECTS } from "@/types";
import { RatingStars } from "@/components/RatingStars";
import { Search, Calendar, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { EmptyState } from "@/components/EmptyState";

export default function Katalog() {
  const { classes, tutors, currentUser, enrollClass } = useApp();
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("all");
  const [day, setDay] = useState("all");
  const [minRating, setMinRating] = useState("all");

  const filtered = useMemo(() => classes.filter(c => {
    if (!c.active) return false;
    const tutor = tutors.find(t => t.id === c.tutorId);
    if (q && !`${c.title} ${c.subject} ${tutor?.name}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (subject !== "all" && c.subject !== subject) return false;
    if (day !== "all" && c.day !== day) return false;
    if (minRating !== "all" && (tutor?.rating || 0) < Number(minRating)) return false;
    return true;
  }), [classes, tutors, q, subject, day, minRating]);

  return (
    <div className="space-y-6">
      <PageHeader title="Katalog Kelas" description="Telusuri kelas yang dibuka tutor sebaya BINUS." />

      <div className="rounded-2xl border bg-card p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Cari nama kelas atau mata kuliah..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="md:w-44"><SelectValue placeholder="Mata kuliah" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua mata kuliah</SelectItem>
              {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger className="md:w-36"><SelectValue placeholder="Hari" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua hari</SelectItem>
              {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger className="md:w-32"><SelectValue placeholder="Rating" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua rating</SelectItem>
              <SelectItem value="4">≥ 4.0</SelectItem>
              <SelectItem value="4.5">≥ 4.5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Search className="h-6 w-6" />} title="Tidak ada kelas cocok" description="Coba ubah filter atau kata kunci pencarian." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(c => {
            const tutor = tutors.find(t => t.id === c.tutorId)!;
            const sisa = c.capacity - c.enrolled.length;
            const enrolled = currentUser ? c.enrolled.includes(currentUser.id) : false;
            return (
              <div key={c.id} className="group flex animate-fade-in flex-col rounded-2xl border bg-card p-5 shadow-card hover-lift">
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold text-primary">{c.subject}</span>
                  <span className="text-xs text-muted-foreground">{sisa} / {c.capacity} slot</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>

                <Link to={`/app/tutor/${tutor.id}`} className="mt-4 flex items-center gap-3 rounded-lg border bg-muted/30 p-2.5 transition hover:bg-muted/60">
                  <img src={tutor.avatar} alt="" className="h-9 w-9 rounded-full bg-muted" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{tutor.name}</div>
                    <RatingStars value={tutor.rating} size={11} />
                  </div>
                </Link>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{c.day}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{c.startTime}–{c.endTime}</span>
                  <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{c.enrolled.length} terdaftar</span>
                </div>

                <Button
                  className="mt-5"
                  disabled={enrolled || sisa === 0}
                  onClick={() => { enrollClass(c.id, currentUser!.id); toast.success("Berhasil daftar kelas!"); }}
                >
                  {enrolled ? "Sudah Terdaftar" : sisa === 0 ? "Kuota Penuh" : "Daftar Kelas"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
