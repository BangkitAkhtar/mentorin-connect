import { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({ rows, columns, empty }: { rows: T[]; columns: Column<T>[]; empty?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map(c => (
                <th key={c.key} className={`px-4 py-3 text-left font-semibold ${c.className || ""}`}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">{empty || "Tidak ada data"}</td></tr>
            ) : rows.map((r, i) => (
              <tr key={r.id} className="border-b transition-colors hover:bg-muted/30 animate-fade-in" style={{ animationDelay: `${Math.min(i * 20, 200)}ms` }}>
                {columns.map(c => (
                  <td key={c.key} className={`px-4 py-3 ${c.className || ""}`}>{c.render(r)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
