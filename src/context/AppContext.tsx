import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import {
  AdminProfile, Booking, ClassItem, MahasiswaProfile, Message, Notification, ProposedClass,
  Review, Role, TutorApplication, TutorProfile,
} from "@/types";
import { usersAPI, classesAPI, bookingsAPI, reviewsAPI } from "@/lib/api";

type AnyUser = TutorProfile | MahasiswaProfile | AdminProfile;

interface AppState {
  currentUser: AnyUser | null;
  admins: AdminProfile[];
  tutors: TutorProfile[];
  mahasiswa: MahasiswaProfile[];
  classes: ClassItem[];
  bookings: Booking[];
  reviews: Review[];
  messages: Message[];
  proposed: ProposedClass[];
  notifications: Notification[];
  tutorApplications: TutorApplication[];
}

interface AppContextType extends AppState {
  login: (email: string, role: Role) => boolean;
  register: (data: Partial<TutorProfile> & { role: Role; name: string; email: string }) => void;
  logout: () => void;
  // booking
  createBooking: (b: Omit<Booking, "id" | "status" | "createdAt">) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking["status"]) => Promise<void>;
  // classes
  upsertClass: (c: ClassItem) => void;
  deleteClass: (id: string) => void;
  enrollClass: (classId: string, mahasiswaId: string) => Promise<void>;
  completeClass: (classId: string) => Promise<void>;
  // tutor profile
  updateTutor: (t: Partial<TutorProfile>) => void;
  // proposed
  addProposed: (p: Omit<ProposedClass, "id" | "createdAt">) => void;
  acceptProposed: (id: string, tutorId: string) => void;
  // chat
  sendMessage: (m: Omit<Message, "id" | "createdAt">) => void;
  // review
  addReview: (r: Omit<Review, "id" | "createdAt">) => void;
  // notif
  markNotifRead: (id: string) => void;
  pushNotification: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
  // admin CRUD
  adminUpdateUser: (id: string, role: Role, patch: Record<string, any>) => void;
  adminDeleteUser: (id: string, role: Role) => void;
  adminDeleteBooking: (id: string) => void;
  adminDeleteReview: (id: string) => void;
  adminDeleteProposed: (id: string) => void;
  adminResetData: () => void;
  // tutor applications
  submitTutorApplication: (a: Omit<TutorApplication, "id" | "createdAt" | "status">) => void;
  approveTutorApplication: (id: string) => void;
  rejectTutorApplication: (id: string, note?: string) => void;
  deleteTutorApplication: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);
const LS_KEY = "mentorin_state_v1";
const LS_USER = "mentorin_user_v1";

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    currentUser: null,
    admins: [],
    tutors: [],
    mahasiswa: [],
    classes: [],
    bookings: [],
    reviews: [],
    messages: [],
    proposed: [],
    notifications: [],
    tutorApplications: [],
  };
}

