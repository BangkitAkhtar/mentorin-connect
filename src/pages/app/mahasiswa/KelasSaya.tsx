import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/RatingStars";
import { Calendar, Clock, Users, BookOpen, MessageSquare, ExternalLink, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Booking } from "@/types";

function ReviewDialog({ booking }: { booking: Booking }) {
  const { addReview, currentUser } = useApp();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white" variant="secondary">
          <Star className="h-4 w-4" /> Beri Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Beri Review untuk Tutor</DialogTitle></DialogHeader>
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

export default function KelasSaya() {
  const { classes, tutors, admins, currentUser, bookings } = useApp();
  const allTutors = [...tutors, ...admins];

  const enrolledClasses = useMemo(() => {
    return classes.filter(c => c.enrolled.includes(currentUser!.id));
  }, [classes, currentUser]);

  return (
    <div className="space-y-6">
      <PageHeader title="Kelas Saya" description="Katalog kelas yang sedang kamu jalani." />

      {enrolledClasses.length === 0 ? (
        <EmptyState icon={<BookOpen className="h-6 w-6" />} title="Belum ada kelas" description="Kamu belum terdaftar di kelas manapun. Yuk cari di Katalog Kelas!" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledClasses.map(c => {
            const tutor = allTutors.find(t => t.id === c.tutorId) || { id: c.tutorId, name: "Tutor", avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown`, rating: 0 };
            const userBooking = bookings.find(b => b.classId === c.id && b.mahasiswaId === currentUser!.id);
            const hasReviewed = userBooking?.reviewed;

            return (
              <div key={c.id} className={`group flex animate-fade-in flex-col rounded-2xl border bg-card p-5 shadow-card hover-lift ${c.completed ? "border-emerald-200 dark:border-emerald-800" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold text-primary">{c.subject}</span>
                    {c.completed && (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        ✓ Kelas Selesai
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>

                <Link to={`/app/tutor/${tutor.id}`} className="mt-4 flex items-center gap-3 rounded-lg border bg-muted/30 p-2.5 transition hover:bg-muted/60">
                  <img src={tutor.avatar} alt="" className="h-9 w-9 rounded-full bg-muted" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{tutor.name}</div>
                    <RatingStars value={tutor.rating} size={11} />
                  </div>
                </Link>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{c.day}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{c.startTime}–{c.endTime}</span>
                  <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{c.enrolled.length} terdaftar</span>
                </div>

                {/* Completed class: show review prompt */}
                {c.completed && (
                  <div className="mt-4 space-y-2">
                    {hasReviewed ? (
                      <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3 text-center text-sm text-emerald-700 dark:text-emerald-300">
                        ✓ Sudah memberikan review
                      </div>
                    ) : userBooking ? (
                      <ReviewDialog booking={userBooking} />
                    ) : null}
                  </div>
                )}

                {/* Active class: show action buttons */}
                {!c.completed && (
                  <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Link to={`/app/chat/class_${c.id}`}>
                      <Button className="w-full gap-2" variant="secondary"><MessageSquare className="h-4 w-4" /> Diskusi</Button>
                    </Link>
                    {c.meetingLink ? (
                      <a href={c.meetingLink} target="_blank" rel="noreferrer">
                        <Button className="w-full gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" variant="secondary"><ExternalLink className="h-4 w-4" /> Meeting</Button>
                      </a>
                    ) : (
                      <Button disabled className="w-full gap-2" variant="secondary"><ExternalLink className="h-4 w-4" /> Meeting</Button>
                    )}
                    {c.materials ? (
                      <a href={c.materials} target="_blank" rel="noreferrer" className="sm:col-span-2">
                        <Button className="w-full gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" variant="secondary"><ExternalLink className="h-4 w-4" /> Akses Materi</Button>
                      </a>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
