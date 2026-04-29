export function formatDistanceToNow(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} hari lalu`;
  const w = Math.floor(d / 7);
  if (w < 4) return `${w} minggu lalu`;
  return new Date(timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}
