import { AdminProfile, Booking, ClassItem, MahasiswaProfile, Message, Notification, ProposedClass, Review, TutorProfile } from "@/types";

export const seedAdmins: AdminProfile[] = [
  {
    id: "a1",
    role: "admin",
    name: "Admin SASC",
    email: "admin@binus.ac.id",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    university: "BINUS University",
    major: "Student Academic Support Center",
  },
];

export const seedTutors: TutorProfile[] = [
  {
    id: "t1",
    role: "tutor",
    name: "Aulia Rahman",
    email: "aulia@binus.ac.id",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aulia",
    university: "BINUS University",
    major: "Computer Science",
    bio: "Mahasiswa CS semester 6. Suka bantu teman paham algoritma & web dev dengan analogi sederhana.",
    subjects: ["Algoritma & Pemrograman", "Pemrograman Web", "Struktur Data"],
    rating: 4.9,
    reviewCount: 32,
    availability: {
      Senin: ["09:00-11:00", "14:00-16:00"],
      Rabu: ["10:00-12:00"],
      Jumat: ["13:00-15:00", "16:00-18:00"],
    },
  },
  {
    id: "t2",
    role: "tutor",
    name: "Bintang Pratama",
    email: "bintang@binus.ac.id",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bintang",
    university: "BINUS University",
    major: "Mathematics",
    bio: "Asisten dosen Kalkulus. Senang menjelaskan konsep matematika dari dasar sampai mahir.",
    subjects: ["Kalkulus", "Statistika", "Fisika Dasar"],
    rating: 4.8,
    reviewCount: 21,
    availability: {
      Selasa: ["08:00-10:00", "13:00-15:00"],
      Kamis: ["10:00-12:00"],
      Sabtu: ["09:00-11:00"],
    },
  },
  {
    id: "t3",
    role: "tutor",
    name: "Citra Maharani",
    email: "citra@binus.ac.id",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Citra",
    university: "BINUS University",
    major: "Information Systems",
    bio: "Fokus di basis data dan analisis sistem. Pernah jadi mentor SASC selama 2 semester.",
    subjects: ["Basis Data", "Sistem Operasi", "Jaringan Komputer"],
    rating: 4.7,
    reviewCount: 18,
    availability: {
      Senin: ["13:00-15:00"],
      Rabu: ["09:00-11:00", "15:00-17:00"],
      Jumat: ["10:00-12:00"],
    },
  },
  {
    id: "t4",
    role: "tutor",
    name: "Dimas Hartanto",
    email: "dimas@binus.ac.id",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dimas",
    university: "BINUS University",
    major: "Computer Science",
    bio: "Suka kompetisi pemrograman dan bantu temen-temen ngerti struktur data secara visual.",
    subjects: ["Algoritma & Pemrograman", "Struktur Data", "Pemrograman Web"],
    rating: 4.6,
    reviewCount: 12,
    availability: {
      Selasa: ["15:00-17:00"],
      Kamis: ["13:00-15:00", "16:00-18:00"],
    },
  },
];

export const seedMahasiswa: MahasiswaProfile[] = [
  {
    id: "m1",
    role: "mahasiswa",
    name: "Demo Mahasiswa",
    email: "demo@binus.ac.id",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
    university: "BINUS University",
    major: "Computer Science",
  },
  {
    id: "m2",
    role: "mahasiswa",
    name: "Rina Kusuma",
    email: "rina@binus.ac.id",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rina",
    university: "BINUS University",
    major: "Information Systems",
  },
];

