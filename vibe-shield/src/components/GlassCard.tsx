import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  color?: "lilac" | "sky" | "mint" | "peach";
}

export function GlassCard({ children, className, color }: Props) {
  return (
    <div
      className={cn(
        "pastel-card p-5 transition-all duration-200 hover:soft-shadow-lg",
        color === "lilac" && "border-lilac/20 bg-lilac/5",
        color === "sky" && "border-sky/20 bg-sky/5",
        color === "mint" && "border-mint/20 bg-mint/5",
        color === "peach" && "border-peach/20 bg-peach/5",
        className
      )}
    >
      {children}
    </div>
  );
}
