import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Platform bimbingan belajar gratis antar mahasiswa. Mendukung tujuan SDG 4 — Pendidikan Berkualitas.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent">
              <span className="h-2 w-2 rounded-full bg-accent" />
              SDG 4 — Quality Education
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold">Tim Pengembang — Kelompok 8</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li><span className="font-medium text-foreground">Fernaldy</span> — Product Owner</li>
              <li><span className="font-medium text-foreground">Reynald</span> — SCRUM Master</li>
              <li><span className="font-medium text-foreground">Bangkit</span> — Development Team</li>
              <li><span className="font-medium text-foreground">Owen</span> — Development Team</li>
              <li><span className="font-medium text-foreground">Jodie</span> — Development Team</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold">Konteks Akademik</h4>
            <p className="text-sm text-muted-foreground">
              Mata Kuliah <strong className="text-foreground">Software Engineering</strong><br />
              Bina Nusantara University (BINUS)<br />
              Program <strong className="text-foreground">SASC</strong> — Student Academic Support Center
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-xl border bg-primary-soft/40 p-5 text-sm leading-relaxed text-foreground/80">
          <strong className="text-foreground">Disclaimer:</strong> MentorIn adalah aplikasi yang dikembangkan sebagai
          proyek akademik mata kuliah <em>Software Engineering</em> oleh Kelompok 8 — Bina Nusantara University (BINUS),
          dalam kerangka program SASC (Student Academic Support Center). Aplikasi ini dibuat untuk keperluan pembelajaran
          dan tidak bersifat komersial. Seluruh layanan bimbingan belajar pada platform ini bersifat gratis.
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} MentorIn — Kelompok 8 SASC BINUS. Untuk keperluan pembelajaran.</p>
          <p>Dibuat dengan ❤ untuk mahasiswa Indonesia.</p>
        </div>
      </div>
    </footer>
  );
}
