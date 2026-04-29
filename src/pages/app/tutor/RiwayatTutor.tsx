import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { BookingCard } from "@/components/BookingCard";
import { RatingStars } from "@/components/RatingStars";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { History } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { formatDistanceToNow } from "@/lib/format";

export default function RiwayatTutor() {
  const { bookings, reviews, mahasiswa, currentUser } = useApp();
  const past = bookings.filter(b => b.tutorId === currentUser!.id && (b.status === "Completed" || b.status === "Cancelled"));
  const myReviews = reviews.filter(r => r.tutorId === currentUser!.id).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-6">
      <PageHeader title="Riwayat & Review" description="Sesi yang sudah selesai dan ulasan dari mahasiswa." />
      <Tabs defaultValue="sesi">
        <TabsList>
          <TabsTrigger value="sesi">Sesi ({past.length})</TabsTrigger>
          <TabsTrigger value="review">Review ({myReviews.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="sesi" className="mt-6">
          {past.length === 0 ? <EmptyState icon={<History className="h-6 w-6" />} title="Belum ada riwayat" description="Sesi yang selesai akan muncul di sini." /> :
            <div className="grid gap-4 md:grid-cols-2">{past.map(b => <BookingCard key={b.id} booking={b} viewerRole="tutor" />)}</div>}
        </TabsContent>
        <TabsContent value="review" className="mt-6">
          {myReviews.length === 0 ? <EmptyState icon={<History className="h-6 w-6" />} title="Belum ada review" description="Review dari mahasiswa akan muncul di sini." /> : (
            <div className="grid gap-3 md:grid-cols-2">
              {myReviews.map(r => {
                const m = mahasiswa.find(x => x.id === r.mahasiswaId);
                return (
                  <div key={r.id} className="rounded-xl border bg-card p-4 shadow-card">
                    <div className="flex items-center gap-3">
                      <img src={m?.avatar} alt="" className="h-9 w-9 rounded-full bg-muted" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{m?.name || "Anonim"}</div>
                        <div className="text-[11px] text-muted-foreground">{formatDistanceToNow(r.createdAt)}</div>
                      </div>
                      <RatingStars value={r.rating} />
                    </div>
                    <p className="mt-3 text-sm">{r.comment}</p>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
