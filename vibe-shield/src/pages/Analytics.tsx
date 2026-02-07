import { FadeIn } from "@/components/FadeIn";
import { GlassCard } from "@/components/GlassCard";
import { BarChart3, TrendingUp, ArrowRight, Shield, Sparkles, Eye, MessageSquare } from "lucide-react";

const weeklyProgress = [
  { week: "Week 1", rewrites: 3, pauses: 5, positive: 8 },
  { week: "Week 2", rewrites: 6, pauses: 9, positive: 12 },
  { week: "Week 3", rewrites: 8, pauses: 14, positive: 18 },
  { week: "Week 4", rewrites: 5, pauses: 12, positive: 22 },
];

const maxPositive = Math.max(...weeklyProgress.map((w) => w.positive));

const explainSteps = [
  { icon: MessageSquare, label: "You write or see text", desc: "The extension reads the content on your screen" },
  { icon: Eye, label: "AI detects tone", desc: "Our model identifies potentially harmful language patterns" },
  { icon: Sparkles, label: "You get an explanation", desc: "Clear, friendly reasons why the content may be harmful" },
  { icon: Shield, label: "You choose", desc: "Rewrite, post anyway, or talk to your bestie — always your choice" },
];

export default function Analytics() {
  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <FadeIn>
        <div className="flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-bold">Analytics</h1>
            <p className="text-muted-foreground text-sm">See how you're growing over time</p>
          </div>
        </div>
      </FadeIn>

      {/* Weekly Growth Chart */}
      <FadeIn delay={0.05}>
        <GlassCard>
          <h2 className="text-lg font-display font-semibold mb-1">Growth Over Time</h2>
          <p className="text-xs text-muted-foreground mb-6">You chose kinder words more often this week</p>
          <div className="grid grid-cols-4 gap-4">
            {weeklyProgress.map((w) => (
              <div key={w.week} className="space-y-3">
                <div className="flex flex-col items-center gap-1.5 h-40 justify-end">
                  <div className="flex gap-1 items-end h-full w-full justify-center">
                    <div
                      className="w-5 rounded-t-lg bg-primary/60"
                      style={{ height: `${(w.rewrites / maxPositive) * 100}%`, minHeight: 8 }}
                      title={`${w.rewrites} rewrites`}
                    />
                    <div
                      className="w-5 rounded-t-lg bg-secondary/60"
                      style={{ height: `${(w.pauses / maxPositive) * 100}%`, minHeight: 8 }}
                      title={`${w.pauses} pauses`}
                    />
                    <div
                      className="w-5 rounded-t-lg bg-mint/60"
                      style={{ height: `${(w.positive / maxPositive) * 100}%`, minHeight: 8 }}
                      title={`${w.positive} positive posts`}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">{w.week}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-6 mt-4 justify-center">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded bg-primary/60" /> Rewrites
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded bg-secondary/60" /> Pauses
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded bg-mint/60" /> Positive Posts
            </div>
          </div>
        </GlassCard>
      </FadeIn>

      {/* Insights */}
      <FadeIn delay={0.1}>
        <div className="grid sm:grid-cols-3 gap-4">
          <GlassCard color="lilac">
            <TrendingUp className="w-6 h-6 text-primary mb-2" />
            <p className="text-2xl font-display font-bold text-primary">+40%</p>
            <p className="text-xs text-muted-foreground">More kind words chosen vs. last month</p>
          </GlassCard>
          <GlassCard color="mint">
            <TrendingUp className="w-6 h-6 text-mint mb-2" />
            <p className="text-2xl font-display font-bold text-mint">22</p>
            <p className="text-xs text-muted-foreground">Positive posts shared this month</p>
          </GlassCard>
          <GlassCard color="peach">
            <TrendingUp className="w-6 h-6 text-accent mb-2" />
            <p className="text-2xl font-display font-bold text-accent">31</p>
            <p className="text-xs text-muted-foreground">Times you paused and reflected</p>
          </GlassCard>
        </div>
      </FadeIn>

      {/* How It Works - Explainability */}
      <FadeIn delay={0.15}>
        <GlassCard>
          <h2 className="text-lg font-display font-semibold mb-2">How the AI Works</h2>
          <p className="text-xs text-muted-foreground mb-6">Transparency is important to us. Here's what happens behind the scenes.</p>
          <div className="grid sm:grid-cols-4 gap-4">
            {explainSteps.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center text-center relative">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-semibold mb-1">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
                {i < explainSteps.length - 1 && (
                  <ArrowRight className="hidden sm:block absolute -right-3 top-5 w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </FadeIn>

      {/* Privacy note */}
      <FadeIn delay={0.2}>
        <GlassCard color="sky">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Your privacy matters.</span> All analysis happens locally or in secure, 
            encrypted environments. We never store your messages permanently. You can export or delete your data at any time 
            from Settings.
          </p>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
