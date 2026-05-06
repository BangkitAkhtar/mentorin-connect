import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplyTutor from "./pages/ApplyTutor";
import ApplyTutorSuccess from "./pages/ApplyTutorSuccess";

import DashboardLayout from "./pages/app/DashboardLayout";
import Home from "./pages/app/Home";
import Chat from "./pages/app/Chat";

import Katalog from "./pages/app/mahasiswa/Katalog";
import TutorList from "./pages/app/mahasiswa/TutorList";
import TutorProfile from "./pages/app/mahasiswa/TutorProfile";
import Booking from "./pages/app/mahasiswa/Booking";
import Riwayat from "./pages/app/mahasiswa/Riwayat";
import Usulan from "./pages/app/mahasiswa/Usulan";
import MahasiswaProfil from "./pages/app/mahasiswa/Profil";
import KelasSayaMahasiswa from "./pages/app/mahasiswa/KelasSaya";

import Profil from "./pages/app/tutor/Profil";
import Jadwal from "./pages/app/tutor/Jadwal";
import KelasSaya from "./pages/app/tutor/KelasSaya";
import BookingMasuk from "./pages/app/tutor/BookingMasuk";
import UsulanTutor from "./pages/app/tutor/UsulanTutor";
import RiwayatTutor from "./pages/app/tutor/RiwayatTutor";

import AdminUsers from "./pages/app/admin/Users";
import AdminKelas from "./pages/app/admin/Kelas";
import AdminBooking from "./pages/app/admin/Booking";
import AdminUsulan from "./pages/app/admin/Usulan";
import AdminReview from "./pages/app/admin/Review";
import AdminAplikasiTutor from "./pages/app/admin/AplikasiTutor";

import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/apply-tutor" element={<PageTransition><ApplyTutor /></PageTransition>} />
        <Route path="/apply-tutor/sukses" element={<PageTransition><ApplyTutorSuccess /></PageTransition>} />

        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<PageTransition><Home /></PageTransition>} />
          <Route path="chat" element={<PageTransition><Chat /></PageTransition>} />
          <Route path="chat/:threadId" element={<PageTransition><Chat /></PageTransition>} />

          {/* Mahasiswa */}
          <Route path="profil-mahasiswa" element={<PageTransition><MahasiswaProfil /></PageTransition>} />
          <Route path="kelas-mahasiswa" element={<PageTransition><KelasSayaMahasiswa /></PageTransition>} />
          <Route path="katalog" element={<PageTransition><Katalog /></PageTransition>} />
          <Route path="tutor" element={<PageTransition><TutorList /></PageTransition>} />
          <Route path="tutor/:id" element={<PageTransition><TutorProfile /></PageTransition>} />
          <Route path="booking/:tutorId" element={<PageTransition><Booking /></PageTransition>} />
          <Route path="riwayat" element={<PageTransition><Riwayat /></PageTransition>} />
          <Route path="usulan" element={<PageTransition><Usulan /></PageTransition>} />

          {/* Tutor */}
          <Route path="profil" element={<PageTransition><Profil /></PageTransition>} />
          <Route path="jadwal" element={<PageTransition><Jadwal /></PageTransition>} />
          <Route path="kelas-saya" element={<PageTransition><KelasSaya /></PageTransition>} />
          <Route path="booking-masuk" element={<PageTransition><BookingMasuk /></PageTransition>} />
          <Route path="usulan-tutor" element={<PageTransition><UsulanTutor /></PageTransition>} />
          <Route path="riwayat-tutor" element={<PageTransition><RiwayatTutor /></PageTransition>} />

          {/* Admin */}
          <Route path="admin/users" element={<PageTransition><AdminUsers /></PageTransition>} />
          <Route path="admin/kelas" element={<PageTransition><AdminKelas /></PageTransition>} />
          <Route path="admin/booking" element={<PageTransition><AdminBooking /></PageTransition>} />
          <Route path="admin/usulan" element={<PageTransition><AdminUsulan /></PageTransition>} />
          <Route path="admin/review" element={<PageTransition><AdminReview /></PageTransition>} />
          <Route path="admin/aplikasi-tutor" element={<PageTransition><AdminAplikasiTutor /></PageTransition>} />
        </Route>

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
