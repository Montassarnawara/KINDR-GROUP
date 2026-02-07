import { useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Flag, Send, AlertTriangle, Sparkles, Smile, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "trending" | "new" | "positive" | "mental-health" | "advice";

const filters: { key: FilterType; label: string }[] = [
  { key: "trending", label: "Trending" },
  { key: "new", label: "New" },
  { key: "positive", label: "Positive Only" },
  { key: "mental-health", label: "Mental Health" },
  { key: "advice", label: "Advice" },
];

const posts = [
  { id: 1, user: "Anonymous", badge: "Calm Communicator", time: "2h ago", text: "I used to react so quickly online. Taking a pause before posting has really changed how I interact. Anyone else finding this helpful?", likes: 42, comments: 8 },
  { id: 2, user: "Anonymous", badge: "Empathy Builder", time: "4h ago", text: "Just completed my 30-day growth streak. It feels good to see real progress in how I communicate online.", likes: 89, comments: 12 },
  { id: 3, user: "Sam", badge: "Positive Voice", time: "6h ago", text: "If anyone's going through a tough time, you're not alone. Sometimes just knowing someone cares makes a difference.", likes: 156, comments: 34 },
  { id: 4, user: "Alex", badge: "Calm Communicator", time: "8h ago", text: "Tip: when you feel like lashing out online, close the app and take 3 deep breaths. It really works.", likes: 67, comments: 15 },
];

export default function Community() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("trending");
  const [newPost, setNewPost] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const handlePost = () => {
    const toxicWords = ["hate", "stupid", "ugly", "dumb", "kill"];
    const isToxic = toxicWords.some((w) => newPost.toLowerCase().includes(w));
    if (isToxic) {
      setShowWarning(true);
    } else {
      setNewPost("");
    }
  };

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
      <FadeIn>
        <h1 className="text-3xl font-display font-bold">Community</h1>
        <p className="text-muted-foreground text-sm mt-1">A safe space for sharing, growing, and supporting each other</p>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.05}>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                activeFilter === f.key
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-border"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Create Post */}
      <FadeIn delay={0.1}>
        <GlassCard>
          <textarea
            value={newPost}
            onChange={(e) => { setNewPost(e.target.value); setShowWarning(false); }}
            placeholder="Share something supportive..."
            className="w-full bg-transparent text-sm resize-none outline-none min-h-[60px] placeholder:text-muted-foreground"
          />
          {showWarning && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20 mb-3">
              <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-accent">Quick pause</p>
                <p className="text-xs text-muted-foreground mt-1">This message might hurt someone. Want to rethink it?</p>
                <p className="text-xs text-foreground mt-1 italic">"I feel frustrated right now but I'm working on expressing myself better."</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="default" onClick={() => { setNewPost("I feel frustrated right now but I'm working on expressing myself better."); setShowWarning(false); }}>
                    <Sparkles className="w-3 h-3" /> Rewrite it kindly
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowWarning(false)}>Edit Myself</Button>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button size="sm" variant="hero" onClick={handlePost} disabled={!newPost.trim()}>
              <Send className="w-3.5 h-3.5" /> Post
            </Button>
          </div>
        </GlassCard>
      </FadeIn>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post, i) => (
          <FadeIn key={post.id} delay={0.15 + i * 0.05}>
            <GlassCard>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Smile className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{post.user}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/10">{post.badge}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4">{post.text}</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs transition-colors",
                    likedPosts.has(post.id) ? "text-primary" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <ThumbsUp className={cn("w-4 h-4", likedPosts.has(post.id) && "fill-primary")} />
                  {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <MessageSquare className="w-4 h-4" /> {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto">
                  <Flag className="w-4 h-4" /> Report
                </button>
              </div>
            </GlassCard>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
