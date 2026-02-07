import { FadeIn } from "@/components/FadeIn";
import { GlassCard } from "@/components/GlassCard";
import { Heart, TrendingUp, RefreshCw, PauseCircle, Sparkles, Sun, Moon, Lightbulb } from "lucide-react";

const weeklyData = [
  { day: "Mon", value: 3 },
  { day: "Tue", value: 5 },
  { day: "Wed", value: 2 },
  { day: "Thu", value: 4 },
  { day: "Fri", value: 6 },
  { day: "Sat", value: 1 },
  { day: "Sun", value: 3 },
];

const maxVal = Math.max(...weeklyData.map((d) => d.value));

export default function Dashboard() {
  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">Your space to grow, not get judged.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-mint/10 border border-mint/20">
            <Heart className="w-5 h-5 text-mint" />
            <span className="font-display font-bold text-lg text-mint">7</span>
            <span className="text-xs text-muted-foreground">day streak</span>
          </div>
        </div>
      </FadeIn>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <FadeIn delay={0}>
          <GlassCard color="lilac">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">Comments Rewritten</span>
              <RefreshCw className="w-4 h-4 text-primary" />
            </div>
            <p className="text-4xl font-display font-bold text-primary">24</p>
            <p className="text-xs text-muted-foreground mt-1">You chose kinder words 24 times this week</p>
          </GlassCard>
        </FadeIn>
        <FadeIn delay={0.05}>
          <GlassCard color="mint">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">Positive Posts Shared</span>
              <Heart className="w-4 h-4 text-mint" />
            </div>
            <p className="text-4xl font-display font-bold text-mint">18</p>
            <p className="text-xs text-muted-foreground mt-1">Your voice is making a difference</p>
          </GlassCard>
        </FadeIn>
        <FadeIn delay={0.1}>
          <GlassCard color="peach">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">Times You Paused</span>
              <PauseCircle className="w-4 h-4 text-accent" />
            </div>
            <p className="text-4xl font-display font-bold text-accent">31</p>
            <p className="text-xs text-muted-foreground mt-1">Pausing shows real strength</p>
          </GlassCard>
        </FadeIn>
      </div>

      {/* Weekly Growth */}
      <FadeIn delay={0.15}>
        <GlassCard>
          <h2 className="text-lg font-display font-semibold mb-1">Weekly Growth</h2>
          <p className="text-xs text-muted-foreground mb-5">Kind words chosen per day</p>
          <div className="flex items-end gap-4 h-36">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs font-medium text-primary">{d.value}</span>
                <div
                  className="w-full rounded-xl bg-gradient-to-t from-primary/40 to-primary/80 transition-all duration-500"
                  style={{ height: `${(d.value / maxVal) * 100}%`, minHeight: 8 }}
                />
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </FadeIn>

      {/* Weekly Insight */}
      <FadeIn delay={0.2}>
        <div className="gradient-border">
          <div className="bg-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-display font-semibold">This Week's Insight</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Your Vibe</p>
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-warning" />
                  <span className="font-display font-bold text-lg">Calm & Positive</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Growth Highlight</p>
                <p className="text-sm font-medium">You chose kinder words more often this week</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Best Day</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-mint" />
                  <span className="font-display font-bold">Friday</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Suggestion</p>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  <span className="text-sm">Try journaling tonight</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
