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

export default function TutorProfilEdit() {
  const { currentUser, updateTutor } = useApp();
  const t = currentUser as TutorProfile;
  const [name, setName] = useState(t.name);
  const [university, setUniversity] = useState(t.university);
  const [major, setMajor] = useState(t.major);
  const [bio, setBio] = useState(t.bio);
  const [subjects, setSubjects] = useState<string[]>(t.subjects);
  const [avatar, setAvatar] = useState(t.avatar);

  const toggle = (s: string) => setSubjects(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTutor({ id: t.id, name, university, major, bio, subjects, avatar });
    toast.success("Profil tersimpan");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Kelola Profil" description="Update info dan mata kuliah yang kamu ajarkan." />
      <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-6 shadow-card">
        <div className="flex items-center gap-4">
          <img src={avatar} alt="" className="h-20 w-20 rounded-full bg-muted" />
          <div className="flex-1"><Label>URL Foto Profil</Label><Input value={avatar} onChange={e => setAvatar(e.target.value)} /></div>
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
