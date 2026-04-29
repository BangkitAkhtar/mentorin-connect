import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-card">
        <GraduationCap className="h-5 w-5" />
      </div>
      {withText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-tight">MentorIn</span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">SASC Binus</span>
        </div>
      )}
    </div>
  );
}
