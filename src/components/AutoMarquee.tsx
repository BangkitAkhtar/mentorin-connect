import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AutoMarqueeProps {
  children: ReactNode;
  speed?: number; // seconds for one full loop
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * Infinite auto-scrolling marquee. Children are duplicated to make the loop seamless.
 * Wrap each item in a fixed-width container for predictable spacing.
 */
export function AutoMarquee({
  children,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  className,
}: AutoMarqueeProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        // fade edges
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max gap-5",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0 gap-5">{children}</div>
        <div className="flex shrink-0 gap-5" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
