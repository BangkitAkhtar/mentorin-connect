import { useApp } from "@/context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { DAYS } from "@/types";
import { Calendar, GraduationCap } from "lucide-react";
import { formatDistanceToNow } from "@/lib/format";
import { EmptyState } from "@/components/EmptyState";

export default function TutorProfile() {
  const { id } = useParams();
  const nav = useNavigate();
  const { tutors, admins, classes, reviews, mahasiswa } = useApp();
  const allTutors = [...tutors, ...admins];
  const tutor = allTutors.find(t => t.id === id);
  if (!tutor) return <div>Tutor tidak ditemukan</div>;

  const tutorClasses = classes.filter(c => c.tutorId === tutor.id && c.active);
  const tutorReviews = reviews.filter(r => r.tutorId === tutor.id).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border bg-card p-6 shadow-card">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <img src={tutor.avatar} alt={tutor.name} className="h-24 w-24 rounded-2xl bg-muted" />
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold">{tutor.name}</h1>
            <p className="text-sm text-muted-foreground">{tutor.major} · {tutor.university}</p>
            <div className="mt-2"><RatingStars value={tutor.rating} showNumber count={tutor.reviewCount} /></div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed">{tutor.bio || "Tidak ada biografi."}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(tutor.subjects || []).map(s => <span key={s} className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">{s}</span>)}
            </div>
          </div>
          <div>
            <Button size="lg" className="gap-2" onClick={() => nav(`/app/booking/${tutor.id}`)}>
              <Calendar className="h-4 w-4" /> Booking Sesi Privat
            </Button>
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold">Jadwal Ketersediaan</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DAYS.map(d => {
            const slots = (tutor.availability || {})[d] || [];
            return (
              <div key={d} className="rounded-xl border bg-card p-4 shadow-card">
                <div className="text-sm font-semibold">{d}</div>
                {slots.length === 0 ? (
                  <div className="mt-2 text-xs text-muted-foreground">—</div>
                ) : (
                  <div className="mt-2 space-y-1.5">
                    {slots.map(s => <div key={s} className="rounded-md bg-primary-soft px-2 py-1 text-xs font-medium text-primary">{s}</div>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold">Kelas yang dibuka</h2>
        {tutorClasses.length === 0 ? (
          <EmptyState icon={<GraduationCap className="h-6 w-6" />} title="Belum ada kelas" description="Tutor ini belum membuka kelas. Kamu masih bisa booking sesi privat." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {tutorClasses.map(c => (
              <div key={c.id} className="rounded-xl border bg-card p-4 shadow-card">
                <div className="text-xs font-semibold text-primary">{c.subject}</div>
                <div className="mt-1 font-display font-semibold">{c.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{c.day} · {c.startTime}–{c.endTime}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold">Ulasan Mahasiswa ({tutorReviews.length})</h2>
        {tutorReviews.length === 0 ? (
          <EmptyState icon={<GraduationCap className="h-6 w-6" />} title="Belum ada ulasan" description="Jadilah yang pertama memberi ulasan setelah sesi." />
        ) : (
          <div className="space-y-3">
            {tutorReviews.map(r => {
              const m = mahasiswa.find(x => x.id === r.mahasiswaId);
              return (
                <div key={r.id} className="rounded-xl border bg-card p-4 shadow-card">
                  <div className="flex items-center gap-3">
                    <img src={m?.avatar} alt="" className="h-9 w-9 rounded-full bg-muted" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{m?.name || "Anonim"}</div>
                      <div className="text-[11px] text-muted-foreground">{formatDistanceToNow(r.createdAt)}</div>
                    </div>
                    <RatingStars value={r.rating} />
                  </div>
                  <p className="mt-3 text-sm text-foreground/80">{r.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
