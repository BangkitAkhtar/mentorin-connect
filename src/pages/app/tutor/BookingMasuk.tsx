import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { BookingCard } from "@/components/BookingCard";
import { EmptyState } from "@/components/EmptyState";
import { ClipboardList } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function BookingMasuk() {
  const { bookings, currentUser } = useApp();
  const mine = bookings.filter(b => b.tutorId === currentUser!.id).sort((a, b) => b.createdAt - a.createdAt);
  const pending = mine.filter(b => b.status === "Pending");
  const confirmed = mine.filter(b => b.status === "Confirmed");

  return (
    <div className="space-y-6">
      <PageHeader title="Booking Masuk" description="Kelola booking dari mahasiswa." />
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Dikonfirmasi ({confirmed.length})</TabsTrigger>
          <TabsTrigger value="all">Semua ({mine.length})</TabsTrigger>
        </TabsList>
        {[
          { v: "pending", data: pending },
          { v: "confirmed", data: confirmed },
          { v: "all", data: mine },
        ].map(t => (
          <TabsContent key={t.v} value={t.v} className="mt-6">
            {t.data.length === 0 ? (
              <EmptyState icon={<ClipboardList className="h-6 w-6" />} title="Tidak ada booking" description="Booking baru akan muncul di sini." />
            ) : <div className="grid gap-4 md:grid-cols-2">{t.data.map(b => <BookingCard key={b.id} booking={b} viewerRole="tutor" />)}</div>}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
