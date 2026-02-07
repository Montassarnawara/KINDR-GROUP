import { FadeIn } from "@/components/FadeIn";
import { GlassCard } from "@/components/GlassCard";
import { Target, CheckCircle, Clock, Sparkles, Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const dailyMissions = [
  { id: 1, text: "Share something supportive", xp: 50, done: true },
  { id: 2, text: "Rewrite a message with kinder words", xp: 75, done: true },
  { id: 3, text: "Take a mindful pause before posting", xp: 100, done: false },
];

const weeklyMissions = [
  { id: 4, text: "Maintain a positive tone for 7 days", xp: 300, progress: 5, total: 7, done: false },
  { id: 5, text: "Receive 20 community reactions", xp: 200, progress: 14, total: 20, done: false },
  { id: 6, text: "Join a supportive conversation", xp: 150, progress: 1, total: 1, done: true },
];

const streaks = [
  { days: 3, reward: "Encouragement Badge", unlocked: true },
  { days: 7, reward: "Kindness Badge", unlocked: true },
  { days: 14, reward: "Empathy Badge", unlocked: false },
  { days: 30, reward: "Peace Champion", unlocked: false },
];

export default function Missions() {
  const [showBox, setShowBox] = useState(false);
  const [boxOpened, setBoxOpened] = useState(false);

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
      <FadeIn>
        <div className="flex items-center gap-3">
          <Target className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-bold">Missions</h1>
            <p className="text-muted-foreground text-sm">Small steps toward a kinder you</p>
          </div>
        </div>
      </FadeIn>

      {/* Daily */}
      <FadeIn delay={0.05}>
        <h2 className="text-lg font-display font-semibold flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-primary" /> Daily Missions
        </h2>
        <div className="space-y-2">
          {dailyMissions.map((m) => (
            <GlassCard key={m.id} className={cn("flex items-center gap-3 py-3", m.done && "opacity-60")}>
              <CheckCircle className={cn("w-5 h-5 shrink-0", m.done ? "text-mint" : "text-muted-foreground")} />
              <span className={cn("flex-1 text-sm", m.done && "line-through")}>{m.text}</span>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-primary">+{m.xp} XP</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </FadeIn>

      {/* Weekly */}
      <FadeIn delay={0.1}>
        <h2 className="text-lg font-display font-semibold flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-secondary" /> Weekly Missions
        </h2>
        <div className="space-y-2">
          {weeklyMissions.map((m) => (
            <GlassCard key={m.id} className={cn("py-3", m.done && "opacity-60")}>
              <div className="flex items-center gap-3">
                <CheckCircle className={cn("w-5 h-5 shrink-0", m.done ? "text-mint" : "text-muted-foreground")} />
                <span className={cn("flex-1 text-sm", m.done && "line-through")}>{m.text}</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-xs font-bold text-secondary">+{m.xp} XP</span>
                </div>
              </div>
              {!m.done && m.progress !== undefined && (
                <div className="mt-2 ml-8">
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full" style={{ width: `${(m.progress / m.total!) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{m.progress}/{m.total}</p>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </FadeIn>

      {/* Streaks */}
      <FadeIn delay={0.15}>
        <h2 className="text-lg font-display font-semibold flex items-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-accent" /> Streak Milestones
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {streaks.map((s) => (
            <GlassCard key={s.days} className={cn("text-center", !s.unlocked && "opacity-40")}>
              <p className="text-2xl font-display font-bold text-primary">{s.days}</p>
              <p className="text-[10px] text-muted-foreground">day streak</p>
              <p className="text-xs font-medium mt-2">{s.reward}</p>
              {s.unlocked && <span className="text-[10px] text-mint">Earned</span>}
            </GlassCard>
          ))}
        </div>
      </FadeIn>

      {/* Milestone Reward */}
      <FadeIn delay={0.2}>
        <GlassCard color="lilac" className="text-center">
          <h2 className="text-lg font-display font-semibold mb-2">Next Milestone</h2>
          <p className="text-sm text-muted-foreground mb-4">Complete 5 missions to unlock your next badge</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground">3/5 missions</span>
            <div className="w-32 bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{ width: "60%" }} />
            </div>
          </div>
          <Button variant="soft" disabled>Almost there</Button>
        </GlassCard>
      </FadeIn>

      {/* Box Opening Animation */}
      <AnimatePresence>
        {showBox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => { setShowBox(false); setBoxOpened(false); }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="pastel-card p-8 max-w-sm w-full text-center soft-shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {boxOpened ? (
                <>
                  <Star className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-display font-bold mb-2">You earned a new badge!</h3>
                  <p className="text-primary font-semibold">Empathy Builder</p>
                  <p className="text-xs text-muted-foreground mt-1">Keep going, you're making a real difference</p>
                </>
              ) : (
                <>
                  <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-display font-bold mb-4">Reward Ready</h3>
                  <Button variant="hero" onClick={() => setBoxOpened(true)}>Claim</Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Import needed for the box popup
import { Gift } from "lucide-react";
