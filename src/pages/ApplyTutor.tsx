import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { ArrowLeft, GraduationCap, Sparkles, X } from "lucide-react";
import { SUBJECTS } from "@/types";
import { Footer } from "@/components/Footer";

export default function ApplyTutor() {
  const nav = useNavigate();
  const { submitTutorApplication } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("BINUS University");
  const [major, setMajor] = useState("");
  const [semester, setSemester] = useState("");
  const [bio, setBio] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [motivation, setMotivation] = useState("");
  const [experience, setExperience] = useState("");

  const toggleSubject = (s: string) =>
    setSubjects(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) { toast.error("Nama & email wajib"); return; }
    if (subjects.length === 0) { toast.error("Pilih minimal 1 mata kuliah"); return; }
    if (!motivation.trim()) { toast.error("Isi motivasi kamu"); return; }

    submitTutorApplication({
      name: name.trim(), email: email.trim(), university, major, semester,
      bio, subjects, motivation, experience,
    });
    toast.success("Aplikasi tutor terkirim! Admin SASC akan meninjau.");
    nav("/apply-tutor/sukses");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <a href="/"><Logo /></a>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </div>
      </header>

      <section className="bg-gradient-hero">
        <div className="container py-14">
          <div className="mx-auto max-w-2xl text-center animate-fade-in">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-card">
              <Sparkles className="h-3.5 w-3.5" /> Pendaftaran Tutor Sebaya
            </div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Bagikan ilmumu, bantu sesama mahasiswa BINUS.</h1>
            <p className="mt-3 text-muted-foreground">
              Isi formulir ini untuk mendaftar sebagai tutor MentorIn. Aplikasi akan ditinjau admin SASC dan kamu akan dihubungi via email.
            </p>
          </div>
        </div>
      </section>

      <section className="container -mt-8 pb-20">
        <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6 rounded-3xl border bg-card p-6 shadow-elevated md:p-10 animate-fade-in">
          <div>
            <h2 className="font-display text-lg font-semibold">Data Diri</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><Label>Nama lengkap *</Label><Input required value={name} onChange={e => setName(e.target.value)} /></div>
              <div><Label>Email kampus *</Label><Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@binus.ac.id" /></div>
              <div><Label>Universitas</Label><Input value={university} onChange={e => setUniversity(e.target.value)} /></div>
              <div><Label>Jurusan</Label><Input placeholder="Computer Science" value={major} onChange={e => setMajor(e.target.value)} /></div>
              <div className="sm:col-span-2"><Label>Semester saat ini</Label><Input placeholder="Contoh: 5" value={semester} onChange={e => setSemester(e.target.value)} /></div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold">Bidang Keahlian</h2>
            <p className="text-xs text-muted-foreground">Pilih mata kuliah yang siap kamu ajarkan.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUBJECTS.map(s => {
                const active = subjects.includes(s);
                return (
                  <button type="button" key={s} onClick={() => toggleSubject(s)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40"}`}>
                    {active && <X className="mr-1 inline h-3 w-3" />}{s}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold">Tentang Kamu</h2>
            <div className="mt-4 space-y-4">
              <div>
                <Label>Bio singkat</Label>
                <Textarea rows={3} placeholder="Ceritakan dirimu & gaya mengajarmu..." value={bio} onChange={e => setBio(e.target.value)} />
              </div>
              <div>
                <Label>Motivasi jadi tutor *</Label>
                <Textarea rows={3} required placeholder="Kenapa kamu ingin jadi tutor di MentorIn?" value={motivation} onChange={e => setMotivation(e.target.value)} />
              </div>
              <div>
                <Label>Pengalaman mengajar / asistensi</Label>
                <Textarea rows={3} placeholder="Pengalaman jadi asisten, mentor, atau bantu teman belajar." value={experience} onChange={e => setExperience(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground sm:flex-row sm:items-center">
            <GraduationCap className="h-5 w-5 shrink-0 text-primary" />
            <span>
              Dengan mengirim aplikasi ini, kamu setuju untuk ditinjau oleh tim admin SASC BINUS.
              Akun tutor akan dibuatkan setelah aplikasi disetujui.
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" className="gap-2">Kirim Aplikasi</Button>
            <Link to="/"><Button type="button" size="lg" variant="outline">Batal</Button></Link>
          </div>
        </form>
      </section>

      <Footer />
    </div>
  );
}
