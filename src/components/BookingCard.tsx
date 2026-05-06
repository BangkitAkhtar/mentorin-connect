import { Booking } from "@/types";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, ExternalLink, MessageSquare } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function BookingCard({ booking, viewerRole }: { booking: Booking; viewerRole: "mahasiswa" | "tutor" }) {
  const { tutors, mahasiswa, classes, updateBookingStatus } = useApp();
  const tutor = tutors.find(t => t.id === booking.tutorId);
  const mhs = mahasiswa.find(m => m.id === booking.mahasiswaId);
  const counterpart = viewerRole === "mahasiswa" ? tutor : mhs;
  const targetClass = booking.classId ? classes.find(c => c.id === booking.classId) : null;

  return (
    <div className="animate-fade-in rounded-2xl border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {counterpart && <img src={counterpart.avatar} alt="" className="h-11 w-11 rounded-full bg-muted" />}
          <div>
            <div className="font-display font-semibold">{counterpart?.name}</div>
            <div className="text-xs text-muted-foreground">{counterpart?.major}</div>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-4 grid gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground"><BookOpen className="h-4 w-4" /><span className="font-medium text-foreground">{booking.subject}</span></div>
        <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" />{booking.day}</div>
        <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" />{booking.time}</div>
      </div>

      {booking.topic && <p className="mt-3 rounded-lg bg-muted/60 p-3 text-sm">"{booking.topic}"</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {viewerRole === "tutor" && booking.status === "Pending" && (
          <>
            <Button size="sm" onClick={() => { updateBookingStatus(booking.id, "Confirmed"); toast.success("Booking dikonfirmasi"); }}>Terima</Button>
            <Button size="sm" variant="outline" onClick={() => { updateBookingStatus(booking.id, "Cancelled"); toast("Booking ditolak"); }}>Tolak</Button>
          </>
        )}
        {viewerRole === "tutor" && booking.status === "Confirmed" && (
          <Button size="sm" variant="outline" onClick={() => { updateBookingStatus(booking.id, "Completed"); toast.success("Sesi ditandai selesai"); }}>Tandai Selesai</Button>
        )}
        {viewerRole === "mahasiswa" && (booking.status === "Pending" || booking.status === "Confirmed") && (
          <Button size="sm" variant="outline" onClick={() => { updateBookingStatus(booking.id, "Cancelled"); toast("Sesi dibatalkan"); }}>Batalkan</Button>
        )}
        <Link to={booking.classId ? `/app/chat/class_${booking.classId}` : `/app/chat/${viewerRole === "mahasiswa" ? `${booking.mahasiswaId}_${booking.tutorId}` : `${booking.mahasiswaId}_${booking.tutorId}`}`}><Button size="sm" variant="secondary" className="gap-2"><MessageSquare className="h-3.5 w-3.5"/>Diskusi</Button></Link>
        {targetClass?.meetingLink && (
          <a href={targetClass.meetingLink} target="_blank" rel="noreferrer">
            <Button size="sm" variant="secondary" className="gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
              <ExternalLink className="h-3.5 w-3.5" /> Meeting
            </Button>
          </a>
        )}
        {targetClass?.materials && (
          <a href={targetClass.materials} target="_blank" rel="noreferrer">
            <Button size="sm" variant="secondary" className="gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
              <ExternalLink className="h-3.5 w-3.5" /> Materi
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
