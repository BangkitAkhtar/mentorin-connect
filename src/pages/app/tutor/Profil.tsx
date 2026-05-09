import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SUBJECTS, TutorProfile } from "@/types";
import { toast } from "sonner";
import { X } from "lucide-react";
import { authAPI, usersAPI } from "@/lib/api";

export default function TutorProfilEdit() {
  const { currentUser, updateTutor } = useApp();
  const t = currentUser as TutorProfile;
  const [name, setName] = useState(t.name || "");
  const [university, setUniversity] = useState(t.university || "BINUS University");
  const [major, setMajor] = useState(t.major || "");
  const [bio, setBio] = useState(t.bio || "");
  const [subjects, setSubjects] = useState<string[]>(t.subjects || []);
  const [avatar, setAvatar] = useState(t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.name)}`);
  const [isUploading, setIsUploading] = useState(false);

  const toggle = (s: string) => setSubjects(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

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
    
    toast.loading("Menyimpan profil...", { id: "save-profile" });
    
    // Simpan ke database backend
    const res = await usersAPI.update(t.id, {
      role: "tutor",
      name,
      university,
      major,
      bio,
      subjects,
      avatar,
    });
    
    if (!res.success) {
      toast.error(res.message || "Gagal menyimpan profil", { id: "save-profile" });
      return;
    }
    
    // Update state lokal React
    updateTutor({ id: t.id, name, university, major, bio, subjects, avatar });
    
    // Update localStorage agar persisten di frontend
    const updatedUser = { ...t, name, university, major, bio, subjects, avatar };
    localStorage.setItem('mentorin_user_v1', JSON.stringify(updatedUser));
    
    toast.success("Profil berhasil disimpan", { id: "save-profile" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Kelola Profil" description="Update info dan mata kuliah yang kamu ajarkan." />
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
          <div><Label>Nama</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div><Label>Universitas</Label><Input value={university} onChange={e => setUniversity(e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Jurusan</Label><Input value={major} onChange={e => setMajor(e.target.value)} /></div>
        </div>
        <div><Label>Bio</Label><Textarea rows={4} value={bio} onChange={e => setBio(e.target.value)} /></div>
        <div>
          <Label>Mata kuliah yang diajarkan</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {SUBJECTS.map(s => {
              const active = subjects.includes(s);
              return (
                <button type="button" key={s} onClick={() => toggle(s)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40"}`}>
                  {active && <X className="mr-1 inline h-3 w-3" />}{s}
                </button>
              );
            })}
          </div>
        </div>
        <Button type="submit">Simpan Profil</Button>
      </form>
    </div>
  );
}
