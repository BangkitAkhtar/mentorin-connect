import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Users, GraduationCap, BookOpen, ClipboardList, Star, Lightbulb, ShieldCheck, RefreshCw, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminHome() {
  const { mahasiswa, tutors, classes, bookings, reviews, proposed, tutorApplications, currentUser, adminResetData } = useApp();

  const pendingApps = tutorApplications.filter(a => a.status === "Pending").length;

  const stats = [
    { label: "Mahasiswa", value: mahasiswa.length, icon: Users, tone: "primary" as const, to: "/app/admin/mahasiswa" },
    { label: "Tutor", value: tutors.length, icon: GraduationCap, tone: "accent" as const, to: "/app/admin/tutor" },
    { label: "Aplikasi Tutor", value: `${tutorApplications.length}${pendingApps ? ` (${pendingApps})` : ""}`, icon: UserPlus, tone: "warning" as const, to: "/app/admin/aplikasi-tutor" },
    { label: "Kelas Aktif", value: classes.filter(c => c.active).length, icon: BookOpen, tone: "success" as const, to: "/app/admin/kelas" },
    { label: "Total Booking", value: bookings.length, icon: ClipboardList, tone: "warning" as const, to: "/app/admin/booking" },
    { label: "Review", value: reviews.length, icon: Star, tone: "warning" as const, to: "/app/admin/review" },
    { label: "Saran Kelas", value: proposed.length, icon: Lightbulb, tone: "primary" as const, to: "/app/admin/usulan" },
  ];

  const avgRating = reviews.length ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(2) : "—";

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Admin Console — ${currentUser!.name}`}
        description="Pantau & kelola seluruh data MentorIn."
        action={
          <Button variant="outline" className="gap-2 hover-scale" onClick={() => {
            if (confirm("Reset semua data ke seed default? Tindakan ini tidak bisa dibatalkan.")) {
              toast.success("Data direset"); adminResetData();
            }
          }}>
            <RefreshCw className="h-4 w-4" /> Reset Data Demo
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s, i) => (
          <Link key={s.label} to={s.to} className="block animate-fade-in hover-scale" style={{ animationDelay: `${i * 50}ms` }}>
            <StatCard label={s.label} value={s.value} icon={s.icon} tone={s.tone} />
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border bg-card p-6 shadow-card animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Ringkasan Performa Platform</h2>
            <p className="text-sm text-muted-foreground">Metrik kunci untuk laporan SASC.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="text-xs font-medium text-muted-foreground">Rating rata-rata</div>
            <div className="mt-1 font-display text-2xl font-bold">{avgRating}</div>
          </div>
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="text-xs font-medium text-muted-foreground">Sesi selesai</div>
            <div className="mt-1 font-display text-2xl font-bold">{bookings.filter(b => b.status === "Completed").length}</div>
          </div>
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="text-xs font-medium text-muted-foreground">Booking pending</div>
            <div className="mt-1 font-display text-2xl font-bold">{bookings.filter(b => b.status === "Pending").length}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
