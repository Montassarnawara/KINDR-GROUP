import { FadeIn } from "@/components/FadeIn";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Edit3, Trophy, Heart, Star, Shield, RefreshCw } from "lucide-react";

const badges = [
  { name: "Calm Communicator", earned: true },
  { name: "Empathy Builder", earned: true },
  { name: "Kind Listener", earned: true },
];

export default function Profile() {
  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
      <FadeIn>
        <GlassCard color="lilac" className="text-center relative">
          <Button variant="ghost" size="icon" className="absolute top-4 right-4">
            <Edit3 className="w-4 h-4" />
          </Button>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4">
            V
          </div>
          <h1 className="text-2xl font-display font-bold">VibeUser</h1>
          <p className="text-sm text-primary font-medium">Empathy Builder · Level 12</p>
          <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
            Growing toward a kinder online presence, one conversation at a time.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <div className="text-center">
              <p className="font-display font-bold text-lg">3,800</p>
              <p className="text-[10px] text-muted-foreground">XP</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-lg">7</p>
              <p className="text-[10px] text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-lg">#7</p>
              <p className="text-[10px] text-muted-foreground">Rank</p>
            </div>
          </div>
        </GlassCard>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: RefreshCw, label: "Rewrites", value: "24", color: "lilac" as const },
            { icon: Heart, label: "Positive Posts", value: "18", color: "mint" as const },
            { icon: Shield, label: "Paused", value: "31", color: "peach" as const },
            { icon: Trophy, label: "Missions", value: "24", color: "sky" as const },
          ].map((s) => (
            <GlassCard key={s.label} color={s.color} className="text-center py-3">
              <s.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="font-display font-bold text-lg">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </GlassCard>
          ))}
        </div>
      </FadeIn>

      {/* Badges */}
      <FadeIn delay={0.15}>
        <h2 className="text-lg font-display font-semibold mb-3 flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" /> Badges
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((b) => (
            <GlassCard key={b.name} className="text-center py-3">
              <Heart className="w-6 h-6 mx-auto mb-1 text-primary" />
              <p className="text-sm font-semibold">{b.name}</p>
              <p className="text-[10px] text-mint mt-1">Earned</p>
            </GlassCard>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
