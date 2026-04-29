import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { BookingCard } from "@/components/BookingCard";
import { EmptyState } from "@/components/EmptyState";
import { History, Star } from "lucide-react";
import { Booking } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function ReviewDialog({ booking }: { booking: Booking }) {
  const { addReview, currentUser } = useApp();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2"><Star className="h-3.5 w-3.5" />Beri Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Beri Review</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Rating</Label>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} type="button" onClick={() => setRating(i)}>
                  <Star className={cn("h-7 w-7 transition", i <= rating ? "fill-warning text-warning" : "text-muted-foreground/30")} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Komentar</Label>
            <Textarea rows={4} value={comment} onChange={e => setComment(e.target.value)} placeholder="Ceritakan pengalaman belajarmu..." />
          </div>
          <Button onClick={() => {
            if (!comment.trim()) { toast.error("Komentar wajib"); return; }
            addReview({ bookingId: booking.id, tutorId: booking.tutorId, mahasiswaId: currentUser!.id, rating, comment: comment.trim() });
            toast.success("Review terkirim!"); setOpen(false);
          }}>Kirim Review</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Riwayat() {
  const { bookings, currentUser } = useApp();
  const mine = bookings.filter(b => b.mahasiswaId === currentUser!.id).sort((a, b) => b.createdAt - a.createdAt);
  const upcoming = mine.filter(b => b.status === "Pending" || b.status === "Confirmed");
  const past = mine.filter(b => b.status === "Completed" || b.status === "Cancelled");

  return (
    <div className="space-y-6">
      <PageHeader title="Riwayat Sesi" description="Semua sesi bookingmu." />

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Mendatang ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Selesai/Batal ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {upcoming.length === 0 ? (
            <EmptyState icon={<History className="h-6 w-6" />} title="Belum ada sesi mendatang" description="Booking sesi pertamamu sekarang." />
          ) : <div className="grid gap-4 md:grid-cols-2">{upcoming.map(b => <BookingCard key={b.id} booking={b} viewerRole="mahasiswa" />)}</div>}
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          {past.length === 0 ? (
            <EmptyState icon={<History className="h-6 w-6" />} title="Belum ada riwayat" description="Sesi yang sudah selesai akan muncul di sini." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {past.map(b => (
                <div key={b.id} className="space-y-2">
                  <BookingCard booking={b} viewerRole="mahasiswa" />
                  {b.status === "Completed" && !b.reviewed && <ReviewDialog booking={b} />}
                  {b.reviewed && <div className="text-xs text-success">✓ Sudah direview</div>}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
