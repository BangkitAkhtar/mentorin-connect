import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function ApplyTutorSuccess() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center"><a href="/"><Logo /></a></div>
      </header>
      <main className="container flex flex-1 items-center justify-center py-20">
        <div className="mx-auto max-w-lg rounded-3xl border bg-card p-10 text-center shadow-elevated animate-scale-in">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-accent">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold">Aplikasi terkirim!</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Terima kasih sudah mendaftar sebagai tutor MentorIn. Admin SASC BINUS akan meninjau aplikasimu
            dan menghubungi via email kampus jika disetujui.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/"><Button>Kembali ke Beranda</Button></Link>
            <Link to="/login"><Button variant="outline">Masuk</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
