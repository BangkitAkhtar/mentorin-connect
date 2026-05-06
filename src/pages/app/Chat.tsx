import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Send, MessageSquare, Search, Paperclip, X, FileText,
  Image as ImageIcon, File as FileIcon, Users, Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime, formatDistanceToNow } from "@/lib/format";
import { EmptyState } from "@/components/EmptyState";
import { useParams, useNavigate } from "react-router-dom";
import { MessageAttachment } from "@/types";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
  if (type === "application/pdf") return <FileText className="h-4 w-4 text-red-500" />;
  return <FileIcon className="h-4 w-4 text-blue-500" />;
}

export default function Chat() {
  const { messages, currentUser, tutors, mahasiswa, admins, bookings, classes, sendMessage } = useApp();
  const { threadId: urlThreadId } = useParams();
  const navigate = useNavigate();

  const allUsers = useMemo(() => [...tutors, ...mahasiswa, ...admins], [tutors, mahasiswa, admins]);

  // build threads from bookings (counterparties) and classes (groups)
  const threads = useMemo(() => {
    const ids = new Set<string>();
    bookings.forEach(b => {
      if (b.mahasiswaId === currentUser!.id || b.tutorId === currentUser!.id) {
        const other = b.mahasiswaId === currentUser!.id ? b.tutorId : b.mahasiswaId;
        ids.add(other);
      }
    });
    // also include DM threads from existing messages
    messages.forEach(m => {
      if (m.threadId.startsWith("class_")) return;
      const parts = m.threadId.split("_");
      if (parts.length === 2) {
        const [a, b] = parts;
        if (a === currentUser!.id) ids.add(b);
        else if (b === currentUser!.id) ids.add(a);
      }
    });

    const userThreads = Array.from(ids).map(id => {
      const user = allUsers.find(u => u.id === id);
      // Thread ID convention: sorted IDs to be consistent
      const threadId = [currentUser!.id, id].sort().join("_");
      const threadMsgs = messages.filter(m => m.threadId === threadId);
      const lastMsg = threadMsgs.length ? threadMsgs[threadMsgs.length - 1] : undefined;
      return { id, user, threadId, lastMsg, isGroup: false };
    }).filter(t => t.user);

    // class group threads
    const classThreads = classes
      .filter(c => c.tutorId === currentUser!.id || c.enrolled.includes(currentUser!.id))
      .map(c => {
        const threadId = `class_${c.id}`;
        const threadMsgs = messages.filter(m => m.threadId === threadId);
        const lastMsg = threadMsgs.length ? threadMsgs[threadMsgs.length - 1] : undefined;
        return {
          id: c.id,
          user: {
            name: c.title,
            avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(c.title)}`,
            major: `${c.enrolled.length + 1} anggota`
          },
          threadId,
          lastMsg,
          isGroup: true,
        };
      });

    return [...classThreads, ...userThreads].sort(
      (a, b) => (b.lastMsg?.createdAt || 0) - (a.lastMsg?.createdAt || 0)
    );
  }, [bookings, messages, currentUser, allUsers, classes]);

  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [pendingAttachment, setPendingAttachment] = useState<MessageAttachment | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set active thread from URL param
  useEffect(() => {
    if (urlThreadId) {
      setActiveThread(urlThreadId);
    } else if (!activeThread && threads.length > 0) {
      setActiveThread(threads[0].threadId);
    }
  }, [urlThreadId, threads.length]);

  const activeMessages = useMemo(
    () => messages.filter(m => m.threadId === activeThread).sort((a, b) => a.createdAt - b.createdAt),
    [messages, activeThread]
  );
  const activeThreadInfo = threads.find(t => t.threadId === activeThread);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, [activeMessages.length, activeThread]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      alert("File terlalu besar. Maksimal 25MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPendingAttachment({
        name: file.name,
        url: reader.result as string,
        type: file.type,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const send = useCallback(() => {
    if ((!text.trim() && !pendingAttachment) || !activeThread) return;
    sendMessage({
      threadId: activeThread,
      senderId: currentUser!.id,
      text: text.trim() || (pendingAttachment ? `📎 ${pendingAttachment.name}` : ""),
      attachment: pendingAttachment || undefined,
    });
    setText("");
    setPendingAttachment(null);
  }, [text, pendingAttachment, activeThread, sendMessage, currentUser]);

  const startDMWith = useCallback((userId: string) => {
    const threadId = [currentUser!.id, userId].sort().join("_");
    setActiveThread(threadId);
    setSidebarSearch("");
    navigate(`/app/chat/${threadId}`, { replace: true });
  }, [currentUser, navigate]);

  // Filter threads for sidebar search
  const filteredThreads = useMemo(() => {
    if (!sidebarSearch.trim()) return threads;
    const q = sidebarSearch.toLowerCase();
    return threads.filter(t => t.user?.name?.toLowerCase().includes(q));
  }, [threads, sidebarSearch]);

  // Search all users for new chat (shown in dropdown when sidebar search is active)
  const searchableUsers = useMemo(() => {
    if (!sidebarSearch.trim()) return [];
    const q = sidebarSearch.toLowerCase();
    // Exclude users already visible in filtered threads
    const threadUserIds = new Set(filteredThreads.map(t => t.id));
    return allUsers
      .filter(u => u.id !== currentUser!.id && u.name.toLowerCase().includes(q) && !threadUserIds.has(u.id))
      .slice(0, 5);
  }, [allUsers, currentUser, sidebarSearch, filteredThreads]);

  // If activeThread is not in threads list (a new DM thread), build info from allUsers
  const activeUserInfo = useMemo(() => {
    if (activeThreadInfo) return activeThreadInfo;
    if (!activeThread || activeThread.startsWith("class_")) return null;
    const parts = activeThread.split("_");
    const otherId = parts.find(p => p !== currentUser!.id);
    const user = allUsers.find(u => u.id === otherId);
    if (!user) return null;
    return { id: otherId, user, threadId: activeThread, lastMsg: undefined, isGroup: false };
  }, [activeThreadInfo, activeThread, currentUser, allUsers]);

  return (
    <div className="space-y-6">
      <PageHeader title="Chat" description="Diskusi dengan partner belajarmu." />
      <div className="grid h-[calc(100vh-220px)] min-h-[500px] grid-cols-1 overflow-hidden rounded-2xl border bg-card shadow-card md:grid-cols-[320px_1fr]">

        {/* ============ SIDEBAR ============ */}
        <aside className="flex flex-col overflow-hidden border-r bg-muted/30">
          {/* Search Bar */}
          <div className="relative border-b p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-9 pl-8 pr-8 text-sm"
                placeholder="Cari nama atau percakapan..."
                value={sidebarSearch}
                onChange={e => setSidebarSearch(e.target.value)}
              />
              {sidebarSearch && (
                <button
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSidebarSearch("")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* User Search Dropdown */}
            {searchableUsers.length > 0 && (
              <div className="absolute left-3 right-3 top-full z-10 mt-1 rounded-xl border bg-card shadow-lg overflow-hidden">
                <p className="px-3 pt-2.5 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Mulai chat baru</p>
                {searchableUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => startDMWith(u.id)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-primary/5"
                  >
                    <img src={u.avatar} alt="" className="h-8 w-8 rounded-full bg-muted ring-2 ring-background" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{u.name}</div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        <span className={cn(
                          "inline-block rounded px-1 py-0.5 text-[9px] font-semibold mr-1",
                          u.role === "tutor" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                          u.role === "admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" :
                          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        )}>
                          {u.role === "tutor" ? "Tutor" : u.role === "admin" ? "Admin" : "Mahasiswa"}
                        </span>
                        {u.major}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                {sidebarSearch ? "Tidak ditemukan" : "Belum ada percakapan"}
              </div>
            ) : filteredThreads.map(t => (
              <button
                key={t.threadId}
                onClick={() => {
                  setActiveThread(t.threadId);
                  navigate(`/app/chat/${t.threadId}`, { replace: true });
                }}
                className={cn(
                  "flex w-full items-center gap-3 border-b px-4 py-3.5 text-left transition hover:bg-card",
                  activeThread === t.threadId && "bg-card border-l-2 border-l-primary"
                )}
              >
                <div className="relative shrink-0">
                  <img src={t.user!.avatar} alt="" className="h-10 w-10 rounded-full bg-muted" />
                  {t.isGroup && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-white">
                      <Users className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-semibold">
                      {t.isGroup && "🎓 "}{t.user!.name}
                    </span>
                    {t.lastMsg && (
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                        {formatDistanceToNow(t.lastMsg.createdAt)}
                      </span>
                    )}
                  </div>
                  <div className="truncate text-xs text-muted-foreground mt-0.5">
                    {t.lastMsg?.attachment ? `📎 ${t.lastMsg.attachment.name}` : t.lastMsg?.text || "Mulai percakapan..."}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ============ CHAT AREA ============ */}
        <section className="flex min-w-0 flex-col">
          {!activeThread || !activeUserInfo ? (
            <div className="flex flex-1 items-center justify-center p-6">
              <EmptyState
                icon={<MessageSquare className="h-6 w-6" />}
                title="Pilih percakapan"
                description="Pilih kontak di sebelah kiri atau mulai chat baru dengan tombol 💬."
              />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 border-b px-5 py-3 bg-card/80 backdrop-blur-sm">
                <div className="relative">
                  <img src={activeUserInfo.user!.avatar} alt="" className="h-10 w-10 rounded-full bg-muted" />
                  {activeUserInfo.isGroup && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-white">
                      <Users className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{activeUserInfo.isGroup && "🎓 "}{activeUserInfo.user!.name}</div>
                  <div className="text-xs text-muted-foreground">{activeUserInfo.user!.major}</div>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-muted/10 to-muted/30 p-5">
                {activeMessages.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-10">
                    Belum ada pesan. Sapa dulu yuk! 👋
                  </div>
                )}
                {activeMessages.map(m => {
                  const mine = m.senderId === currentUser!.id;
                  const sender = !mine ? allUsers.find(u => u.id === m.senderId) : null;
                  return (
                    <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                        mine
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-card border rounded-bl-sm"
                      )}>
                        {!mine && activeThread?.startsWith("class_") && (
                          <div className="text-[10px] font-bold text-primary mb-1">{sender?.name || "Unknown"}</div>
                        )}

                        {/* Attachment preview */}
                        {m.attachment && (
                          <div className="mb-2">
                            {m.attachment.type.startsWith("image/") ? (
                              <a href={m.attachment.url} target="_blank" rel="noreferrer" className="block">
                                <img
                                  src={m.attachment.url}
                                  alt={m.attachment.name}
                                  className="max-h-[250px] max-w-full rounded-lg object-cover cursor-pointer hover:opacity-90 transition"
                                />
                              </a>
                            ) : (
                              <a
                                href={m.attachment.url}
                                download={m.attachment.name}
                                className={cn(
                                  "flex items-center gap-3 rounded-xl p-3 transition hover:opacity-80",
                                  mine ? "bg-white/10" : "bg-muted/60"
                                )}
                              >
                                {getFileIcon(m.attachment.type)}
                                <div className="min-w-0 flex-1">
                                  <div className={cn("truncate text-xs font-medium", mine ? "text-primary-foreground" : "text-foreground")}>{m.attachment.name}</div>
                                  <div className={cn("text-[10px]", mine ? "text-primary-foreground/60" : "text-muted-foreground")}>{formatFileSize(m.attachment.size)}</div>
                                </div>
                                <Download className={cn("h-4 w-4 shrink-0", mine ? "text-primary-foreground/70" : "text-muted-foreground")} />
                              </a>
                            )}
                          </div>
                        )}

                        {/* Text */}
                        {m.text && !(m.attachment && m.text === `📎 ${m.attachment.name}`) && (
                          <p className="whitespace-pre-wrap break-words">{m.text}</p>
                        )}

                        <div className={cn(
                          "mt-1 text-[10px]",
                          mine ? "text-primary-foreground/60" : "text-muted-foreground"
                        )}>
                          {formatTime(m.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Attachment Preview Bar */}
              {pendingAttachment && (
                <div className="flex items-center gap-3 border-t bg-amber-50 dark:bg-amber-900/20 px-4 py-2.5">
                  {getFileIcon(pendingAttachment.type)}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium">{pendingAttachment.name}</div>
                    <div className="text-[10px] text-muted-foreground">{formatFileSize(pendingAttachment.size)}</div>
                  </div>
                  {pendingAttachment.type.startsWith("image/") && (
                    <img src={pendingAttachment.url} alt="" className="h-10 w-10 rounded-md object-cover" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 shrink-0"
                    onClick={() => setPendingAttachment(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Input Bar */}
              <div className="flex items-center gap-2 border-t bg-card px-3 py-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.zip,.rar,.ppt,.pptx,.xls,.xlsx,.txt"
                  onChange={handleFileSelect}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 shrink-0 text-muted-foreground hover:text-foreground"
                  title="Lampirkan file"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4.5 w-4.5" />
                </Button>
                <Input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                  placeholder="Tulis pesan..."
                  className="flex-1"
                />
                <Button
                  onClick={send}
                  className="gap-1.5 shrink-0"
                  disabled={!text.trim() && !pendingAttachment}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
