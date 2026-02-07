import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Trophy,
  Map,
  Target,
  Settings,
  User,
  Shield,
  Heart,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/bestie", icon: MessageCircle, label: "Bestie Chat" },
  { to: "/community", icon: MessageSquare, label: "Community" },
  { to: "/journey", icon: Map, label: "Journey" },
  { to: "/missions", icon: Target, label: "Missions" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/extension", icon: Shield, label: "Extension" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
      <div className="p-5 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Heart className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-display font-bold text-foreground">KINDR</span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary soft-shadow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 mx-3 mb-4 rounded-xl bg-gradient-to-br from-primary/8 to-secondary/8 border border-primary/10">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Growth Streak</span>
        </div>
        <p className="text-2xl font-display font-bold text-primary">7 days</p>
        <p className="text-xs text-muted-foreground mt-0.5">You're on a great path</p>
      </div>
    </aside>
  );
}
