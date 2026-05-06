import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MahasiswaProfile } from "@/types";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";

export default function MahasiswaProfilEdit() {
  const { currentUser, adminUpdateUser } = useApp();
  const m = currentUser as MahasiswaProfile;
  
  const [name, setName] = useState(m.name || "");
  const [university, setUniversity] = useState(m.university || "BINUS University");
  const [major, setMajor] = useState(m.major || "");
  const [avatar, setAvatar] = useState(m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.name)}`);
  const [isUploading, setIsUploading] = useState(false);
  const [password, setPassword] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.loading("Mengunggah foto...", { id: "upload-avatar" });
    
    const response = await authAPI.uploadAvatar(file);
    
    if (response.success) {
      setAvatar(response.url);
      toast.success("Foto berhasil diunggah", { id: "upload-avatar" });
    } else {
      toast.error(response.message || "Gagal mengunggah foto", { id: "upload-avatar" });
    }
    
    setIsUploading(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call backend API to update password if provided
    if (password) {
      toast.loading("Menyimpan password...", { id: "update-profile" });
      const res = await usersAPI.update(m.id, {
        role: "mahasiswa",
        name,
        password
      });
      if (!res.success) {
        toast.error(res.message || "Gagal mengubah password", { id: "update-profile" });
        return;
      }
    }

    // Gunakan adminUpdateUser yang sudah ada di AppContext (karena ini hanya update state lokal sementara)
    adminUpdateUser(m.id, "mahasiswa", { name, university, major, avatar });
    
    // Perbarui localstorage juga agar persisten di Frontend
    const updatedUser = { ...m, name, university, major, avatar };
    localStorage.setItem('mentorin_user_v1', JSON.stringify(updatedUser));
    
    toast.success("Profil berhasil diperbarui", { id: "update-profile" });
    setPassword("");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Kelola Profil" description="Update informasi data diri kamu." />
      <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-6 shadow-card">
        <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
          <img src={avatar} alt="" className="h-20 w-20 rounded-full bg-muted object-cover" />
          <div className="flex-1 space-y-2 w-full">
            <Label>Foto Profil (Pilih file atau masukkan URL)</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input type="file" accept="image/*" onChange={handleUpload} disabled={isUploading} className="cursor-pointer file:text-primary file:bg-primary/10 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-2 file:cursor-pointer" />
              <Input value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="Atau paste URL gambar..." />
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Nama Lengkap</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div><Label>Email</Label><Input value={m.email} disabled className="bg-muted" /></div>
          <div><Label>Universitas</Label><Input value={university} onChange={e => setUniversity(e.target.value)} /></div>
          <div><Label>Jurusan</Label><Input value={major} onChange={e => setMajor(e.target.value)} /></div>
          <div className="sm:col-span-2">
            <Label>Password Baru (Opsional)</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Kosongkan jika tidak ingin mengubah password" />
          </div>
        </div>
        <Button type="submit">Simpan Profil</Button>
      </form>
    </div>
  );
}
