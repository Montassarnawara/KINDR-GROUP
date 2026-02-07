import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  MessageCircle,
  Map,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/bestie", icon: MessageCircle, label: "Bestie" },
  { to: "/community", icon: MessageSquare, label: "Feed" },
  { to: "/journey", icon: Map, label: "Journey" },
  { to: "/leaderboard", icon: Trophy, label: "Rank" },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
