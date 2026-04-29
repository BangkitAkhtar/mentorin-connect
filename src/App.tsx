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

import Profil from "./pages/app/tutor/Profil";
import Jadwal from "./pages/app/tutor/Jadwal";
import KelasSaya from "./pages/app/tutor/KelasSaya";
import BookingMasuk from "./pages/app/tutor/BookingMasuk";
import UsulanTutor from "./pages/app/tutor/UsulanTutor";
import RiwayatTutor from "./pages/app/tutor/RiwayatTutor";

import AdminMahasiswa from "./pages/app/admin/Mahasiswa";
import AdminTutor from "./pages/app/admin/Tutor";
import AdminKelas from "./pages/app/admin/Kelas";
import AdminBooking from "./pages/app/admin/Booking";
import AdminUsulan from "./pages/app/admin/Usulan";
import AdminReview from "./pages/app/admin/Review";
import AdminAplikasiTutor from "./pages/app/admin/AplikasiTutor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/apply-tutor" element={<ApplyTutor />} />
            <Route path="/apply-tutor/sukses" element={<ApplyTutorSuccess />} />

            <Route path="/app" element={<DashboardLayout />}>
              <Route index element={<Home />} />
              <Route path="chat" element={<Chat />} />

              {/* Mahasiswa */}
              <Route path="katalog" element={<Katalog />} />
              <Route path="tutor" element={<TutorList />} />
              <Route path="tutor/:id" element={<TutorProfile />} />
              <Route path="booking/:tutorId" element={<Booking />} />
              <Route path="riwayat" element={<Riwayat />} />
              <Route path="usulan" element={<Usulan />} />

              {/* Tutor */}
              <Route path="profil" element={<Profil />} />
              <Route path="jadwal" element={<Jadwal />} />
              <Route path="kelas-saya" element={<KelasSaya />} />
              <Route path="booking-masuk" element={<BookingMasuk />} />
              <Route path="usulan-tutor" element={<UsulanTutor />} />
              <Route path="riwayat-tutor" element={<RiwayatTutor />} />

              {/* Admin */}
              <Route path="admin/mahasiswa" element={<AdminMahasiswa />} />
              <Route path="admin/tutor" element={<AdminTutor />} />
              <Route path="admin/kelas" element={<AdminKelas />} />
              <Route path="admin/booking" element={<AdminBooking />} />
              <Route path="admin/usulan" element={<AdminUsulan />} />
              <Route path="admin/review" element={<AdminReview />} />
              <Route path="admin/aplikasi-tutor" element={<AdminAplikasiTutor />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
