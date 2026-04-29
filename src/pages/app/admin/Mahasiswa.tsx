import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MahasiswaProfile } from "@/types";

function EditDialog({ user, onSave }: { user: MahasiswaProfile; onSave: (p: any) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [university, setUniversity] = useState(user.university);
  const [major, setMajor] = useState(user.major);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="ghost" className="hover-scale"><Pencil className="h-4 w-4" /></Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Mahasiswa</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Nama</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div><Label>Universitas</Label><Input value={university} onChange={e => setUniversity(e.target.value)} /></div>
          <div><Label>Jurusan</Label><Input value={major} onChange={e => setMajor(e.target.value)} /></div>
          <Button onClick={() => { onSave({ name, email, university, major }); toast.success("Mahasiswa diupdate"); setOpen(false); }}>Simpan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminMahasiswa() {
  const { mahasiswa, bookings, adminUpdateUser, adminDeleteUser } = useApp();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => mahasiswa.filter(m => `${m.name} ${m.email} ${m.major}`.toLowerCase().includes(q.toLowerCase())), [mahasiswa, q]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Kelola Mahasiswa" description={`Total: ${mahasiswa.length} mahasiswa terdaftar.`} />
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Cari nama, email, atau jurusan..." value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <DataTable
        rows={filtered}
        empty="Tidak ada mahasiswa"
        columns={[
          { key: "u", header: "Mahasiswa", render: m => (
            <div className="flex items-center gap-3">
              <img src={m.avatar} alt="" className="h-9 w-9 rounded-full bg-muted" />
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.email}</div>
              </div>
            </div>
          ) },
          { key: "uni", header: "Universitas", render: m => m.university },
          { key: "maj", header: "Jurusan", render: m => m.major },
          { key: "b", header: "Booking", render: m => bookings.filter(b => b.mahasiswaId === m.id).length },
          { key: "act", header: "Aksi", className: "text-right", render: m => (
            <div className="flex justify-end gap-1">
              <EditDialog user={m} onSave={p => adminUpdateUser(m.id, "mahasiswa", p)} />
              <Button size="sm" variant="ghost" className="hover-scale" onClick={() => {
                if (confirm(`Hapus ${m.name}? Data booking-nya juga akan ikut terhapus.`)) {
                  adminDeleteUser(m.id, "mahasiswa"); toast.success("Mahasiswa dihapus");
                }
              }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ) },
        ]}
      />
    </div>
  );
}
