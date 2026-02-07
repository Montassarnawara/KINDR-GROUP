import { useState, useEffect } from "react";
import { FadeIn } from "@/components/FadeIn";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Sparkles, Heart, Bot, Wifi, WifiOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { 
  role: "user" | "bestie"; 
  content: string;
  loading?: boolean;
};

const starterPrompts = [
  "I'm feeling frustrated about something online",
  "Someone said something hurtful to me",
  "I want to talk about a tough moment",
  "Help me rephrase something I want to say",
];

const API_BASE_URL = "http://192.168.10.31:8000"; // Your backend IP

// API Service
const api = {
  // Check if backend is reachable
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },

  // Send message to /v1/chat endpoint (POST)
  async sendChatMessage(message: string, sessionId: string = "default"): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          session_id: sessionId
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  },

  // Send text to /v1/rewrite endpoint (POST)
  async rewriteText(text: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/rewrite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Rewrite API error:', error);
      throw error;
    }
  }
};

export default function Bestie() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bestie", content: "Hey there! I'm your bestie — a friendly AI here to help you navigate tough online moments. What's on your mind?" },
  ]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => {
    // Generate or retrieve session ID
    const stored = localStorage.getItem('bestie_session_id');
    if (stored) return stored;
    
    const newId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem('bestie_session_id', newId);
    return newId;
  });

  // Check connection on component mount
  useEffect(() => {
    checkConnection();
    
    // Auto-check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await api.healthCheck();
      setIsConnected(connected);
      
      if (connected) {
        console.log('✅ Connected to backend at:', API_BASE_URL);
      } else {
        console.log('❌ Backend not reachable');
      }
    } catch (error) {
      setIsConnected(false);
      console.error('Connection check failed:', error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    // Add user message
    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Add loading message
    const loadingMsg: Message = { 
      role: "bestie", 
      content: "",
      loading: true 
    };
    setMessages(prev => [...prev, loadingMsg]);

    try {
      // Call YOUR backend API (POST request to /v1/chat)
      const response = await api.sendChatMessage(text, sessionId);
      
      // Remove loading message
      setMessages(prev => prev.filter(m => !m.loading));
      
      // Add AI response from backend
      const bestieMsg: Message = { 
        role: "bestie", 
        content: response.response 
      };
      
      setMessages(prev => [...prev, bestieMsg]);
      
      // If we were disconnected but now it works
      if (isConnected === false) {
        setIsConnected(true);
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Remove loading message
      setMessages(prev => prev.filter(m => !m.loading));
      
      // Add error message
      const errorMsg: Message = { 
        role: "bestie", 
        content: "Sorry, I'm having trouble connecting to the AI backend. Please check if it's running."
      };
      
      setMessages(prev => [...prev, errorMsg]);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Special function to test rewrite endpoint
  const testRewriteEndpoint = async () => {
    const testText = "you are stupid";
    try {
      setIsLoading(true);
      const result = await api.rewriteText(testText);
      console.log('Rewrite API Response:', result);
      
      // Add the result to chat
      const userMsg: Message = { role: "user", content: `[Test] ${testText}` };
      const botMsg: Message = { 
        role: "bestie", 
        content: `API Response: ${JSON.stringify(result, null, 2)}`
      };
      
      setMessages(prev => [...prev, userMsg, botMsg]);
    } catch (error) {
      console.error('Rewrite test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <FadeIn>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">Bestie AI</h1>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 text-xs ${isConnected ? 'text-green-600' : isConnected === false ? 'text-red-600' : 'text-amber-600'}`}>
                  {isConnected === null ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : isConnected ? (
                    <>
                      <Wifi className="w-3 h-3" />
                      <span>Connected to backend</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3" />
                      <span>Backend offline</span>
                    </>
                  )}
                </div>
                {isConnected && (
                  <span className="text-xs text-muted-foreground">
                    {API_BASE_URL}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={checkConnection}
              className="text-xs px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/30"
            >
              {isConnected === null ? 'Checking...' : 'Check Connection'}
            </button>
            
            {/* Debug button to test rewrite endpoint */}
            <button
              onClick={testRewriteEndpoint}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 hover:bg-amber-500/20"
              title="Test rewrite endpoint"
            >
              Test API
            </button>
          </div>
        </div>
      </FadeIn>

      {/* Connection status warning */}
      {isConnected === false && (
        <FadeIn delay={0.1}>
          <GlassCard className="mb-4 p-4 border border-red-500/20 bg-red-500/5">
            <div className="flex items-start gap-3">
              <WifiOff className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-600">Backend Connection Required</h3>
                <p className="text-sm text-red-600/80 mt-1">
                  Cannot connect to: <code className="bg-red-500/10 px-2 py-1 rounded">{API_BASE_URL}</code>
                </p>
                <div className="text-xs text-red-600/60 mt-2">
                  Make sure backend is running on the other PC:<br/>
                  <code className="bg-black/10 px-2 py-1 rounded mt-1">
                    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
                  </code>
                </div>
              </div>
            </div>
          </GlassCard>
        </FadeIn>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, i) => (
          <FadeIn key={i} delay={0}>
            <div className={cn("flex gap-3", msg.role === "user" && "justify-end")}>
              {msg.role === "bestie" && !msg.loading && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 mt-1">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
              )}
              
              {msg.loading ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-card border border-border">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">Connecting to AI...</span>
                </div>
              ) : (
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "bestie"
                      ? "bg-card border border-border soft-shadow"
                      : "bg-primary/10 text-foreground border border-primary/10"
                  )}
                >
                  {msg.content}
                </div>
              )}
              
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Starter prompts - only show when connected */}
      {messages.length <= 1 && isConnected && (
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-4">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading || !isConnected}
                className="px-3 py-2 rounded-xl text-xs font-medium bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-3 h-3 inline mr-1.5 text-primary" />
                {prompt}
              </button>
            ))}
          </div>
        </FadeIn>
      )}

      {/* Input */}
      <GlassCard className="flex items-center gap-3 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage(input)}
          placeholder={
            !isConnected ? "Connect backend first..." :
            isLoading ? "Sending to AI..." :
            "Type something... I'm listening"
          }
          disabled={isLoading || !isConnected}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
        <Button 
          size="sm" 
          variant="hero" 
          onClick={() => sendMessage(input)} 
          disabled={!input.trim() || isLoading || !isConnected}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </Button>
      </GlassCard>
      
      {/* Debug info footer */}
      <div className="mt-4 text-xs text-muted-foreground text-center">
        <p>Connected to: <code>{API_BASE_URL}</code> | Session: <code>{sessionId.substring(0, 8)}...</code></p>
        <p className="mt-1">
          Endpoints: <code className="mx-1">POST /v1/chat</code> • 
          <code className="mx-1">POST /v1/rewrite</code>
        </p>
      </div>
    </div>
  );
}