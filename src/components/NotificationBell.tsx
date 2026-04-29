import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useApp } from "@/context/AppContext";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "@/lib/format";

export function NotificationBell() {
  const { notifications, currentUser, markNotifRead } = useApp();
  if (!currentUser) return null;
  const mine = notifications.filter(n => n.userId === currentUser.id);
  const unread = mine.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover-scale">
          <Bell className={`h-5 w-5 ${unread > 0 ? "animate-float" : ""}`} />
          {unread > 0 && (
            <>
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground animate-scale-in">
                {unread}
              </span>
              <span className="absolute right-1.5 top-1.5 h-4 w-4 animate-ping rounded-full bg-destructive/40" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="font-display font-semibold">Notifikasi</div>
          <span className="text-xs text-muted-foreground">{unread} belum dibaca</span>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {mine.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Belum ada notifikasi</div>
          ) : mine.map(n => (
            <Link
              to={n.link || "#"}
              key={n.id}
              onClick={() => markNotifRead(n.id)}
              className={`flex gap-3 border-b px-4 py-3 transition-colors hover:bg-muted/50 ${!n.read ? "bg-primary-soft/40" : ""}`}
            >
              <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <Bell className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{formatDistanceToNow(n.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
