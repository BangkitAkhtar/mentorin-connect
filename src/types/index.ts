export type Role = "mahasiswa" | "tutor" | "admin";

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  avatar: string;
  university: string;
  major: string;
}

export interface AdminProfile extends User {
  role: "admin";
}

export interface TutorProfile extends User {
  role: "tutor";
  bio: string;
  subjects: string[];
  rating: number;
  reviewCount: number;
  /** key: "Senin" | ... value: array of "HH:MM-HH:MM" */
  availability: Record<string, string[]>;
}

export interface MahasiswaProfile extends User {
  role: "mahasiswa";
}

export interface ClassItem {
  id: string;
  tutorId: string;
  title: string;
  subject: string;
  description: string;
  day: string;     // Senin..Minggu
  startTime: string; // HH:MM
  endTime: string;
  capacity: number;
  enrolled: string[]; // mahasiswa ids
  active: boolean;
  completed?: boolean;
  meetingLink?: string;
  materials?: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Ongoing" | "Completed" | "Cancelled";

export interface Booking {
  id: string;
  mahasiswaId: string;
  tutorId: string;
  subject: string;
  day: string;
  time: string; // HH:MM
  topic: string;
  status: BookingStatus;
  createdAt: number;
  reviewed?: boolean;
  classId?: string; // If this booking belongs to a class
}

export interface Review {
  id: string;
  bookingId: string;
  tutorId: string;
  mahasiswaId: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export interface MessageAttachment {
  name: string;
  url: string;       // object URL or data URL
  type: string;      // MIME type
  size: number;      // bytes
}

export interface Message {
  id: string;
  threadId: string; // `${mahasiswaId}_${tutorId}` or `class_${classId}`
  senderId: string;
  text: string;
  createdAt: number;
  attachment?: MessageAttachment;
}

export interface ProposedClass {
  id: string;
  mahasiswaId: string;
  title: string;
  subject: string;
  preferredDay: string;
  preferredTime: string;
  description: string;
  createdAt: number;
  acceptedBy?: string;
}

export type TutorApplicationStatus = "Pending" | "Approved" | "Rejected";

export interface TutorApplication {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  semester: string;
  bio: string;
  subjects: string[];
  motivation: string;
  experience: string;
  status: TutorApplicationStatus;
  createdAt: number;
  reviewedAt?: number;
  reviewNote?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "booking_new" | "booking_confirmed" | "booking_cancelled" | "chat_new" | "session_reminder";
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
  link?: string;
}

export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
export const SUBJECTS = [
  "Kalkulus",
  "Pemrograman Web",
  "Basis Data",
  "Fisika Dasar",
  "Algoritma & Pemrograman",
  "Statistika",
  "Struktur Data",
  "Sistem Operasi",
  "Jaringan Komputer",
  "Bahasa Inggris",
];
