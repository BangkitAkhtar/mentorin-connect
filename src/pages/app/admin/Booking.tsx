import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingStatus } from "@/types";

export default function AdminBooking() {
  const { bookings, tutors, mahasiswa, updateBookingStatus, adminDeleteBooking } = useApp();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => bookings.filter(b => {
    const t = tutors.find(x => x.id === b.tutorId);
    const m = mahasiswa.find(x => x.id === b.mahasiswaId);
    return `${b.subject} ${b.topic} ${t?.name} ${m?.name}`.toLowerCase().includes(q.toLowerCase());
  }).sort((a, b) => b.createdAt - a.createdAt), [bookings, tutors, mahasiswa, q]);

  const statuses: BookingStatus[] = ["Pending", "Confirmed", "Ongoing", "Completed", "Cancelled"];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Kelola Booking" description={`Total: ${bookings.length} booking.`} />
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Cari mahasiswa, tutor, atau topik..." value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <DataTable
        rows={filtered}
        empty="Tidak ada booking"
        columns={[
          { key: "m", header: "Mahasiswa", render: b => mahasiswa.find(m => m.id === b.mahasiswaId)?.name || "-" },
          { key: "t", header: "Tutor", render: b => tutors.find(t => t.id === b.tutorId)?.name || "-" },
          { key: "subj", header: "Mata Kuliah", render: b => b.subject },
          { key: "sched", header: "Jadwal", render: b => `${b.day} · ${b.time}` },
          { key: "status", header: "Status", render: b => (
            <Select value={b.status} onValueChange={v => { updateBookingStatus(b.id, v as BookingStatus); toast.success("Status diupdate"); }}>
              <SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger>
              <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          ) },
          { key: "badge", header: "", render: b => <StatusBadge status={b.status} /> },
          { key: "act", header: "Aksi", className: "text-right", render: b => (
            <Button size="sm" variant="ghost" className="hover-scale" onClick={() => { if (confirm("Hapus booking ini?")) { adminDeleteBooking(b.id); toast.success("Dihapus"); } }}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          ) },
        ]}
      />
    </div>
  );
}
