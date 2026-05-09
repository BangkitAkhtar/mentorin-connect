import { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Search, Trash2, ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { usersAPI } from "@/lib/api";

function AddDialog({ onSave }: { onSave: (data: any) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name || !email || !password) {
      toast.error("Nama, Email, dan Password wajib diisi");
      return;
    }
    setIsSaving(true);
    await onSave({ name, email, password, role });
    setIsSaving(false);
    setOpen(false);
    setName("");
    setEmail("");
    setPassword("");
    setRole("mahasiswa");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hover-scale gap-2">
          <UserPlus className="h-4 w-4" />
          Tambah Pengguna
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Tambah Pengguna Baru</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Nama Lengkap</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div><Label>Password (Min. 8 karakter)</Label><PasswordInput value={password} onChange={e => setPassword(e.target.value)} /></div>
          <div>
            <Label>Role (Otoritas)</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue placeholder="Pilih Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                <SelectItem value="tutor">Tutor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? "Menyimpan..." : "Buat Akun"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditDialog({ user, onSave }: { user: any; onSave: (id: string, data: any) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user.role);
  const [avatar, setAvatar] = useState(user.avatar);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if user prop changes
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setAvatar(user.avatar);
    setPassword(""); // Reset password field
  }, [user, open]);

  const handleSave = async () => {
    setIsSaving(true);
    const data: any = { name, email, role, avatar };
    if (password.trim().length > 0) {
      data.password = password;
    }
    await onSave(user.id, data);
    setIsSaving(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="ghost" className="hover-scale"><Pencil className="h-4 w-4" /></Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Pengguna</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Nama</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div>
            <Label>Ubah Password <span className="text-muted-foreground font-normal">(Kosongkan jika tidak diubah)</span></Label>
            <PasswordInput placeholder="Masukkan password baru" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <Label>Role (Otoritas)</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue placeholder="Pilih Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                <SelectItem value="tutor">Tutor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Mengubah role akan merubah otoritas menu yang bisa diakses user ini.</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    const data = await usersAPI.getAll();
    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => users.filter(u => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q.toLowerCase())), [users, q]);

  const handleCreate = async (data: any) => {
    const res = await usersAPI.create(data);
    if (res.success) {
      toast.success("Akun baru berhasil dibuat!");
      fetchUsers();
    } else {
      toast.error("Gagal membuat akun", { description: res.message });
    }
  };

  const handleSave = async (id: string, data: any) => {
    const res = await usersAPI.update(id, data);
    if (res.success) {
      toast.success("User berhasil diperbarui");
      fetchUsers(); // Refresh data
    } else {
      toast.error("Gagal memperbarui", { description: res.message });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus akun ${name}? Data tidak dapat dikembalikan.`)) {
      const res = await usersAPI.delete(id);
      if (res.success) {
        toast.success("Akun dihapus");
        fetchUsers();
      } else {
        toast.error("Gagal menghapus", { description: res.message });
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader title="Kelola Akun Pengguna" description={`Total: ${users.length} pengguna terdaftar di Database Live.`} />
        <AddDialog onSave={handleCreate} />
      </div>
      
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Cari nama, email, atau role..." value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <DataTable
        rows={filtered}
        empty={isLoading ? "Memuat data dari database..." : "Tidak ada pengguna"}
        columns={[
          { key: "u", header: "Pengguna", render: u => (
            <div className="flex items-center gap-3">
              <img 
                src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`} 
                alt="" 
                className="h-9 w-9 rounded-full bg-muted object-cover" 
              />
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-xs text-muted-foreground">{u.email}</div>
              </div>
            </div>
          ) },
          { key: "role", header: "Role / Otoritas", render: u => (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              u.role === 'admin' ? 'bg-red-100 text-red-700' : 
              u.role === 'tutor' ? 'bg-blue-100 text-blue-700' : 
              'bg-green-100 text-green-700'
            }`}>
              {u.role === 'admin' && <ShieldCheck className="h-3 w-3" />}
              {u.role.toUpperCase()}
            </span>
          ) },
          { key: "date", header: "Terdaftar", render: u => new Date(u.created_at).toLocaleDateString('id-ID') },
          { key: "act", header: "Aksi", className: "text-right", render: u => (
            <div className="flex justify-end gap-1">
              <EditDialog user={u} onSave={handleSave} />
              <Button size="sm" variant="ghost" className="hover-scale" onClick={() => handleDelete(u.id, u.name)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ) },
        ]}
      />
    </div>
  );
}
