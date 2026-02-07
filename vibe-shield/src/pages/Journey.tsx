import { FadeIn } from "@/components/FadeIn";
import { GlassCard } from "@/components/GlassCard";
import { Lock, Check, Star, Gift, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const stages = [
  { name: "Kind Listener", level: 1, unlocked: true, missions: 10, completed: 10, color: "mint" as const },
  { name: "Calm Communicator", level: 5, unlocked: true, missions: 10, completed: 10, color: "sky" as const },
  { name: "Empathy Builder", level: 10, unlocked: true, missions: 10, completed: 7, color: "lilac" as const },
  { name: "Positive Voice", level: 15, unlocked: false, missions: 10, completed: 0, color: "peach" as const },
  { name: "Community Guardian", level: 20, unlocked: false, missions: 10, completed: 0, color: "lilac" as const },
  { name: "Peace Champion", level: 30, unlocked: false, missions: 10, completed: 0, color: "mint" as const },
];

const badges = [
  { name: "Calm Communicator", rarity: "Earned", claimed: true },
  { name: "Empathy Badge", rarity: "Available", claimed: false },
  { name: "Peace Champion", rarity: "Locked", claimed: false },
];

export default function Journey() {
  const [showReward, setShowReward] = useState(false);

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
      <FadeIn>
        <h1 className="text-3xl font-display font-bold">Growth Journey</h1>
        <p className="text-muted-foreground text-sm mt-1">Your path toward becoming a kinder communicator</p>
      </FadeIn>

      {/* Journey Map */}
      <div className="relative space-y-3">
        {stages.map((stage, i) => (
          <FadeIn key={stage.name} delay={i * 0.08}>
            <GlassCard
              color={stage.unlocked ? stage.color : undefined}
              className={cn(
                "relative transition-all duration-300",
                !stage.unlocked && "opacity-50",
                stage.unlocked && stage.completed < stage.missions && "border-primary/20"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  stage.unlocked ? "bg-primary/10" : "bg-muted"
                )}>
                  {stage.unlocked ? (
                    stage.completed === stage.missions
                      ? <Check className="w-6 h-6 text-mint" />
                      : <Star className="w-6 h-6 text-primary" />
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-semibold text-sm">{stage.name}</h3>
                    <span className="text-[10px] text-muted-foreground">Level {stage.level}</span>
                  </div>
                  {stage.unlocked && (
                    <>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                          style={{ width: `${(stage.completed / stage.missions) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {stage.completed}/{stage.missions} missions completed
                      </p>
                    </>
                  )}
                </div>
                {stage.unlocked && stage.completed === stage.missions && (
                  <Button size="sm" variant="hero" onClick={() => setShowReward(true)}>
                    <Gift className="w-3.5 h-3.5" /> Claim
                  </Button>
                )}
              </div>
            </GlassCard>
          </FadeIn>
        ))}
      </div>

      {/* Badges */}
      <FadeIn delay={0.5}>
        <h2 className="text-xl font-display font-bold mb-4">Badges</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {badges.map((b) => (
            <GlassCard key={b.name} className="text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-semibold">{b.name}</p>
              <p className="text-[10px] font-medium text-muted-foreground mt-1">{b.rarity}</p>
              {b.claimed ? (
                <span className="text-[10px] text-mint mt-2 block">Earned</span>
              ) : b.rarity === "Available" ? (
                <Button size="sm" variant="soft" className="mt-2 w-full">Claim Badge</Button>
              ) : (
                <span className="text-[10px] text-muted-foreground mt-2 block">Keep growing</span>
              )}
            </GlassCard>
          ))}
        </div>
      </FadeIn>

      {/* Reward Popup */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setShowReward(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="pastel-card p-8 max-w-sm w-full text-center soft-shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">New Level Unlocked</h3>
              <p className="text-sm text-muted-foreground mb-1">You're growing into an amazing communicator</p>
              <p className="text-lg font-bold text-primary my-4">Badge: Calm Communicator</p>
              <Button variant="hero" onClick={() => setShowReward(false)} className="w-full">
                Claim Badge
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
