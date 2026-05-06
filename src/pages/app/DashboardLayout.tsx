import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/NotificationBell";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, BookOpen, Users, History, MessageSquare, LogOut, Lightbulb,
  CalendarClock, ClipboardList, UserRound, ShieldCheck, Star, GraduationCap, UserPlus,
} from "lucide-react";
import { Footer } from "@/components/Footer";

const mahasiswaNav = [
  { to: "/app", label: "Beranda", icon: LayoutDashboard, end: true },
  { to: "/app/profil-mahasiswa", label: "Kelola Profil", icon: UserRound },
  { to: "/app/kelas-mahasiswa", label: "Kelas Saya", icon: GraduationCap },
  { to: "/app/katalog", label: "Katalog Kelas", icon: BookOpen },
  { to: "/app/tutor", label: "Daftar Tutor", icon: Users },
  { to: "/app/usulan", label: "Saran Kelas", icon: Lightbulb },
  { to: "/app/riwayat", label: "Riwayat Sesi", icon: History },
  { to: "/app/chat", label: "Chat", icon: MessageSquare },
];

const tutorNav = [
  { to: "/app", label: "Beranda", icon: LayoutDashboard, end: true },
  { to: "/app/profil", label: "Kelola Profil", icon: UserRound },
  { to: "/app/jadwal", label: "Jadwal", icon: CalendarClock },
  { to: "/app/kelas-saya", label: "Kelola Kelas", icon: BookOpen },
  { to: "/app/booking-masuk", label: "Booking Masuk", icon: ClipboardList },
  { to: "/app/usulan-tutor", label: "Saran Mahasiswa", icon: Lightbulb },
  { to: "/app/riwayat-tutor", label: "Riwayat & Review", icon: History },
  { to: "/app/chat", label: "Chat", icon: MessageSquare },
];

const adminNav = [
  { to: "/app", label: "Beranda", icon: LayoutDashboard, end: true },
  { to: "/app/admin/users", label: "Kelola Akun", icon: Users },
  { to: "/app/admin/aplikasi-tutor", label: "Aplikasi Tutor", icon: UserPlus },
  { to: "/app/admin/kelas", label: "Kelas", icon: BookOpen },
  { to: "/app/admin/booking", label: "Booking", icon: ClipboardList },
  { to: "/app/admin/usulan", label: "Saran Kelas", icon: Lightbulb },
  { to: "/app/admin/review", label: "Review", icon: Star },
];

function AppSidebar() {
  const { currentUser, logout } = useApp();
  if (!currentUser) return null;
  const items = currentUser.role === "admin" ? adminNav : currentUser.role === "tutor" ? tutorNav : mahasiswaNav;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center px-2 py-2">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(it => (
                <SidebarMenuItem key={it.to}>
                  <SidebarMenuButton asChild>
                    <NavLink to={it.to} end={(it as any).end} className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold">
                      <it.icon className="h-4 w-4" />
                      <span>{it.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => { logout(); }}>
                  <LogOut className="h-4 w-4" />
                  <span>Keluar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardLayout() {
  const { currentUser } = useApp();
  const location = useLocation();
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location }} />;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur-md">
            <SidebarTrigger />
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                {currentUser.role === "admin" ? "Admin" : currentUser.role === "tutor" ? "Tutor" : "Mahasiswa"}
              </span>
              <span className="hidden font-medium text-muted-foreground sm:inline">Halo, {currentUser.name.split(" ")[0]} 👋</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden rounded-full border bg-card px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary md:inline-block">
                SASC BINUS Project
              </span>
              <NotificationBell />
              <img src={currentUser.avatar} alt="" className="h-9 w-9 rounded-full border bg-muted" />
            </div>
          </header>

          <main key={location.pathname} className="flex-1 animate-fade-in p-4 md:p-8">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
