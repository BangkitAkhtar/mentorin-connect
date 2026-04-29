import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { RatingStars } from "@/components/RatingStars";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function TutorList() {
  const { tutors } = useApp();
  const [q, setQ] = useState("");
  const filtered = tutors.filter(t => `${t.name} ${t.major} ${t.subjects.join(" ")}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Daftar Tutor" description="Pilih tutor untuk booking sesi privat." />
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Cari nama, jurusan, atau mata kuliah" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(t => (
          <Link key={t.id} to={`/app/tutor/${t.id}`} className="group block animate-fade-in rounded-2xl border bg-card p-5 shadow-card hover-lift">
            <div className="flex items-center gap-3">
              <img src={t.avatar} alt={t.name} className="h-14 w-14 rounded-full bg-muted" />
              <div>
                <div className="font-display font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.major}</div>
              </div>
            </div>
            <div className="mt-3"><RatingStars value={t.rating} showNumber count={t.reviewCount} /></div>
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{t.bio}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {t.subjects.slice(0, 3).map(s => <span key={s} className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">{s}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
