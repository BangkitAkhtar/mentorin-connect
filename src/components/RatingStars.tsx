import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ value, size = 14, showNumber = false, count }: { value: number; size?: number; showNumber?: boolean; count?: number }) {
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={cn(
              "transition-colors",
              i <= Math.round(value) ? "fill-warning text-warning" : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-medium">
          {value.toFixed(1)}
          {count !== undefined && <span className="text-muted-foreground"> ({count})</span>}
        </span>
      )}
    </div>
  );
}
