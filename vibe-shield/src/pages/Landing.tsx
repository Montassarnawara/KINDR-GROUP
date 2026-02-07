import { Button } from "@/components/ui/button";
import { Heart, Shield, Sparkles, TrendingUp, ChevronRight, Star, MessageCircle, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { FadeIn } from "@/components/FadeIn";
import { GlassCard } from "@/components/GlassCard";

const steps = [
  { icon: Shield, title: "Pause & Reflect", desc: "Our extension gently pauses you before posting something that may hurt someone", color: "lilac" as const },
  { icon: Sparkles, title: "Understand Why", desc: "Clear, friendly explanations help you see the impact of your words", color: "sky" as const },
  { icon: TrendingUp, title: "Grow Together", desc: "Track your growth, earn badges, and build a kinder online presence", color: "mint" as const },
];

const features = [
  { icon: Shield, title: "Gentle Interventions", desc: "Thoughtful nudges, not harsh blocks. You always have the choice.", color: "lilac" as const },
  { icon: MessageCircle, title: "Bestie AI Chat", desc: "A supportive AI friend to talk through tough moments with you.", color: "peach" as const },
  { icon: Heart, title: "Safe Community", desc: "Anonymous sharing, gentle reactions, and content safety built in.", color: "mint" as const },
  { icon: BarChart3, title: "Growth Tracking", desc: "See how you're improving with clear, encouraging progress visuals.", color: "sky" as const },
];

const testimonials = [
  { name: "Maya", text: "KINDR helped me pause and rethink so many times. My online interactions feel so much healthier now.", avatar: "M" },
  { name: "Jay", text: "The Bestie chat is amazing. It feels like talking to a friend who actually gets it.", avatar: "J" },
  { name: "Sam", text: "I love the growth tracking. Seeing my progress makes me want to keep being kind.", avatar: "S" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold">KINDR</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="hero" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Soft gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-xs font-medium text-primary mb-6 border border-primary/20">
              <Sparkles className="w-3 h-3" /> A kinder internet starts with you
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6 text-foreground">
              Your space to grow,
              <br />
              <span className="text-gradient-primary">not get judged.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              KINDR helps you pause, reflect, and choose kinder words — 
              with gentle AI support that feels like a trusted friend, not moderation software.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="hero" size="xl">Get Started <ChevronRight className="w-5 h-5" /></Button>
              </Link>
              <Link to="/extension">
                <Button variant="outline" size="xl">Learn About the Extension</Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-4">How It Works</h2>
            <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">Three gentle steps toward a healthier online experience</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.1}>
                <GlassCard color={step.color} className="text-center h-full">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Step {i + 1}</div>
                  <h3 className="text-xl font-display font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 bg-gradient-to-b from-transparent via-primary/3 to-transparent">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-16">
              Designed with <span className="text-gradient-primary">empathy</span>
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08}>
                <GlassCard color={f.color} className="hover:scale-[1.02] transition-transform duration-300 h-full">
                  <f.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-display font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-16">
              What our community says
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <GlassCard className="h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      {t.avatar}
                    </div>
                    <span className="font-semibold text-sm">{t.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
                  <div className="flex gap-0.5 mt-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-warning text-warning" />
                    ))}
                  </div>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center pastel-card p-10 sm:p-14 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Ready to build a kinder internet?</h2>
            <p className="text-muted-foreground mb-8">Join a community that encourages reflection and growth. It's free to start.</p>
            <Link to="/signup">
              <Button variant="hero" size="xl">Join KINDR <ChevronRight className="w-5 h-5" /></Button>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            <span className="font-display font-bold">KINDR</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 KINDR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
