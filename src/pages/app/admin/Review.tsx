import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { RatingStars } from "@/components/RatingStars";
import { toast } from "sonner";
import { formatDistanceToNow } from "@/lib/format";

export default function AdminReview() {
  const { reviews, tutors, mahasiswa, adminDeleteReview } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Kelola Review" description={`Total: ${reviews.length} review dari mahasiswa.`} />
      <DataTable
        rows={reviews.sort((a, b) => b.createdAt - a.createdAt)}
        empty="Belum ada review"
        columns={[
          { key: "tutor", header: "Tutor", render: r => tutors.find(t => t.id === r.tutorId)?.name || "-" },
          { key: "mhs", header: "Mahasiswa", render: r => mahasiswa.find(m => m.id === r.mahasiswaId)?.name || "Anonim" },
          { key: "rating", header: "Rating", render: r => <RatingStars value={r.rating} size={12} /> },
          { key: "comment", header: "Komentar", render: r => <div className="max-w-md truncate text-sm">{r.comment}</div> },
          { key: "when", header: "Waktu", render: r => formatDistanceToNow(r.createdAt) },
          { key: "act", header: "Aksi", className: "text-right", render: r => (
            <Button size="sm" variant="ghost" className="hover-scale" onClick={() => { if (confirm("Hapus review ini?")) { adminDeleteReview(r.id); toast.success("Review dihapus"); } }}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          ) },
        ]}
      />
    </div>
  );
}
