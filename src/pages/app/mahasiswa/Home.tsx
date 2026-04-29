import { useApp } from "@/context/AppContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { BookOpen, Calendar, MessageSquare, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { BookingCard } from "@/components/BookingCard";

export default function MahasiswaHome() {
  const { currentUser, bookings, tutors, classes } = useApp();
  const mine = bookings.filter(b => b.mahasiswaId === currentUser!.id);
  const upcoming = mine.filter(b => b.status === "Pending" || b.status === "Confirmed");

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Selamat datang, ${currentUser!.name.split(" ")[0]} 👋`}
        description="Lihat sesi mendatang dan jelajahi kelas baru."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Sesi mendatang" value={upcoming.length} icon={Calendar} tone="primary" />
        <StatCard label="Total tutor" value={tutors.length} icon={Users} tone="accent" />
        <StatCard label="Kelas tersedia" value={classes.filter(c => c.active).length} icon={BookOpen} tone="success" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Sesi mendatang</h2>
          <Link to="/app/riwayat" className="text-sm font-medium text-primary hover:underline">Riwayat lengkap →</Link>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState
            icon={<Calendar className="h-6 w-6" />}
            title="Belum ada sesi mendatang"
            description="Cari tutor dan booking sesi pertamamu sekarang."
            action={<Link to="/app/katalog"><Button>Lihat Katalog Kelas</Button></Link>}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map(b => <BookingCard key={b.id} booking={b} viewerRole="mahasiswa" />)}
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link to="/app/katalog" className="group rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary"><BookOpen className="h-6 w-6" /></div>
          <h3 className="mt-4 font-display text-lg font-semibold">Katalog Kelas</h3>
          <p className="text-sm text-muted-foreground">Telusuri kelas yang dibuka tutor sebaya.</p>
        </Link>
        <Link to="/app/tutor" className="group rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent"><Users className="h-6 w-6" /></div>
          <h3 className="mt-4 font-display text-lg font-semibold">Daftar Tutor</h3>
          <p className="text-sm text-muted-foreground">Pilih tutor dan booking sesi privat.</p>
        </Link>
      </section>
    </div>
  );
}