function loadUser(): AnyUser | null {
  try {
    const raw = localStorage.getItem(LS_USER);
    if (raw) {
      const u = JSON.parse(raw);
      return { ...u, id: String(u.id) };
    }
  } catch {}
  return null;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const s = loadState();
    return { ...s, tutorApplications: s.tutorApplications || [], currentUser: loadUser() };
  });

  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await usersAPI.getAll();
      const allClasses = await classesAPI.getAll();
      const allBookings = await bookingsAPI.getAll();
      const allReviews = await reviewsAPI.getAll();
      
      setState(s => {
        // Sync currentUser dengan data terbaru dari backend (agar avatar & profil yang baru disimpan langsung tampil)
        let updatedCurrentUser = s.currentUser;
        if (s.currentUser) {
          const freshUser = allUsers.find((u: any) => String(u.id) === s.currentUser!.id);
          if (freshUser) {
            updatedCurrentUser = { ...s.currentUser, ...freshUser, id: String(freshUser.id) } as AnyUser;
            // Simpan ke localStorage agar persisten
            localStorage.setItem('mentorin_user_v1', JSON.stringify(updatedCurrentUser));
          }
        }
        
        return {
          ...s,
          currentUser: updatedCurrentUser,
          admins: allUsers.filter((u: any) => u.role === "admin").map((u: any) => ({ ...u, id: String(u.id) })),
          tutors: allUsers.filter((u: any) => u.role === "tutor").map((u: any) => ({ ...u, id: String(u.id) })),
          mahasiswa: allUsers.filter((u: any) => u.role === "mahasiswa").map((u: any) => ({ ...u, id: String(u.id) })),
          classes: allClasses.map((c: any) => ({
            ...c,
            tutorId: String(c.user_id),
            id: String(c.id),
            enrolled: (c.enrolled || []).map((id: any) => String(id))
          })),
          bookings: allBookings.map((b: any) => ({
            ...b,
            id: String(b.id),
            tutorId: String(b.tutor_id),
            mahasiswaId: String(b.mahasiswa_id),
            classId: b.class_id ? String(b.class_id) : null,
          })),
          reviews: allReviews.map((r: any) => ({
            ...r,
            id: String(r.id),
            tutorId: String(r.tutor_id),
            mahasiswaId: String(r.mahasiswa_id),
          }))
        };
      });
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    // Save state changes to localStorage
    const { currentUser, ...rest } = state;
    localStorage.setItem(LS_KEY, JSON.stringify({ ...rest, currentUser: null }));
    if (currentUser) {
      localStorage.setItem(LS_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(LS_USER);
    }
  }, [state.currentUser]);

  const value = useMemo<AppContextType>(() => ({
    ...state,
    login: (email, role) => {
      const pool: AnyUser[] = role === "tutor" ? state.tutors : role === "admin" ? state.admins : state.mahasiswa;
      const user = pool.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) return false;
      const mappedUser = { ...user, id: String(user.id) };
      setState(s => ({ ...s, currentUser: mappedUser }));
      return true;
    },
    register: (data) => {
      if (data.role === "tutor") {
        const t: TutorProfile = {
          id: "t_" + uid(),
          role: "tutor",
          name: data.name,
          email: data.email,
          avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
          university: data.university || "BINUS University",
          major: data.major || "",
          bio: data.bio || "",
          subjects: data.subjects || [],
          rating: 0,
          reviewCount: 0,
          availability: data.availability || {},
        };
        setState(s => ({ ...s, tutors: [t, ...s.tutors], currentUser: t }));
      } else {
        const m: MahasiswaProfile = {
          id: "m_" + uid(),
          role: "mahasiswa",
          name: data.name,
          email: data.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
          university: data.university || "BINUS University",
          major: data.major || "",
        };
        setState(s => ({ ...s, mahasiswa: [m, ...s.mahasiswa], currentUser: m }));
      }
    },
    logout: () => setState(s => ({ ...s, currentUser: null })),
    createBooking: async (b) => {
      const res = await bookingsAPI.create({
        tutor_id: b.tutorId,
        mahasiswa_id: b.mahasiswaId,
        subject: b.subject,
        day: b.day,
        time: b.time,
        topic: b.topic,
      });

      if (res.success) {
        const booking: Booking = { 
          ...res.data, 
          id: String(res.data.id),
          tutorId: String(res.data.tutor_id),
          mahasiswaId: String(res.data.mahasiswa_id),
          classId: res.data.class_id ? String(res.data.class_id) : undefined,
          status: res.data.status || "Pending",
          createdAt: Date.now() 
        };
        const mhsName = state.mahasiswa.find(m => m.id === b.mahasiswaId)?.name || "Mahasiswa";
        const notif: Notification = {
          id: "n_" + uid(), userId: b.tutorId, type: "booking_new",
          title: "Booking baru masuk",
          body: `${mhsName} booking sesi ${b.subject} ${b.day} ${b.time}.`,
          read: false, createdAt: Date.now(), link: "/app/booking-masuk",
        };
        setState(s => ({ ...s, bookings: [booking, ...s.bookings], notifications: [notif, ...s.notifications] }));
      }
    },
    updateBookingStatus: async (id, status) => {
      const res = await bookingsAPI.update(id, { status });
      if (res.success) {
        setState(s => {
          const bookings = s.bookings.map(b => b.id === id ? { ...b, status } : b);
          const target = s.bookings.find(b => b.id === id);
          const notifs = [...s.notifications];
          let classes = s.classes;

          if (target && (status === "Confirmed" || status === "Cancelled")) {
            notifs.unshift({
              id: "n_" + uid(), userId: target.mahasiswaId,
              type: status === "Confirmed" ? "booking_confirmed" : "booking_cancelled",
              title: status === "Confirmed" ? "Booking dikonfirmasi" : "Booking dibatalkan",
              body: `Sesi ${target.subject} ${target.day} ${target.time} ${status === "Confirmed" ? "telah dikonfirmasi tutor." : "dibatalkan."}`,
              read: false, createdAt: Date.now(), link: "/app/riwayat",
            });
          }

          // When confirmed, add student to class enrolled list
          if (target && status === "Confirmed" && target.classId) {
            classes = s.classes.map(c => {
              if (c.id === target.classId && !c.enrolled.includes(target.mahasiswaId)) {
                const newEnrolled = [...c.enrolled, target.mahasiswaId];
                // Fire and forget: update class in backend
                classesAPI.update(c.id, { enrolled: newEnrolled });
                return { ...c, enrolled: newEnrolled };
              }
              return c;
            });
          }

          return { ...s, bookings, classes, notifications: notifs };
        });
      }
    },
    upsertClass: (c) => setState(s => {
      const exists = s.classes.find(x => x.id === c.id);
      const classes = exists ? s.classes.map(x => x.id === c.id ? c : x) : [c, ...s.classes];
      return { ...s, classes };
    }),
    deleteClass: (id) => setState(s => ({ ...s, classes: s.classes.filter(c => c.id !== id) })),
    enrollClass: async (classId, mahasiswaId) => {
      const targetClass = state.classes.find(c => c.id === classId);
      if (!targetClass || targetClass.enrolled.length >= targetClass.capacity) return;

      // Check if there's already a booking for this class+student
      const existingBooking = state.bookings.find(b => b.classId === classId && b.mahasiswaId === mahasiswaId);
      if (existingBooking) return;

      const res = await bookingsAPI.create({
        tutor_id: targetClass.tutorId,
        mahasiswa_id: mahasiswaId,
        subject: targetClass.title + " (" + targetClass.subject + ")",
        day: targetClass.day,
        time: `${targetClass.startTime}-${targetClass.endTime}`,
        class_id: classId
      });

      if (res.success) {
        const booking: Booking = {
          ...res.data,
          id: String(res.data.id),
          tutorId: String(res.data.tutor_id),
          mahasiswaId: String(res.data.mahasiswa_id),
          classId: String(classId),
          status: res.data.status || "Pending",
          createdAt: Date.now()
        };

        const mhsName = state.mahasiswa.find(m => m.id === mahasiswaId)?.name || "Mahasiswa";
        const notif: Notification = {
          id: "n_" + uid(), userId: targetClass.tutorId, type: "booking_new",
          title: "Pendaftar Kelas Baru",
          body: `${mhsName} mendaftar di kelas ${targetClass.title}.`,
          read: false, createdAt: Date.now(), link: "/app/booking-masuk",
        };

        setState(s => ({
          ...s,
          bookings: [booking, ...s.bookings],
          notifications: [notif, ...s.notifications]
        }));
      }
    },
    completeClass: async (classId) => {
      const targetClass = state.classes.find(c => c.id === classId);
      if (!targetClass) return;

      // Update class in backend
      await classesAPI.update(classId, { active: false, completed: true });

      // Mark all related bookings as Completed
      const relatedBookings = state.bookings.filter(
        b => b.classId === classId && (b.status === "Confirmed" || b.status === "Pending")
      );
      for (const b of relatedBookings) {
        await bookingsAPI.update(b.id, { status: "Completed" });
      }

      setState(s => {
        // Update class
        const classes = s.classes.map(c =>
          c.id === classId ? { ...c, active: false, completed: true } : c
        );

        // Update all related bookings to Completed
        const bookings = s.bookings.map(b =>
          b.classId === classId && (b.status === "Confirmed" || b.status === "Pending")
            ? { ...b, status: "Completed" as const }
            : b
        );

        // Notify all enrolled students
        const notifs: Notification[] = targetClass.enrolled.map(mhsId => ({
          id: "n_" + uid() + Math.random(),
          userId: mhsId,
          type: "booking_confirmed" as const,
          title: "Kelas Selesai",
          body: `Kelas "${targetClass.title}" telah selesai. Yuk beri review untuk tutormu!`,
          read: false,
          createdAt: Date.now(),
          link: "/app/riwayat",
        }));

        return {
          ...s,
          classes,
          bookings,
          notifications: [...notifs, ...s.notifications],
        };
      });
    },
    updateTutor: (t) => setState(s => {
      const tutors = s.tutors.map(x => x.id === t.id ? { ...x, ...t } as TutorProfile : x);
      const currentUser = s.currentUser?.id === t.id ? { ...(s.currentUser as TutorProfile), ...t } : s.currentUser;
      return { ...s, tutors, currentUser };
    }),
    addProposed: (p) => setState(s => ({
      ...s,
      proposed: [{ ...p, id: "p_" + uid(), createdAt: Date.now() }, ...s.proposed],
    })),
    acceptProposed: (id, tutorId) => setState(s => {
      const p = s.proposed.find(x => x.id === id);
      if (!p) return s;
      const newClass: ClassItem = {
        id: "c_" + uid(), tutorId, title: p.title, subject: p.subject,
        description: p.description, day: p.preferredDay,
        startTime: p.preferredTime, endTime: addHour(p.preferredTime, 2),
        capacity: 8, enrolled: [], active: true,
      };
      return {
        ...s,
        classes: [newClass, ...s.classes],
        proposed: s.proposed.map(x => x.id === id ? { ...x, acceptedBy: tutorId } : x),
      };
    }),
    sendMessage: (m) => setState(s => {
      const msg: Message = { ...m, id: "msg_" + uid(), createdAt: Date.now() };
      const senderName = [...s.tutors, ...s.mahasiswa].find(u => u.id === m.senderId)?.name || "Seseorang";
      
      let notifs: Notification[] = [];
      if (m.threadId.startsWith("class_")) {
        const classId = m.threadId.split("_")[1];
        const targetClass = s.classes.find(c => c.id === classId);
        if (targetClass) {
          const recipients = [targetClass.tutorId, ...targetClass.enrolled].filter(id => id !== m.senderId);
          notifs = recipients.map(rId => ({
            id: "n_" + uid() + Math.random(), userId: rId, type: "chat_new",
            title: `Grup ${targetClass.title}: ${senderName}`, body: m.text.slice(0, 60),
            read: false, createdAt: Date.now(), link: `/app/chat/${m.threadId}`,
          }));
        }
      } else {
        const [a, b] = m.threadId.split("_");
        const recipient = m.senderId === a ? b : a;
        notifs = [{
          id: "n_" + uid(), userId: recipient, type: "chat_new",
          title: `Pesan baru dari ${senderName}`, body: m.text.slice(0, 60),
          read: false, createdAt: Date.now(), link: `/app/chat/${m.threadId}`,
        }];
      }
      
      return { ...s, messages: [...s.messages, msg], notifications: [...notifs, ...s.notifications] };
    }),
    addReview: (r) => setState(s => {
      const review: Review = { ...r, id: "r_" + uid(), createdAt: Date.now() };
      const tutorReviews = [...s.reviews, review].filter(x => x.tutorId === r.tutorId);
      const avg = tutorReviews.reduce((a, b) => a + b.rating, 0) / tutorReviews.length;
      const tutors = s.tutors.map(t => t.id === r.tutorId
        ? { ...t, rating: Math.round(avg * 10) / 10, reviewCount: tutorReviews.length } : t);
      const bookings = s.bookings.map(b => b.id === r.bookingId ? { ...b, reviewed: true } : b);
      return { ...s, reviews: [...s.reviews, review], tutors, bookings };
    }),
    markNotifRead: (id) => setState(s => ({
      ...s, notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    })),
    pushNotification: (n) => setState(s => ({
      ...s, notifications: [{ ...n, id: "n_" + uid(), createdAt: Date.now(), read: false }, ...s.notifications],
    })),
    adminUpdateUser: (id, role, patch) => setState(s => {
      let currentUser = s.currentUser;
      if (currentUser?.id === id) {
        currentUser = { ...currentUser, ...patch } as AnyUser;
      }
      
      if (role === "tutor") return { ...s, currentUser, tutors: s.tutors.map(t => t.id === id ? { ...t, ...patch } as TutorProfile : t) };
      if (role === "mahasiswa") return { ...s, currentUser, mahasiswa: s.mahasiswa.map(m => m.id === id ? { ...m, ...patch } as MahasiswaProfile : m) };
      return s;
    }),
    adminDeleteUser: (id, role) => setState(s => {
      if (role === "tutor") return {
        ...s,
        tutors: s.tutors.filter(t => t.id !== id),
        classes: s.classes.filter(c => c.tutorId !== id),
        bookings: s.bookings.filter(b => b.tutorId !== id),
        reviews: s.reviews.filter(r => r.tutorId !== id),
      };
      if (role === "mahasiswa") return {
        ...s,
        mahasiswa: s.mahasiswa.filter(m => m.id !== id),
        bookings: s.bookings.filter(b => b.mahasiswaId !== id),
        proposed: s.proposed.filter(p => p.mahasiswaId !== id),
      };
      return s;
    }),
    adminDeleteBooking: (id) => setState(s => ({ ...s, bookings: s.bookings.filter(b => b.id !== id) })),
    adminDeleteReview: (id) => setState(s => ({ ...s, reviews: s.reviews.filter(r => r.id !== id) })),
    adminDeleteProposed: (id) => setState(s => ({ ...s, proposed: s.proposed.filter(p => p.id !== id) })),
    adminResetData: () => {
      localStorage.removeItem(LS_KEY);
      localStorage.removeItem(LS_USER);
      window.location.reload();
    },
    submitTutorApplication: (a) => setState(s => {
      const app: TutorApplication = { ...a, id: "ta_" + uid(), createdAt: Date.now(), status: "Pending" };
      const notifs: Notification[] = s.admins.map(ad => ({
        id: "n_" + uid(), userId: ad.id, type: "booking_new",
        title: "Pendaftaran tutor baru",
        body: `${a.name} mendaftar sebagai tutor (${a.subjects.slice(0, 2).join(", ")}).`,
        read: false, createdAt: Date.now(), link: "/app/admin/aplikasi-tutor",
      }));
      return { ...s, tutorApplications: [app, ...s.tutorApplications], notifications: [...notifs, ...s.notifications] };
    }),
    approveTutorApplication: (id) => setState(s => {
      const a = s.tutorApplications.find(x => x.id === id);
      if (!a) return s;
      const t: TutorProfile = {
        id: "t_" + uid(),
        role: "tutor",
        name: a.name,
        email: a.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(a.name)}`,
        university: a.university || "BINUS University",
        major: a.major,
        bio: a.bio,
        subjects: a.subjects,
        rating: 0,
        reviewCount: 0,
        availability: {},
      };
      return {
        ...s,
        tutors: [t, ...s.tutors],
        tutorApplications: s.tutorApplications.map(x => x.id === id ? { ...x, status: "Approved", reviewedAt: Date.now() } : x),
      };
    }),
    rejectTutorApplication: (id, note) => setState(s => ({
      ...s,
      tutorApplications: s.tutorApplications.map(x => x.id === id ? { ...x, status: "Rejected", reviewedAt: Date.now(), reviewNote: note } : x),
    })),
    deleteTutorApplication: (id) => setState(s => ({
      ...s, tutorApplications: s.tutorApplications.filter(x => x.id !== id),
    })),
  }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

function addHour(time: string, h: number) {
  const [hh, mm] = time.split(":").map(Number);
  const total = hh + h;
  return `${String(total).padStart(2, "0")}:${String(mm || 0).padStart(2, "0")}`;
}
