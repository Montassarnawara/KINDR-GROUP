import { FadeIn } from "@/components/FadeIn";
import { GlassCard } from "@/components/GlassCard";
import { Settings as SettingsIcon, Shield, Eye, EyeOff, Download, Trash2, Bell, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-11 h-6 rounded-full transition-colors relative",
        enabled ? "bg-primary" : "bg-muted"
      )}
    >
      <div className={cn(
        "w-5 h-5 rounded-full bg-card absolute top-0.5 transition-transform soft-shadow",
        enabled ? "translate-x-[22px]" : "translate-x-0.5"
      )} />
    </button>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    feedAlerts: true,
    prePostIntervention: true,
    anonymousMode: false,
    shieldMode: true,
    notifications: true,
    dataSharing: false,
  });

  const toggle = (key: keyof typeof settings) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  const items = [
    { icon: Eye, label: "Feed Awareness Alerts", desc: "Get gentle nudges when you're scrolling through negative content", key: "feedAlerts" as const },
    { icon: Shield, label: "Pre-Post Interventions", desc: "Pause and reflect before posting something that may be harmful", key: "prePostIntervention" as const },
    { icon: EyeOff, label: "Anonymous Mode", desc: "Hide your identity in community posts", key: "anonymousMode" as const },
    { icon: Shield, label: "Shield Mode", desc: "Blur potentially harmful content before you see it", key: "shieldMode" as const },
    { icon: Bell, label: "Notifications", desc: "Get updates about missions and milestones", key: "notifications" as const },
    { icon: Lock, label: "Data Sharing (Opt-in)", desc: "We only analyze text you can already see or write", key: "dataSharing" as const },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto space-y-6">
      <FadeIn>
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-display font-bold">Settings</h1>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="space-y-2">
          {items.map((item) => (
            <GlassCard key={item.key} className="flex items-center gap-4 py-3">
              <item.icon className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Toggle enabled={settings[item.key]} onToggle={() => toggle(item.key)} />
            </GlassCard>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="space-y-2">
          <GlassCard className="flex items-center gap-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors">
            <Download className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Export Report as PDF</p>
              <p className="text-xs text-muted-foreground">Download your growth analytics</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4 py-3 cursor-pointer hover:bg-destructive/5 transition-colors">
            <Trash2 className="w-5 h-5 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-destructive">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently remove your data</p>
            </div>
          </GlassCard>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <GlassCard color="sky">
          <h3 className="font-display font-semibold text-sm mb-2">Privacy & Transparency</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We only analyze text you can already see or write. Your data is never sold or shared with third parties. 
            All analysis happens to help you grow — never to judge or shame you. You're always in control.
          </p>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
