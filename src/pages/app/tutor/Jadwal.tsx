import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DAYS, TutorProfile } from "@/types";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

export default function Jadwal() {
  const { currentUser, updateTutor } = useApp();
  const t = currentUser as TutorProfile;
  const [avail, setAvail] = useState<Record<string, string[]>>(t.availability || {});
  const [day, setDay] = useState(DAYS[0]);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("11:00");

  const addSlot = () => {
    if (start >= end) { toast.error("Jam mulai harus sebelum jam selesai"); return; }
    const slot = `${start}-${end}`;
    setAvail(p => ({ ...p, [day]: [...(p[day] || []), slot].sort() }));
  };
  const removeSlot = (d: string, s: string) => setAvail(p => ({ ...p, [d]: (p[d] || []).filter(x => x !== s) }));

  const save = () => { updateTutor({ id: t.id, availability: avail }); toast.success("Jadwal tersimpan"); };

  return (
    <div className="space-y-6">
      <PageHeader title="Atur Jadwal Ketersediaan" description="Tambah slot waktu kamu siap mengajar." action={<Button onClick={save}>Simpan</Button>} />

      <div className="rounded-2xl border bg-card p-6 shadow-card">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          <select value={day} onChange={e => setDay(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <Input type="time" value={start} onChange={e => setStart(e.target.value)} />
          <Input type="time" value={end} onChange={e => setEnd(e.target.value)} />
          <Button onClick={addSlot} className="gap-2"><Plus className="h-4 w-4" />Tambah</Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DAYS.map(d => (
          <div key={d} className="rounded-xl border bg-card p-4 shadow-card">
            <div className="font-display font-semibold">{d}</div>
            {(!avail[d] || avail[d].length === 0) ? (
              <div className="mt-3 text-xs text-muted-foreground">Belum ada slot</div>
            ) : (
              <div className="mt-3 space-y-1.5">
                {avail[d].map(s => (
                  <div key={s} className="flex items-center justify-between rounded-md bg-primary-soft px-2.5 py-1.5 text-xs font-medium text-primary">
                    {s}
                    <button onClick={() => removeSlot(d, s)} className="text-primary/70 hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
