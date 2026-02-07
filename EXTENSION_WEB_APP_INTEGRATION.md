# 🔗 Integration: Vibe-Shield Web App ↔ Chrome Extension

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Current State Analysis](#current-state-analysis)
3. [Implementation Plan](#implementation-plan)
4. [Code Modifications](#code-modifications)
5. [Testing Guide](#testing-guide)

---

## 🏗️ Architecture Overview

### Current Projects Structure

```
📁 projet/
├── 📁 vibe-shield/                    # React Web Application
│   └── src/pages/Extension.tsx        # Page with Connect button
│
└── 📁 respectrewrite-extension/       # Chrome Extension
    ├── manifest.json                  # Extension configuration
    ├── background.js                  # (Currently empty)
    └── content.js                     # Main detection logic
```

### Communication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Vibe-Shield Web App                      │
│                                                             │
│  [Connect Extension Button] ──────────────┐                │
│                                            │                │
└────────────────────────────────────────────┼────────────────┘
                                             │
                                             │ Message
                                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Chrome Extension API                       │
│                                                             │
│   chrome.runtime.sendMessage() ◄────► chrome.storage       │
│                                                             │
└────────────────────────────────────────────┬────────────────┘
                                             │
                                             │ State Change
                                             ▼
┌─────────────────────────────────────────────────────────────┐
│              Content Script (content.js)                     │
│                                                             │
│  - Listens to storage changes                              │
│  - Enables/Disables toxic content detection                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Current State Analysis

### ✅ What Exists

#### 1. **Vibe-Shield App** (`Extension.tsx`)
- ✅ UI button for Connect/Disconnect
- ✅ Local state management (`useState`)
- ❌ No communication with Chrome Extension

#### 2. **Chrome Extension**
- ✅ Content script that detects toxic content
- ✅ Detoxify AI + LLM integration
- ✅ Visual blur/reveal system
- ❌ No background script
- ❌ No enable/disable mechanism
- ❌ No storage permissions

### ❌ What's Missing

1. **Background Script** - To handle web app messages
2. **Storage API** - To persist enabled/disabled state
3. **Message Passing** - Communication between web app and extension
4. **Extension ID** - Needed for external messaging
5. **State Management** - Global enable/disable flag in content script

---

## 🎯 Implementation Plan

### Phase 1: Extension Setup (Chrome Extension Side)

#### Step 1.1: Update `manifest.json`
Add necessary permissions and background script.

#### Step 1.2: Create `background.js`
Service worker to handle messages and state management.

#### Step 1.3: Update `content.js`
Add enable/disable functionality and listen to storage changes.

### Phase 2: Web App Integration (Vibe-Shield Side)

#### Step 2.1: Create Extension Service
Helper functions to communicate with Chrome Extension.

#### Step 2.2: Update `Extension.tsx`
Connect button functionality to extension API.

#### Step 2.3: Add Error Handling
Handle cases when extension is not installed.

---

## 💻 Code Modifications

### 📄 File 1: `manifest.json`

**Location:** `respectrewrite-extension/manifest.json`

**Changes:**
```json
{
  "manifest_version": 3,
  "name": "RespectRewrite AI",
  "version": "1.0",
  "description": "Detect harmful comments and suggest respectful rewrites.",
  
  "permissions": [
    "activeTab",
    "storage"              // ✅ ADD THIS - For storing enabled state
  ],

  "host_permissions": [
    "<all_urls>",
    "http://127.0.0.1:8000/*",
    "http://localhost:8000/*"
  ],

  "background": {           // ✅ ADD THIS - Background service worker
    "service_worker": "background.js"
  },

  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],

  "externally_connectable": {  // ✅ ADD THIS - Allow web app to connect
    "matches": [
      "http://localhost:*/*",
      "http://127.0.0.1:*/*",
      "https://*.yourdomain.com/*"  // Replace with your domain
    ]
  }
}
```

**Explanation:**
- `storage` permission: Allows saving enabled/disabled state
- `background.service_worker`: Runs background script to handle messages
- `externally_connectable`: Allows your web app to send messages to the extension

---

### 📄 File 2: `background.js`

**Location:** `respectrewrite-extension/background.js`

**Complete Code:**
```javascript
// 🔥 RespectRewrite Background Service Worker

console.log("🚀 RespectRewrite Background Script Loaded");

// Initialize default state on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ 
        extensionEnabled: true,
        installDate: Date.now()
    });
    console.log("✅ Extension installed - Default state: ENABLED");
});

// Listen for messages from web app or content script
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    console.log("📨 Message received from web app:", message);

    if (message.action === "GET_STATUS") {
        // Return current enabled status
        chrome.storage.local.get(['extensionEnabled'], (result) => {
            sendResponse({ 
                enabled: result.extensionEnabled !== false,
                success: true
            });
        });
        return true; // Keep message channel open for async response
    }

    if (message.action === "SET_STATUS") {
        // Update enabled status
        const newStatus = message.enabled;
        chrome.storage.local.set({ extensionEnabled: newStatus }, () => {
            console.log(`✅ Extension ${newStatus ? 'ENABLED' : 'DISABLED'}`);
            
            // Notify all tabs about the change
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {
                        action: "STATUS_CHANGED",
                        enabled: newStatus
                    }).catch(() => {
                        // Tab might not have content script injected
                    });
                });
            });

            sendResponse({ 
                success: true, 
                enabled: newStatus 
            });
        });
        return true;
    }

    sendResponse({ success: false, error: "Unknown action" });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "CHECK_ENABLED") {
        chrome.storage.local.get(['extensionEnabled'], (result) => {
            sendResponse({ enabled: result.extensionEnabled !== false });
        });
        return true;
    }
});

// Badge to show enabled/disabled state (optional)
chrome.storage.local.get(['extensionEnabled'], (result) => {
    const enabled = result.extensionEnabled !== false;
    updateBadge(enabled);
});

// Listen for storage changes to update badge
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.extensionEnabled) {
        updateBadge(changes.extensionEnabled.newValue);
    }
});

function updateBadge(enabled) {
    chrome.action.setBadgeText({ text: enabled ? "" : "OFF" });
    chrome.action.setBadgeBackgroundColor({ color: enabled ? "#4CAF50" : "#F44336" });
}
```

**Explanation:**
- Handles messages from web app using `onMessageExternal`
- Manages enabled/disabled state in `chrome.storage`
- Notifies all tabs when state changes
- Shows badge indicator (optional visual feedback)

---

### 📄 File 3: `content.js` (Modifications)

**Location:** `respectrewrite-extension/content.js`

**Add at the top (after line 1):**
```javascript
console.log("✅ RespectRewrite ACTIVE - Hybrid AI Mode");

// 🔥 Global enable/disable flag
let extensionEnabled = true;

// 🔥 Check initial enabled state
chrome.storage.local.get(['extensionEnabled'], (result) => {
    extensionEnabled = result.extensionEnabled !== false;
    console.log(`🎛️ Extension state: ${extensionEnabled ? 'ENABLED' : 'DISABLED'}`);
    
    if (extensionEnabled) {
        initializeExtension();
    }
});

// 🔥 Listen for status changes from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "STATUS_CHANGED") {
        extensionEnabled = message.enabled;
        console.log(`🔄 Extension ${extensionEnabled ? 'ENABLED' : 'DISABLED'} by user`);
        
        if (extensionEnabled) {
            initializeExtension();
        } else {
            disableExtension();
        }
        
        sendResponse({ received: true });
    }
});

// 🔥 Initialize extension functionality
function initializeExtension() {
    console.log("🚀 Initializing RespectRewrite...");
    scanPosts();
    if (!observer) {
        startObserver();
    }
}

// 🔥 Disable extension functionality
function disableExtension() {
    console.log("⏸️ Disabling RespectRewrite...");
    
    // Remove all existing highlights and popups
    document.querySelectorAll('.toxic-wrapper, .ai-suggestion').forEach(el => {
        el.remove();
    });
    
    // Clear memory
    seenPosts.clear();
    postQueue.length = 0;
    
    // Stop observer
    if (observer) {
        observer.disconnect();
    }
}

// 🔥 mémoire intelligente
const seenPosts = new Set();
const postQueue = [];
const MAX_POSTS = 50;
let observer = null;
```

**Modify the `analyzePost` function:**
```javascript
async function analyzePost(post) {
    // ⚠️ CHECK IF EXTENSION IS ENABLED
    if (!extensionEnabled) {
        return; // Skip analysis if disabled
    }

    if (seenPosts.has(post)) return;
    
    // ... rest of existing code ...
}
```

**Add observer management:**
```javascript
// 🔥 Start observing for new posts
function startObserver() {
    observer = new MutationObserver(mutations => {
        if (!extensionEnabled) return; // Skip if disabled

        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof Element)) return;

                if (node.matches?.('[role="article"]')) {
                    analyzePost(node);
                }

                node.querySelectorAll?.('[role="article"]')
                    .forEach(post => analyzePost(post));
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
```

---

### 📄 File 4: Create Extension Service (Web App)

**Location:** `vibe-shield/src/services/extensionService.ts`

**Create new file:**
```typescript
// 🔗 Chrome Extension Communication Service

// Replace with your actual extension ID after publishing
// Get it from chrome://extensions/ after loading the extension
const EXTENSION_ID = "YOUR_EXTENSION_ID_HERE";

export interface ExtensionStatus {
  enabled: boolean;
  success: boolean;
  error?: string;
}

/**
 * Check if Chrome Extension is installed
 */
export async function isExtensionInstalled(): Promise<boolean> {
  if (typeof chrome === 'undefined' || !chrome.runtime) {
    return false;
  }

  try {
    const response = await chrome.runtime.sendMessage(EXTENSION_ID, {
      action: "GET_STATUS"
    });
    return response?.success === true;
  } catch (error) {
    console.log("Extension not installed or not accessible");
    return false;
  }
}

/**
 * Get current extension enabled status
 */
export async function getExtensionStatus(): Promise<ExtensionStatus> {
  try {
    const response = await chrome.runtime.sendMessage(EXTENSION_ID, {
      action: "GET_STATUS"
    });

    return {
      enabled: response.enabled ?? false,
      success: response.success ?? false
    };
  } catch (error) {
    return {
      enabled: false,
      success: false,
      error: "Extension not installed or not responding"
    };
  }
}

/**
 * Enable or disable the extension
 */
export async function setExtensionStatus(enabled: boolean): Promise<ExtensionStatus> {
  try {
    const response = await chrome.runtime.sendMessage(EXTENSION_ID, {
      action: "SET_STATUS",
      enabled: enabled
    });

    return {
      enabled: response.enabled ?? false,
      success: response.success ?? false
    };
  } catch (error) {
    return {
      enabled: false,
      success: false,
      error: "Failed to communicate with extension"
    };
  }
}

/**
 * Listen for extension status changes
 */
export function onExtensionStatusChange(callback: (enabled: boolean) => void) {
  // Poll for status changes every 2 seconds
  const interval = setInterval(async () => {
    const status = await getExtensionStatus();
    if (status.success) {
      callback(status.enabled);
    }
  }, 2000);

  return () => clearInterval(interval);
}
```

---

### 📄 File 5: Update `Extension.tsx`

**Location:** `vibe-shield/src/pages/Extension.tsx`

**Replace the component with:**
```typescript
import { FadeIn } from "@/components/FadeIn";
import { GlassCard } from "@/components/GlassCard";
import { Shield, Wifi, WifiOff, Scan, Eye, AlertTriangle, Sparkles, MessageCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { 
  getExtensionStatus, 
  setExtensionStatus, 
  isExtensionInstalled 
} from "@/services/extensionService";

const steps = [
  "Install the RespectRewrite Chrome Extension from the Chrome Web Store",
  "Click the RespectRewrite icon in your browser toolbar",
  "Grant permissions to analyze page content",
  "Come back here and click 'Connect Extension'",
  "You're all set! The extension will protect you from toxic content",
];

export default function Extension() {
  const [connected, setConnected] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if extension is installed on mount
  useEffect(() => {
    checkInstallation();
  }, []);

  // Sync with extension status periodically
  useEffect(() => {
    if (!isInstalled) return;

    const interval = setInterval(async () => {
      const status = await getExtensionStatus();
      if (status.success) {
        setConnected(status.enabled);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isInstalled]);

  async function checkInstallation() {
    const installed = await isExtensionInstalled();
    setIsInstalled(installed);

    if (installed) {
      const status = await getExtensionStatus();
      setConnected(status.enabled);
    }
  }

  async function handleToggleConnection() {
    if (!isInstalled) {
      setError("Extension not installed. Please install it first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newStatus = !connected;
      const result = await setExtensionStatus(newStatus);

      if (result.success) {
        setConnected(result.enabled);
        console.log(`✅ Extension ${result.enabled ? 'enabled' : 'disabled'}`);
      } else {
        setError(result.error || "Failed to update extension status");
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

      {/* Installation Warning */}
      {!isInstalled && (
        <FadeIn delay={0.03}>
          <GlassCard color="peach" className="flex items-center gap-4">
            <AlertCircle className="w-8 h-8 text-accent" />
            <div className="flex-1">
              <p className="font-display font-semibold">Extension Not Detected</p>
              <p className="text-xs text-muted-foreground">Install the Chrome Extension to continue</p>
            </div>
            <Button variant="hero" onClick={() => window.open("chrome://extensions/", "_blank")}>
              Install Extension
            </Button>
          </GlassCard>
        </FadeIn>
      )}

      {/* Connection Status */}
      <FadeIn delay={0.05}>
        <GlassCard color={connected ? "mint" : undefined} className="flex items-center gap-4">
          {connected ? <Wifi className="w-8 h-8 text-mint" /> : <WifiOff className="w-8 h-8 text-muted-foreground" />}
          <div className="flex-1">
            <p className="font-display font-semibold">{connected ? "Connected" : "Not Connected"}</p>
            <p className="text-xs text-muted-foreground">
              {connected 
                ? "Extension is actively protecting you" 
                : isInstalled 
                  ? "Connect your extension to get started" 
                  : "Install extension first"
              }
            </p>
            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
          </div>
          <Button 
            variant={connected ? "outline" : "hero"} 
            onClick={handleToggleConnection}
            disabled={!isInstalled || isLoading}
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
              <h3 className="font-display font-semibold text-sm">Toxic Content Protection</h3>
            </div>
            <div className="pastel-card p-4 space-y-3">
              <p className="font-display font-semibold">Content Blurred</p>
              <p className="text-sm text-muted-foreground">Toxic content is automatically hidden for your mental health</p>
              <div className="text-sm bg-accent/10 rounded-lg p-2 border border-accent/20">
                <span className="text-accent font-medium">AI Detection:</span> Using Detoxify + LLM
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="hero"><Sparkles className="w-3 h-3" /> View Suggestion</Button>
                <Button size="sm" variant="ghost">Reveal Content</Button>
              </div>
            </div>
          </GlassCard>

          <GlassCard color="sky">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-secondary" />
              <h3 className="font-display font-semibold text-sm">Smart Filtering</h3>
            </div>
            <div className="pastel-card p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                90% reduction in API calls thanks to Detoxify pre-filtering
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="soft">Learn More</Button>
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
              <p className="text-2xl font-display font-bold">Live</p>
              <p className="text-xs text-muted-foreground">Real-time protection active</p>
            </GlassCard>
            <GlassCard color="sky" className="text-center">
              <Scan className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-display font-bold">AI</p>
              <p className="text-xs text-muted-foreground">Detoxify + Groq LLM</p>
            </GlassCard>
            <GlassCard color="mint" className="text-center">
              <Eye className="w-6 h-6 text-mint mx-auto mb-2" />
              <p className="text-2xl font-display font-bold">Smart</p>
              <p className="text-xs text-muted-foreground">Click to reveal/hide</p>
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
```

---

## 🧪 Testing Guide

### Step 1: Get Extension ID

1. Load unpacked extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `respectrewrite-extension` folder

2. Copy Extension ID:
   - You'll see an ID like `abcdefghijklmnopqrstuvwxyz123456`
   - Copy this ID

3. Update `extensionService.ts`:
   ```typescript
   const EXTENSION_ID = "paste-your-id-here";
   ```

### Step 2: Test Extension Alone

1. Open Facebook
2. Check console for: `✅ RespectRewrite ACTIVE`
3. Toxic content should be detected and blurred
4. Click to reveal should work

### Step 3: Test Web App Connection

1. Run vibe-shield app: `npm run dev`
2. Open Extension page
3. Click "Connect Extension" button
4. Check console for messages
5. Extension should enable/disable

### Step 4: Test Full Flow

1. **Disable from web app** → Toxic content detection stops
2. **Enable from web app** → Detection resumes
3. **Refresh page** → State persists
4. **Open new tab** → State is consistent

---

## 🎯 Expected Behavior

### When CONNECTED (Enabled)
✅ Toxic content detected and blurred  
✅ AI suggestions shown  
✅ Click to reveal works  
✅ Green badge in Extension page  
✅ Console: "Extension ENABLED"  

### When DISCONNECTED (Disabled)
✅ No detection happens  
✅ All existing highlights removed  
✅ Red badge or "OFF" badge  
✅ Console: "Extension DISABLED"  
✅ Button shows "Connect Extension"  

---

## 🚨 Troubleshooting

### Issue: "Extension not installed"
**Solution:** 
- Make sure extension is loaded in chrome://extensions/
- Check that extension ID is correct in `extensionService.ts`

### Issue: Messages not received
**Solution:**
- Check `externally_connectable` in manifest.json includes your app URL
- Verify background.js is loaded (check background page console)

### Issue: State doesn't persist
**Solution:**
- Check chrome.storage permissions in manifest.json
- Verify storage API calls are working (check console)

### Issue: Multiple tabs out of sync
**Solution:**
- Background script should broadcast to all tabs
- Check `chrome.tabs.sendMessage` in background.js

---

## 📚 Additional Resources

- [Chrome Extension Messaging](https://developer.chrome.com/docs/extensions/mv3/messaging/)
- [External Messaging](https://developer.chrome.com/docs/extensions/mv3/manifest/externally_connectable/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

---

## ✅ Implementation Checklist

- [ ] Update `manifest.json` with storage permission and background script
- [ ] Create `background.js` with message handlers
- [ ] Modify `content.js` to support enable/disable
- [ ] Create `extensionService.ts` in web app
- [ ] Update `Extension.tsx` with new connection logic
- [ ] Get Extension ID after loading
- [ ] Test connection flow
- [ ] Test enable/disable functionality
- [ ] Test state persistence
- [ ] Test multi-tab synchronization

---

**Created:** February 7, 2026  
**Project:** Vibe-Shield ↔ RespectRewrite Integration  
**Status:** Ready for Implementation
