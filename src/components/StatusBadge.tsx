import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  Pending: "bg-warning/10 text-warning border-warning/20",
  Confirmed: "bg-primary-soft text-primary border-primary/20",
  Ongoing: "bg-accent-soft text-accent border-accent/20",
  Completed: "bg-success/10 text-success border-success/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  Approved: "bg-success/10 text-success border-success/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const labels: Record<string, string> = {
  Pending: "Menunggu Konfirmasi",
  Confirmed: "Dikonfirmasi",
  Ongoing: "Berlangsung",
  Completed: "Selesai",
  Cancelled: "Dibatalkan",
  Approved: "Disetujui",
  Rejected: "Ditolak",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", styles[status] || "bg-muted text-muted-foreground border-border")}>
      {labels[status] || status}
    </span>
  );
}
