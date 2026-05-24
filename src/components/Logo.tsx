import { cn } from "@/lib/utils";

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1 shadow-card border border-slate-100/80 overflow-hidden shrink-0">
        <img src="/logobinus.webp" alt="BINUS Logo" className="h-full w-full object-contain" />
      </div>
      {withText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            MentorIn
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
            SASC BINUS
          </span>
        </div>
      )}
    </div>
  );
}
