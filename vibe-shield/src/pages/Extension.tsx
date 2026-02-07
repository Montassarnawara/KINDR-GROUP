import { FadeIn } from "@/components/FadeIn";
import { GlassCard } from "@/components/GlassCard";
import { Shield, Wifi, WifiOff, Scan, Eye, AlertTriangle, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getExtensionStatus, setExtensionStatus } from "@/services/extensionService";

const steps = [
  "Load the RespectRewrite extension in Chrome at chrome://extensions/",
  "Make sure 'Developer mode' is enabled",
  "The extension will automatically detect toxic content",
  "Use this button to enable or disable protection",
  "Your preferences are saved automatically",
];

export default function Extension() {
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger le statut au démarrage
  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    const status = await getExtensionStatus();
    if (status.success) {
      setConnected(status.enabled);
    }
  }

  async function handleToggleConnection() {
    setIsLoading(true);
    setError(null);

    try {
      const newStatus = !connected;
      const result = await setExtensionStatus(newStatus);

      if (result.success) {
        setConnected(result.enabled);
        console.log(`✅ Extension ${result.enabled ? 'enabled' : 'disabled'}`);
      } else {
        setError(result.error || "Failed to update extension");
      }
    } catch (err) {
      setError("Failed to communicate with extension");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
      <FadeIn>
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-bold">Chrome Extension</h1>
            <p className="text-muted-foreground text-sm">Your companion for a kinder browsing experience</p>
          </div>
        </div>
      </FadeIn>

      {/* Connection Status */}
      <FadeIn delay={0.05}>
        <GlassCard color={connected ? "mint" : undefined} className="flex items-center gap-4">
          {connected ? <Wifi className="w-8 h-8 text-mint" /> : <WifiOff className="w-8 h-8 text-muted-foreground" />}
          <div className="flex-1">
            <p className="font-display font-semibold">{connected ? "Connected" : "Not Connected"}</p>
            <p className="text-xs text-muted-foreground">
              {connected ? "Extension is actively protecting you" : "Click Connect to enable toxic content protection"}
            </p>
            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
          </div>
          <Button 
            variant={connected ? "outline" : "hero"} 
            onClick={handleToggleConnection}
            disabled={isLoading}
          >
            {isLoading ? "..." : connected ? "Disconnect" : "Connect Extension"}
          </Button>
        </GlassCard>
      </FadeIn>

      {/* Extension Preview - Intervention Popup */}
      <FadeIn delay={0.08}>
        <h2 className="text-lg font-display font-semibold mb-3">Extension Preview</h2>
        <div className="grid lg:grid-cols-2 gap-5">
          <GlassCard color="peach">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-accent" />
              <h3 className="font-display font-semibold text-sm">Intervention Popup</h3>
            </div>
            <div className="pastel-card p-4 space-y-3">
              <p className="font-display font-semibold">Quick pause</p>
              <p className="text-sm text-muted-foreground">This message might hurt someone. Want to rethink it?</p>
              <div className="text-sm bg-accent/10 rounded-lg p-2 border border-accent/20">
                <span className="text-accent font-medium">Tone check:</span> High risk
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="hero"><Sparkles className="w-3 h-3" /> Rewrite it kindly</Button>
                <Button size="sm" variant="ghost">Post anyway</Button>
              </div>
              <button className="text-xs text-primary hover:underline flex items-center gap-1">
                <MessageCircle className="w-3 h-3" /> Talk to my bestie
              </button>
            </div>
          </GlassCard>

          <GlassCard color="sky">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-secondary" />
              <h3 className="font-display font-semibold text-sm">Feed Awareness</h3>
            </div>
            <div className="pastel-card p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                You've been seeing a lot of negative content. Want a calmer feed for a bit?
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="soft">Yes, please</Button>
                <Button size="sm" variant="ghost">I'm okay</Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </FadeIn>

      {/* Stats */}
      {connected && (
        <FadeIn delay={0.1}>
          <div className="grid sm:grid-cols-3 gap-4">
            <GlassCard color="peach" className="text-center">
              <AlertTriangle className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-display font-bold">23</p>
              <p className="text-xs text-muted-foreground">Moments you paused today</p>
            </GlassCard>
            <GlassCard color="sky" className="text-center">
              <Scan className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-display font-bold">142</p>
              <p className="text-xs text-muted-foreground">Posts analyzed today</p>
            </GlassCard>
            <GlassCard color="mint" className="text-center">
              <Eye className="w-6 h-6 text-mint mx-auto mb-2" />
              <p className="text-2xl font-display font-bold">18</p>
              <p className="text-xs text-muted-foreground">Harmful content avoided</p>
            </GlassCard>
          </div>
        </FadeIn>
      )}

      {/* Setup Steps */}
      <FadeIn delay={0.15}>
        <h2 className="text-lg font-display font-semibold mb-4">How to Connect</h2>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <GlassCard key={i} className="flex items-center gap-3 py-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">{i + 1}</span>
              </div>
              <p className="text-sm">{step}</p>
            </GlassCard>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
