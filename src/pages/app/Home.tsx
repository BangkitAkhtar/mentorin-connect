import { useApp } from "@/context/AppContext";
import MahasiswaHome from "./mahasiswa/Home";
import TutorHome from "./tutor/Home";
import AdminHome from "./admin/Home";

export default function DashboardHome() {
  const { currentUser } = useApp();
  if (!currentUser) return null;
  if (currentUser.role === "admin") return <AdminHome />;
  return currentUser.role === "tutor" ? <TutorHome /> : <MahasiswaHome />;
}
