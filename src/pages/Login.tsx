import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { GraduationCap, ShieldCheck, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Login() {
  const nav = useNavigate();
  const { login } = useApp();
  const [role, setRole] = useState<"mahasiswa" | "tutor" | "admin">("mahasiswa");
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email.trim(), role);
    if (!ok) { toast.error("Email tidak ditemukan", { description: "Demo: demo@binus.ac.id (mhs) · aulia@binus.ac.id (tutor) · admin@binus.ac.id (admin)" }); return; }
    toast.success("Berhasil masuk!");
    nav("/app");
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden bg-gradient-hero p-12 md:flex md:flex-col md:justify-between">
        <Link to="/"><Logo /></Link>
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight">Selamat datang kembali di MentorIn 👋</h1>
          <p className="mt-4 text-muted-foreground">Lanjutkan perjalanan belajarmu bersama mentor sebaya BINUS.</p>
        </div>
        <div className="text-xs text-muted-foreground">SASC BINUS Project — SDG 4</div>
      </div>

      <div className="flex flex-col justify-center p-8 md:p-12">
        <div className="md:hidden mb-8"><Link to="/"><Logo /></Link></div>
        <div className="mx-auto w-full max-w-md">
          <h2 className="font-display text-2xl font-bold">Masuk ke akunmu</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pilih role lalu masukkan email kampus.</p>

          <Tabs value={role} onValueChange={v => setRole(v as any)} className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mahasiswa" className="gap-1.5"><Users className="h-3.5 w-3.5" />Mahasiswa</TabsTrigger>
              <TabsTrigger value="tutor" className="gap-1.5"><GraduationCap className="h-3.5 w-3.5" />Tutor</TabsTrigger>
              <TabsTrigger value="admin" className="gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />Admin</TabsTrigger>
            </TabsList>
            <TabsContent value={role} className="mt-6">
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email kampus</Label>
                  <Input id="email" type="email" required
                    placeholder={role === "mahasiswa" ? "demo@binus.ac.id" : role === "tutor" ? "aulia@binus.ac.id" : "admin@binus.ac.id"}
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="pwd">Password</Label>
                  <Input id="pwd" type="password" placeholder="••••••••" defaultValue="demo1234" />
                </div>
                <Button type="submit" className="w-full hover-scale">Masuk</Button>
              </form>

              <div className="mt-4 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                <strong className="text-foreground">Demo:</strong> {role === "mahasiswa" ? "demo@binus.ac.id" : role === "tutor" ? "aulia@binus.ac.id" : "admin@binus.ac.id"}
              </div>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun? <Link to="/register" className="font-semibold text-primary hover:underline">Daftar gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
