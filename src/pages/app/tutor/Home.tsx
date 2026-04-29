import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Calendar, Star, Users, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { BookingCard } from "@/components/BookingCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";

export default function TutorHome() {
  const { currentUser, bookings, tutors } = useApp();
  const me = tutors.find(t => t.id === currentUser!.id);
  const mine = bookings.filter(b => b.tutorId === currentUser!.id);
  const monthCount = mine.filter(b => Date.now() - b.createdAt < 30 * 86400000).length;
  const studentCount = new Set(mine.map(b => b.mahasiswaId)).size;
  const pending = mine.filter(b => b.status === "Pending");
  const today = mine.filter(b => b.status === "Confirmed");

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Halo Coach ${currentUser!.name.split(" ")[0]} 🎓`}
        description="Pantau performa mengajarmu dan booking yang masuk."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Sesi bulan ini" value={monthCount} icon={Calendar} tone="primary" />
        <StatCard label="Rating rata-rata" value={me?.rating?.toFixed(1) || "—"} icon={Star} tone="warning" />
        <StatCard label="Mahasiswa dilayani" value={studentCount} icon={Users} tone="accent" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Booking perlu konfirmasi</h2>
          <Link to="/app/booking-masuk" className="text-sm font-medium text-primary hover:underline">Lihat semua →</Link>
        </div>
        {pending.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-6 w-6" />}
            title="Tidak ada booking baru"
            description="Booking dari mahasiswa akan muncul di sini."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pending.slice(0, 4).map(b => <BookingCard key={b.id} booking={b} viewerRole="tutor" />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold">Sesi terkonfirmasi</h2>
        {today.length === 0 ? (
          <EmptyState icon={<Calendar className="h-6 w-6" />} title="Belum ada sesi terkonfirmasi" description="Konfirmasi booking masuk untuk mengisi jadwalmu." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {today.slice(0, 4).map(b => <BookingCard key={b.id} booking={b} viewerRole="tutor" />)}
          </div>
        )}
      </section>
    </div>
  );
}