export const seedClasses: ClassItem[] = [
  {
    id: "c1",
    tutorId: "t1",
    title: "Bedah Algoritma Sorting",
    subject: "Algoritma & Pemrograman",
    description: "Pembahasan bubble, merge, quick sort dengan visualisasi.",
    day: "Senin",
    startTime: "14:00",
    endTime: "16:00",
    capacity: 8,
    enrolled: ["m2"],
    active: true,
  },
  {
    id: "c2",
    tutorId: "t2",
    title: "Kalkulus Integral untuk Pemula",
    subject: "Kalkulus",
    description: "Konsep integral tentu dan tak tentu, latihan soal UTS.",
    day: "Selasa",
    startTime: "13:00",
    endTime: "15:00",
    capacity: 10,
    enrolled: [],
    active: true,
  },
  {
    id: "c3",
    tutorId: "t3",
    title: "SQL & ERD Workshop",
    subject: "Basis Data",
    description: "Latihan ERD, normalisasi, dan query SQL kompleks.",
    day: "Rabu",
    startTime: "15:00",
    endTime: "17:00",
    capacity: 6,
    enrolled: ["m1"],
    active: true,
  },
  {
    id: "c4",
    tutorId: "t1",
    title: "React & Tailwind dari Nol",
    subject: "Pemrograman Web",
    description: "Membangun aplikasi React modern dengan Tailwind CSS.",
    day: "Jumat",
    startTime: "16:00",
    endTime: "18:00",
    capacity: 12,
    enrolled: [],
    active: true,
  },
  {
    id: "c5",
    tutorId: "t4",
    title: "Linked List & Tree Visualisasi",
    subject: "Struktur Data",
    description: "Pemahaman pointer, traversal tree, dan implementasi.",
    day: "Kamis",
    startTime: "16:00",
    endTime: "18:00",
    capacity: 8,
    enrolled: [],
    active: true,
  },
];

const now = Date.now();
export const seedBookings: Booking[] = [
  {
    id: "b1", mahasiswaId: "m1", tutorId: "t2", subject: "Kalkulus",
    day: "Selasa", time: "08:00", topic: "Bantuan soal limit dan turunan",
    status: "Confirmed", createdAt: now - 86400000,
  },
  {
    id: "b2", mahasiswaId: "m1", tutorId: "t1", subject: "Pemrograman Web",
    day: "Jumat", time: "13:00", topic: "Setup React + routing dasar",
    status: "Pending", createdAt: now - 3600000,
  },
  {
    id: "b3", mahasiswaId: "m1", tutorId: "t3", subject: "Basis Data",
    day: "Senin", time: "13:00", topic: "Normalisasi 1NF-3NF",
    status: "Completed", createdAt: now - 86400000 * 7, reviewed: false,
  },
];

export const seedReviews: Review[] = [
  { id: "r1", bookingId: "x", tutorId: "t1", mahasiswaId: "m2", rating: 5, comment: "Sangat sabar menjelaskan, langsung paham!", createdAt: now - 86400000 * 3 },
  { id: "r2", bookingId: "x", tutorId: "t1", mahasiswaId: "m1", rating: 5, comment: "Materi runtut dan ada contoh kode.", createdAt: now - 86400000 * 10 },
  { id: "r3", bookingId: "x", tutorId: "t2", mahasiswaId: "m2", rating: 5, comment: "Penjelasan kalkulus jadi mudah.", createdAt: now - 86400000 * 5 },
  { id: "r4", bookingId: "x", tutorId: "t3", mahasiswaId: "m1", rating: 4, comment: "Workshop SQL-nya seru, banyak latihan.", createdAt: now - 86400000 * 14 },
];

export const seedMessages: Message[] = [
  { id: "msg1", threadId: "m1_t2", senderId: "t2", text: "Halo! Sampai jumpa Selasa ya, siapkan catatan limit kamu.", createdAt: now - 7200000 },
  { id: "msg2", threadId: "m1_t2", senderId: "m1", text: "Siap kak, terima kasih!", createdAt: now - 7100000 },
];

export const seedProposed: ProposedClass[] = [
  {
    id: "p1", mahasiswaId: "m2", title: "Persiapan UTS Statistika",
    subject: "Statistika", preferredDay: "Sabtu", preferredTime: "10:00",
    description: "Butuh review distribusi normal dan uji hipotesis untuk UTS minggu depan.",
    createdAt: now - 86400000 * 2,
  },
];

export const seedNotifications: Notification[] = [
  { id: "n1", userId: "m1", type: "booking_confirmed", title: "Booking dikonfirmasi", body: "Sesi Kalkulus dengan Bintang Selasa 08:00 dikonfirmasi.", read: false, createdAt: now - 3600000, link: "/app/riwayat" },
  { id: "n2", userId: "t1", type: "booking_new", title: "Booking baru masuk", body: "Demo Mahasiswa booking sesi Pemrograman Web Jumat 13:00.", read: false, createdAt: now - 1800000, link: "/app/booking-masuk" },
];
