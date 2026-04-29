import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/format";
import { EmptyState } from "@/components/EmptyState";

export default function Chat() {
  const { messages, currentUser, tutors, mahasiswa, bookings, sendMessage } = useApp();
  const isMhs = currentUser!.role === "mahasiswa";

  // build threads from bookings (counterparties)
  const threads = useMemo(() => {
    const ids = new Set<string>();
    bookings.forEach(b => {
      if (b.mahasiswaId === currentUser!.id || b.tutorId === currentUser!.id) {
        const other = isMhs ? b.tutorId : b.mahasiswaId;
        ids.add(other);
      }
    });
    // also include any thread that has messages
    messages.forEach(m => {
      const [a, b] = m.threadId.split("_");
      if (a === currentUser!.id) ids.add(b);
      else if (b === currentUser!.id) ids.add(a);
    });
    return Array.from(ids).map(id => {
      const user = isMhs ? tutors.find(t => t.id === id) : mahasiswa.find(m => m.id === id);
      const threadId = isMhs ? `${currentUser!.id}_${id}` : `${id}_${currentUser!.id}`;
      const lastMsg = [...messages].reverse().find(m => m.threadId === threadId);
      return { id, user, threadId, lastMsg };
    }).filter(t => t.user).sort((a, b) => (b.lastMsg?.createdAt || 0) - (a.lastMsg?.createdAt || 0));
  }, [bookings, messages, currentUser, isMhs, tutors, mahasiswa]);

  const [activeThread, setActiveThread] = useState<string | null>(threads[0]?.threadId || null);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeMessages = messages.filter(m => m.threadId === activeThread).sort((a, b) => a.createdAt - b.createdAt);
  const activeUser = threads.find(t => t.threadId === activeThread)?.user;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeMessages.length, activeThread]);

  const send = () => {
    if (!text.trim() || !activeThread) return;
    sendMessage({ threadId: activeThread, senderId: currentUser!.id, text: text.trim() });
    setText("");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Chat" description="Diskusi dengan partner belajarmu." />
      <div className="grid h-[600px] grid-cols-1 overflow-hidden rounded-2xl border bg-card shadow-card md:grid-cols-[280px_1fr]">
        <aside className="overflow-y-auto border-r bg-muted/30">
          {threads.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Belum ada percakapan</div>
          ) : threads.map(t => (
            <button
              key={t.threadId}
              onClick={() => setActiveThread(t.threadId)}
              className={cn("flex w-full items-center gap-3 border-b px-4 py-3 text-left transition hover:bg-card",
                activeThread === t.threadId && "bg-card")}
            >
              <img src={t.user!.avatar} alt="" className="h-10 w-10 rounded-full bg-muted" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{t.user!.name}</div>
                <div className="truncate text-xs text-muted-foreground">{t.lastMsg?.text || "Mulai percakapan..."}</div>
              </div>
            </button>
          ))}
        </aside>

        <section className="flex min-w-0 flex-col">
          {!activeThread || !activeUser ? (
            <div className="flex flex-1 items-center justify-center p-6">
              <EmptyState icon={<MessageSquare className="h-6 w-6" />} title="Pilih percakapan" description="Pilih kontak di sebelah kiri untuk mulai chat." />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b px-5 py-3">
                <img src={activeUser.avatar} alt="" className="h-9 w-9 rounded-full bg-muted" />
                <div>
                  <div className="font-semibold">{activeUser.name}</div>
                  <div className="text-xs text-muted-foreground">{activeUser.major}</div>
                </div>
              </div>
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/20 p-5">
                {activeMessages.length === 0 && <div className="text-center text-sm text-muted-foreground">Belum ada pesan. Sapa dulu yuk! 👋</div>}
                {activeMessages.map(m => {
                  const mine = m.senderId === currentUser!.id;
                  return (
                    <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-card",
                        mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card rounded-bl-sm")}>
                        <p>{m.text}</p>
                        <div className={cn("mt-1 text-[10px]", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>{formatTime(m.createdAt)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 border-t bg-card p-3">
                <Input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Tulis pesan..." />
                <Button onClick={send} className="gap-1"><Send className="h-4 w-4" /></Button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
