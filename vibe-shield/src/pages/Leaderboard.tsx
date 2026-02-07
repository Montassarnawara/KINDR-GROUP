import { FadeIn } from "@/components/FadeIn";
import { GlassCard } from "@/components/GlassCard";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const leaders = [
  { rank: 1, name: "Maya", level: 28, title: "Positive Voice", points: 12450, streak: 42 },
  { rank: 2, name: "Jay", level: 24, title: "Empathy Builder", points: 10280, streak: 30 },
  { rank: 3, name: "Sam", level: 22, title: "Calm Communicator", points: 9150, streak: 25 },
  { rank: 4, name: "Alex", level: 19, title: "Empathy Builder", points: 7800, streak: 18 },
  { rank: 5, name: "Jordan", level: 17, title: "Calm Communicator", points: 6540, streak: 14 },
  { rank: 6, name: "Taylor", level: 15, title: "Kind Listener", points: 5200, streak: 11 },
  { rank: 7, name: "You", level: 12, title: "Empathy Builder", points: 3800, streak: 7 },
  { rank: 8, name: "Morgan", level: 10, title: "Kind Listener", points: 3200, streak: 5 },
];

type Tab = "weekly" | "monthly" | "alltime";

export default function Leaderboard() {
  const [tab, setTab] = useState<Tab>("weekly");

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-warning" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-accent" />;
    return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
  };

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
      <FadeIn>
        <div className="flex items-center gap-3">
          <Trophy className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-bold">Positive Impact</h1>
            <p className="text-muted-foreground text-sm">Celebrating the kindest voices in our community</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="flex gap-2">
          {(["weekly", "monthly", "alltime"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all border",
                tab === t ? "bg-primary/10 text-primary border-primary/20" : "bg-card text-muted-foreground border-border"
              )}
            >
              {t === "alltime" ? "All Time" : t}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Top 3 */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-3 gap-3">
          {leaders.slice(0, 3).map((l, i) => (
            <GlassCard key={l.rank} color={i === 0 ? "lilac" : i === 1 ? "sky" : "peach"} className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-2 text-lg font-bold text-primary">
                {l.name.charAt(0)}
              </div>
              <p className="font-semibold text-sm">{l.name}</p>
              <p className="text-[10px] text-muted-foreground">{l.title}</p>
              <p className="text-lg font-display font-bold text-primary mt-1">{l.points.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Level {l.level}</p>
            </GlassCard>
          ))}
        </div>
      </FadeIn>

      {/* Rest */}
      <div className="space-y-2">
        {leaders.slice(3).map((l, i) => (
          <FadeIn key={l.rank} delay={0.15 + i * 0.03}>
            <GlassCard className={cn("flex items-center gap-4 py-3", l.name === "You" && "border-primary/20 bg-primary/5")}>
              {getRankIcon(l.rank)}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center text-sm font-bold text-primary">
                {l.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{l.name}</span>
                  {l.name === "You" && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">You</span>}
                </div>
                <p className="text-[10px] text-muted-foreground">{l.title} · Level {l.level}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-sm">{l.points.toLocaleString()}</p>
                <div className="flex items-center gap-1 justify-end">
                  <TrendingUp className="w-3 h-3 text-mint" />
                  <span className="text-[10px] text-mint">{l.streak}d streak</span>
                </div>
              </div>
            </GlassCard>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
