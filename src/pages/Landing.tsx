import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { RatingStars } from "@/components/RatingStars";
import { AutoMarquee } from "@/components/AutoMarquee";
import { useApp } from "@/context/AppContext";
import {
  ArrowRight, BookOpen, Calendar, Clock, GraduationCap, MessageSquare,
  Quote, ShieldCheck, Sparkles, Users,
} from "lucide-react";

export default function Landing() {
  const { tutors, classes, reviews, mahasiswa } = useApp();
  const featured = tutors.slice(0, 4);
  const tutorById = (id: string) => tutors.find(t => t.id === id);
  const mhsById = (id: string) => mahasiswa.find(m => m.id === id);
  const topReviews = [...reviews].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/"><Logo /></Link>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#fitur" className="story-link text-muted-foreground transition-colors hover:text-foreground">Fitur</a>
            <a href="#cara" className="story-link text-muted-foreground transition-colors hover:text-foreground">Cara Kerja</a>
            <a href="#tutor" className="story-link text-muted-foreground transition-colors hover:text-foreground">Tutor</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Masuk</Button></Link>
            <Link to="/register"><Button size="sm">Daftar</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container relative grid gap-12 py-20 md:grid-cols-2 md:py-28 lg:py-32">
          <div className="flex flex-col justify-center animate-fade-in">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-card">
              <Sparkles className="h-3.5 w-3.5" />
              SASC BINUS Project · SDG 4
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-balance md:text-5xl lg:text-6xl">
              Bimbingan belajar <span className="text-primary">gratis</span>, dari mahasiswa untuk mahasiswa.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              MentorIn menghubungkan kamu dengan tutor sebaya BINUS untuk sesi privat maupun kelas terbuka.
              Belajar fleksibel, materi sesuai kebutuhanmu — semuanya tanpa biaya.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register?role=mahasiswa">
                <Button size="lg" className="gap-2">
                  Mulai Belajar <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/apply-tutor">
                <Button size="lg" variant="outline" className="gap-2">
                  Daftar sebagai Tutor
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> 200+ mahasiswa aktif</div>
              <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-accent" /> 40+ tutor sebaya</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative grid gap-4">
              <div className="animate-fade-in rounded-2xl border bg-card p-5 shadow-elevated transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <img src={tutors[0]?.avatar} alt="" className="h-12 w-12 rounded-full bg-muted" />
                  <div>
                    <div className="font-semibold">{tutors[0]?.name}</div>
                    <div className="text-xs text-muted-foreground">{tutors[0]?.major}</div>
                  </div>
                  <div className="ml-auto"><RatingStars value={tutors[0]?.rating || 5} size={14} /></div>
                </div>
                <div className="mt-4 rounded-xl bg-primary-soft p-3 text-sm">
                  <div className="font-medium text-primary">Algoritma & Pemrograman</div>
                  <div className="text-xs text-muted-foreground">Senin · 14:00–16:00 · Sesi privat</div>
                </div>
              </div>

              <div className="ml-10 animate-fade-in rounded-2xl border bg-card p-5 shadow-elevated transition-transform hover:scale-[1.02]" style={{ animationDelay: "120ms" }}>
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft text-accent">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">Kelas Kalkulus dibuka</div>
                    <div className="text-muted-foreground">8 slot tersedia</div>
                  </div>
                </div>
              </div>

              <div className="animate-fade-in rounded-2xl border bg-card p-5 shadow-elevated transition-transform hover:scale-[1.02]" style={{ animationDelay: "240ms" }}>
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">Chat tersimpan otomatis</div>
                    <div className="text-muted-foreground">Diskusi materi kapan saja</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Kenapa MentorIn?</h2>
          <p className="mt-3 text-muted-foreground">Dirancang untuk kebutuhan belajar mahasiswa yang fleksibel dan kolaboratif.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, color: "text-primary bg-primary-soft", title: "100% Gratis", desc: "Semua sesi tanpa biaya. Murni untuk pembelajaran mahasiswa." },
            { icon: Calendar, color: "text-accent bg-accent-soft", title: "Fleksibel", desc: "Pilih jadwal sesuai ketersediaan tutor dan kebutuhanmu." },
            { icon: Users, color: "text-primary bg-primary-soft", title: "Berbasis Mahasiswa", desc: "Tutor adalah teman sebaya yang paham kurikulum kamu." },
          ].map(f => (
            <div key={f.title} style={{ animationDelay: `${["fade-in"].length * 100}ms` }} className="group animate-fade-in rounded-2xl border bg-card p-6 shadow-card hover-lift">
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${f.color}`}>
                <f.icon className="h-6 w-6 icon-spin-hover" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Katalog Kelas - Auto Marquee */}
      <section id="katalog" className="border-y bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-primary">
              <BookOpen className="h-3.5 w-3.5" /> Katalog Kelas
            </div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Kelas yang sedang dibuka</h2>
            <p className="mt-3 text-muted-foreground">
              Pilihan kelas terbuka dari tutor sebaya — gabung selagi slot masih ada.
            </p>
          </div>
        </div>

        <div className="mt-12 space-y-5">
          <AutoMarquee speed={45} direction="left">
            {classes.map(c => {
              const t = tutorById(c.tutorId);
              const seatsLeft = c.capacity - c.enrolled.length;
              return (
                <div
                  key={c.id}
                  className="w-[320px] shrink-0 rounded-2xl border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                      {c.subject}
                    </span>
                    <span className="text-[11px] font-medium text-accent">
                      {seatsLeft > 0 ? `${seatsLeft} slot` : "Penuh"}
                    </span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 font-display text-base font-semibold">{c.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" /> {c.day}
                    <Clock className="ml-2 h-3.5 w-3.5" /> {c.startTime}–{c.endTime}
                  </div>
                  {t && (
                    <div className="mt-4 flex items-center gap-2 border-t pt-3">
                      <img src={t.avatar} alt="" className="h-8 w-8 rounded-full bg-muted" />
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold">{t.name}</div>
                        <div className="truncate text-[11px] text-muted-foreground">{t.major}</div>
                      </div>
                      <div className="ml-auto"><RatingStars value={t.rating} size={11} /></div>
                    </div>
                  )}
                </div>
              );
            })}
          </AutoMarquee>
        </div>

        <div className="container mt-10 text-center">
          <Link to="/register?role=mahasiswa">
            <Button size="lg" variant="outline" className="gap-2">
              Lihat semua kelas <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Cara kerja */}
      <section id="cara" className="bg-muted/40 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Cara Kerja</h2>
            <p className="mt-3 text-muted-foreground">Empat langkah sederhana untuk mulai belajar.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {[
              { n: "01", t: "Daftar", d: "Buat akun sebagai mahasiswa atau tutor." },
              { n: "02", t: "Cari Tutor", d: "Telusuri katalog kelas dan profil tutor." },
              { n: "03", t: "Booking", d: "Pilih jadwal dan topik yang ingin dibahas." },
              { n: "04", t: "Belajar", d: "Mulai sesi & beri review setelah selesai." },
            ].map((s, i) => (
              <div key={s.n} className="relative rounded-2xl border bg-card p-6 shadow-card">
                <div className="font-display text-3xl font-bold text-primary/30">{s.n}</div>
                <h3 className="mt-2 font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                {i < 3 && <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground/40 md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutor */}
      <section id="tutor" className="container py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Tutor unggulan</h2>
            <p className="mt-2 text-muted-foreground">Mahasiswa BINUS terbaik siap membantu kamu.</p>
          </div>
          <Link to="/register" className="hidden text-sm font-medium text-primary hover:underline md:block">Lihat semua →</Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(t => (
            <div key={t.id} className="group rounded-2xl border bg-card p-5 shadow-card hover-lift">
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-14 w-14 rounded-full bg-muted" />
                <div>
                  <div className="font-display font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.major}</div>
                </div>
              </div>
              <div className="mt-3"><RatingStars value={t.rating} showNumber count={t.reviewCount} /></div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {t.subjects.slice(0, 2).map(s => (
                  <span key={s} className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">{s}</span>
                ))}
                {t.subjects.length > 2 && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">+{t.subjects.length - 2}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimoni - Auto Marquee */}
      <section id="testimoni" className="bg-muted/40 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-accent">
              <Quote className="h-3.5 w-3.5" /> Testimoni Mahasiswa
            </div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Apa kata mereka tentang MentorIn</h2>
            <p className="mt-3 text-muted-foreground">
              Cerita nyata dari mahasiswa yang sudah belajar bareng tutor sebaya kami.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <AutoMarquee speed={50} direction="left">
            {topReviews.map(r => {
              const t = tutorById(r.tutorId);
              const m = mhsById(r.mahasiswaId);
              return (
                <div
                  key={r.id}
                  className="flex w-[360px] shrink-0 flex-col rounded-2xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
                >
                  <Quote className="h-6 w-6 text-primary/30" />
                  <p className="mt-3 text-sm leading-relaxed text-foreground">"{r.comment}"</p>
                  <div className="mt-4"><RatingStars value={r.rating} size={14} /></div>
                  <div className="mt-5 flex items-center gap-3 border-t pt-4">
                    <img
                      src={m?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.mahasiswaId}`}
                      alt=""
                      className="h-10 w-10 rounded-full bg-muted"
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{m?.name || "Mahasiswa BINUS"}</div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        Belajar dengan {t?.name || "tutor"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </AutoMarquee>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-primary p-10 text-center text-primary-foreground shadow-elevated md:p-16">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold md:text-4xl">Siap meningkatkan IPK kamu semester ini?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">Gabung MentorIn dan akses bimbingan dari ratusan tutor mahasiswa BINUS.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register?role=mahasiswa">
              <Button size="lg" variant="secondary" className="gap-2">Daftar sebagai Mahasiswa <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link to="/apply-tutor">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">Jadi Tutor</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
