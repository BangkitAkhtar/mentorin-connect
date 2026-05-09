import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { GraduationCap, Users } from "lucide-react";

import { authAPI } from "@/lib/api";

export default function Register() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("BINUS University");
  const [major, setMajor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) { 
      toast.error("Nama, email, dan password wajib diisi"); 
      return; 
    }
    
    setIsLoading(true);
    const response = await authAPI.register(name.trim(), email.trim(), password.trim());
    setIsLoading(false);

    if (!response.success) {
      toast.error("Gagal mendaftar", { description: response.message || "Email mungkin sudah digunakan" });
      return;
    }

    // Format user agar cocok dengan struktur AppContext
    const loggedUser = {
      id: String(response.user.id),
      role: "mahasiswa", // Default role untuk pendaftaran dari halaman ini
      name: response.user.name,
      email: response.user.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(response.user.name)}`,
      university: university,
      major: major
    };

    localStorage.setItem("mentorin_user_v1", JSON.stringify(loggedUser));
    
    toast.success("Akun berhasil dibuat!");
    
    // Reload agar AppContext membaca user baru
    setTimeout(() => {
      window.location.href = "/app";
    }, 500);
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden bg-gradient-hero p-12 md:flex md:flex-col md:justify-between">
        <a href="/"><Logo /></a>
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight">Bergabung dengan komunitas belajar mahasiswa BINUS.</h1>
          <p className="mt-4 text-muted-foreground">Gratis selamanya. Belajar bareng, tumbuh bareng.</p>
        </div>
        <div className="text-xs text-muted-foreground">SASC BINUS Project — SDG 4</div>
      </div>

      <div className="flex flex-col justify-center p-8 md:p-12">
        <div className="md:hidden mb-8"><a href="/"><Logo /></a></div>
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-primary">
            <Users className="h-3.5 w-3.5" /> Pendaftaran Mahasiswa
          </div>
          <h2 className="font-display text-2xl font-bold">Buat akun MentorIn</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Akun mahasiswa untuk mengakses katalog kelas dan booking tutor.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="n">Nama lengkap</Label><Input id="n" required value={name} onChange={e => setName(e.target.value)} /></div>
              <div><Label htmlFor="e">Email kampus</Label><Input id="e" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="sm:col-span-2"><Label htmlFor="p">Password</Label><PasswordInput id="p" placeholder="Minimal 8 karakter" required value={password} onChange={e => setPassword(e.target.value)} /></div>
              <div><Label htmlFor="u">Universitas</Label><Input id="u" value={university} onChange={e => setUniversity(e.target.value)} /></div>
              <div><Label htmlFor="m">Jurusan</Label><Input id="m" placeholder="Computer Science" value={major} onChange={e => setMajor(e.target.value)} /></div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Memproses..." : "Daftar gratis"}
            </Button>
          </form>

          <div className="mt-6 rounded-2xl border bg-primary-soft/40 p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-sm font-semibold">Tertarik jadi tutor?</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Akun tutor hanya dibuat oleh admin SASC. Ajukan diri lewat form pendaftaran tutor — tim kami akan meninjau aplikasimu.
                </p>
                <Link to="/apply-tutor">
                  <Button size="sm" variant="outline" className="mt-3 hover-scale">Daftar jadi Tutor</Button>
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun? <Link to="/login" className="font-semibold text-primary hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
