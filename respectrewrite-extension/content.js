console.log("✅ RespectRewrite ACTIVE - Hybrid AI Mode");

// 🔥 Global enable/disable flag
let extensionEnabled = true;
let observer = null;

// 🔥 Écouter les messages via Custom Events (plus fiable que postMessage)
window.addEventListener('RESPECTREWRITE_REQUEST', (event) => {
    const { action, enabled } = event.detail;
    
    console.log('📨 Message reçu:', action, enabled);
    
    if (action === 'SET_STATUS') {
        extensionEnabled = enabled;
        console.log(`🔄 Extension ${enabled ? 'ENABLED' : 'DISABLED'} from web app`);
        
        // Sauvegarder l'état
        chrome.storage.local.set({ extensionEnabled: enabled });
        
        if (enabled) {
            initializeExtension();
        } else {
            disableExtension();
        }
        
        // Répondre via Custom Event
        window.dispatchEvent(new CustomEvent('RESPECTREWRITE_RESPONSE', {
            detail: {
                action: 'STATUS_CHANGED',
                enabled: enabled,
                success: true
            }
        }));
    }
    
    if (action === 'GET_STATUS') {
        // Envoyer l'état actuel
        window.dispatchEvent(new CustomEvent('RESPECTREWRITE_RESPONSE', {
            detail: {
                action: 'STATUS_RESPONSE',
                enabled: extensionEnabled,
                success: true
            }
        }));
    }
});

// 🔥 Charger l'état sauvegardé au démarrage
chrome.storage.local.get(['extensionEnabled'], (result) => {
    extensionEnabled = result.extensionEnabled !== false;
    console.log(`🎛️ Extension state loaded: ${extensionEnabled ? 'ENABLED' : 'DISABLED'}`);
    
    if (extensionEnabled) {
        initializeExtension();
    }
});

// 🔥 mémoire intelligente
const seenPosts = new Set();
const postQueue = [];
const MAX_POSTS = 50;


// 🔥 fonction pour récupérer le vrai texte Facebook ET l'élément
function getPostText(post) {

    const selectors = [
        '[data-ad-preview="message"]',
        'div[dir="auto"]',
        'span[dir="auto"]',
        'div[role="paragraph"]'
    ];

    for (const selector of selectors) {
        const el = post.querySelector(selector);

        if (el && el.innerText.length > 20) {
            return {
                text: el.innerText,
                element: el  // Retourner aussi l'élément pour le surligner
            };
        }
    }

    return null;
}


// 🔥 fonction pour appeler l'API de réécriture
async function fetchRewrite(text) {

    try {

        const response = await fetch("http://127.0.0.1:8000/rewrite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Backend returns: {rewrite: string|null, is_safe: boolean}
        return data;

    } catch (err) {
        console.error("❌ API ERROR:", err);
        return null;
    }
}


// 🔥 analyse du post
async function analyzePost(post) {
    // ⚠️ Vérifier si l'extension est activée
    if (!extensionEnabled) {
        return; // Skip si désactivé
    }

    if (seenPosts.has(post)) return;

    seenPosts.add(post);
    postQueue.push(post);

    if (postQueue.length > MAX_POSTS) {
        const oldest = postQueue.shift();
        seenPosts.delete(oldest);
    }

    const postData = getPostText(post);

    if (!postData) return;

    const { text: rawText, element: textElement } = postData;

    console.log("📄 Analyzing post:", rawText.substring(0, 50) + "...");

    try {
        // ⚡ Démarrer l'appel API
        const responsePromise = fetch("http://127.0.0.1:8000/rewrite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: rawText })
        });

        // 🔥 Attendre la réponse
        const response = await responsePromise;
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // ✅ Si SAFE, rien à faire
        if (result.is_safe) {
            console.log("✅ Post is SAFE - no toxicity detected (Detoxify)");
            return;
        }

        // ⚠️ TOXIC DETECTED! Surligner le texte exact et afficher popup
        console.log("⚠️ TOXIC DETECTED! Highlighting toxic text");
        
        // Surligner l'élément de texte toxique exact
        highlightToxicText(textElement);
        
        // Afficher le popup juste à côté du texte toxique
        if (result.rewrite) {
            console.log("✅ Showing AI suggestion");
            createSuggestionPopup(textElement, result.rewrite);
        } else {
            console.warn("⚠️ Toxic but no rewrite received");
        }

    } catch (err) {
        console.error("❌ API ERROR:", err);
    }
}



// 🔥 scan initial (TRÈS IMPORTANT)
function scanPosts() {
    const posts = document.querySelectorAll('[role="article"]');
    posts.forEach(post => analyzePost(post));
}

// 🔥 Initialiser l'extension
function initializeExtension() {
    console.log("🚀 Initializing RespectRewrite...");
    scanPosts();
    if (!observer) {
        startObserver();
    }
}

// 🔥 Désactiver l'extension
function disableExtension() {
    console.log("⏸️ Disabling RespectRewrite...");
    
    // Supprimer tous les highlights et popups existants
    document.querySelectorAll('.toxic-wrapper, .ai-suggestion').forEach(el => {
        el.remove();
    });
    
    // Nettoyer la mémoire
    seenPosts.clear();
    postQueue.length = 0;
    
    // Arrêter l'observer
    if (observer) {
        observer.disconnect();
        observer = null;
    }
}

// 🔥 Démarrer l'observation des posts
function startObserver() {
    observer = new MutationObserver(mutations => {
        if (!extensionEnabled) return; // Skip si désactivé

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

function createWarningPopup(post) {

    // éviter double popup
    if (post.querySelector('.respectrewrite-popup')) return;

    const popup = document.createElement("div");

    popup.className = "respectrewrite-popup";

    popup.innerHTML = `
        <div style="
            background: white;
            padding: 12px;
            margin-top: 10px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-size: 14px;
            font-family: Arial;
        ">
            ⚠️ <strong>Potentially harmful content detected</strong>

            <div style="margin-top:8px;">
                <button class="rewrite-btn" style="
                    background:#1877f2;
                    color:white;
                    border:none;
                    padding:6px 10px;
                    border-radius:6px;
                    cursor:pointer;
                    margin-right:6px;
                ">Rewrite</button>

                <button class="ignore-btn" style="
                    background:#e4e6eb;
                    border:none;
                    padding:6px 10px;
                    border-radius:6px;
                    cursor:pointer;
                ">Ignore</button>
            </div>
        </div>
    `;

    // bouton ignore
    popup.querySelector(".ignore-btn").onclick = () => {
        popup.remove();
    };

    // bouton rewrite
    popup.querySelector(".rewrite-btn").onclick = async () => {

        const messageEl =
            post.querySelector('[data-ad-preview="message"]') ||
            post.querySelector('div[dir="auto"]') ||
            post.querySelector('span[dir="auto"]');

        if (!messageEl) return;

        const originalText = messageEl.innerText;

        try {

            const response = await fetch("http://127.0.0.1:8000/rewrite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: originalText
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            showRewrite(post, data.rewrite);

        } catch (err) {
            console.error("❌ API ERROR:", err);
            alert("Erreur: Le serveur n'est pas accessible. Assurez-vous qu'il est démarré.");
        }
    };

    post.appendChild(popup);
}

function showRewrite(post, rewriteText) {

    const box = document.createElement("div");

    box.style.background = "#f0f2f5";
    box.style.padding = "10px";
    box.style.marginTop = "8px";
    box.style.borderRadius = "8px";
    box.style.fontSize = "14px";

    box.innerHTML = `
        <strong>✨ Suggested Rewrite:</strong>
        <div style="margin-top:6px;">
            ${rewriteText}
        </div>
    `;

    post.appendChild(box);
}

// 🎨 Surligner et MASQUER le texte toxique
function highlightToxicText(textElement) {
    // Éviter de surligner plusieurs fois
    if (textElement.classList.contains('toxic-highlighted')) {
        return;
    }

    textElement.classList.add('toxic-highlighted');
    
    // Wrapper pour le blur effect
    const wrapper = document.createElement('div');
    wrapper.className = 'toxic-wrapper';
    wrapper.style.cssText = `
        position: relative !important;
        background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%) !important;
        border: 3px solid #d32f2f !important;
        border-radius: 10px !important;
        padding: 12px !important;
        margin: 8px 0 !important;
        box-shadow: 0 4px 15px rgba(211, 47, 47, 0.4) !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
    `;

    // Style du texte - BLURRED par défaut
    textElement.style.filter = 'blur(8px)';
    textElement.style.userSelect = 'none';
    textElement.style.transition = 'filter 0.3s ease';
    textElement.style.pointerEvents = 'none';

    // Ajouter un overlay "Click to reveal"
    const overlay = document.createElement('div');
    overlay.className = 'toxic-overlay';
    overlay.style.cssText = `
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        background: rgba(211, 47, 47, 0.95) !important;
        color: white !important;
        padding: 15px 25px !important;
        border-radius: 10px !important;
        font-size: 14px !important;
        font-weight: bold !important;
        z-index: 100 !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        cursor: pointer !important;
        text-align: center !important;
        pointer-events: auto !important;
        transition: opacity 0.3s ease, transform 0.3s ease !important;
        opacity: 1 !important;
    `;
    overlay.innerHTML = `
        🔒 <strong>Toxic Content Hidden</strong><br>
        <span style="font-size: 12px; font-weight: normal;">Click to reveal</span>
    `;

    // Badge "TOXIC DETECTED"
    const badge = document.createElement('div');
    badge.className = 'toxic-badge';
    badge.style.cssText = `
        position: absolute !important;
        top: -12px !important;
        left: 10px !important;
        background: #d32f2f !important;
        color: white !important;
        padding: 4px 12px !important;
        border-radius: 12px !important;
        font-size: 11px !important;
        font-weight: bold !important;
        z-index: 101 !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        transition: all 0.3s ease !important;
        cursor: pointer !important;
    `;
    badge.textContent = '🚨 TOXIC DETECTED';

    // Remplacer l'élément par le wrapper
    const parent = textElement.parentElement;
    parent.insertBefore(wrapper, textElement);
    wrapper.appendChild(textElement);
    wrapper.appendChild(overlay);
    wrapper.appendChild(badge);

    // Variable pour tracker l'état
    let isRevealed = false;

    // Click pour révéler/cacher
    const toggleReveal = (e) => {
        e.stopPropagation();
        
        if (!isRevealed) {
            // RÉVÉLER le contenu - CACHER l'overlay
            textElement.style.filter = 'blur(0px)';
            textElement.style.userSelect = 'text';
            textElement.style.pointerEvents = 'auto';
            
            // Faire disparaître l'overlay avec animation
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            
            // Changer le wrapper en vert pour indiquer "revealed"
            wrapper.style.background = 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)';
            wrapper.style.border = '3px solid #4caf50';
            wrapper.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.4)';
            
            // Changer le badge
            badge.style.background = '#4caf50';
            badge.textContent = '👁️ REVEALED (click to hide)';
            badge.style.cursor = 'pointer';
            
            isRevealed = true;
            console.log("👁️ User revealed toxic content - overlay hidden");
        } else {
            // CACHER à nouveau - MONTRER l'overlay
            textElement.style.filter = 'blur(8px)';
            textElement.style.userSelect = 'none';
            textElement.style.pointerEvents = 'none';
            
            // Réafficher l'overlay
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
            
            // Remettre le wrapper en rouge
            wrapper.style.background = 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)';
            wrapper.style.border = '3px solid #d32f2f';
            wrapper.style.boxShadow = '0 4px 15px rgba(211, 47, 47, 0.4)';
            
            // Remettre le badge original
            badge.style.background = '#d32f2f';
            badge.textContent = '🚨 TOXIC DETECTED';
            
            isRevealed = false;
            console.log("🔒 User hid toxic content again - overlay shown");
        }
    };

    // Click sur l'overlay pour révéler
    overlay.addEventListener('click', toggleReveal);
    
    // Click sur le badge pour toggler aussi
    badge.addEventListener('click', toggleReveal);

    console.log("✅ Toxic text highlighted and BLURRED (click to reveal)");
}


function createSuggestionPopup(textElement, rewrite) {

    // Éviter les doublons - chercher dans le parent
    const parentPost = textElement.closest('[role="article"]');
    if (!parentPost) return;
    
    const existing = parentPost.querySelector('.ai-suggestion');
    if (existing) {
        console.log("⚠️ Popup already exists, removing old one");
        existing.remove();
    }

    console.log("🎨 Creating popup with rewrite:", rewrite);

    const box = document.createElement("div");
    box.className = "ai-suggestion";

    // Style TRÈS visible - placé juste après le texte toxique
    box.style.cssText = `
        background: linear-gradient(135deg, #fff3cd 0%, #ffe082 100%) !important;
        border: 4px solid #ff6f00 !important;
        padding: 20px !important;
        margin: 15px 0 !important;
        border-radius: 15px !important;
        box-shadow: 0 8px 30px rgba(255, 111, 0, 0.5) !important;
        font-size: 15px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif !important;
        position: relative !important;
        z-index: 99999 !important;
        width: 100% !important;
        box-sizing: border-box !important;
    `;

    box.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:15px;">
            <span style="font-size:32px;">�️</span>
            <div>
                <strong style="color:#bf360c; font-size:18px; display:block;">Toxic Content Protected</strong>
                <span style="color:#e65100; font-size:13px;">Content has been blurred for your safety. Click the blurred area to reveal.</span>
            </div>
        </div>

        <div style="
            background:#ffffff;
            padding:15px;
            border-radius:10px;
            color:#212121;
            line-height:1.6;
            margin-bottom:12px;
            border-left:4px solid #ff6f00;
            font-size:15px;
        ">
            <strong>✨ Respectful Alternative:</strong><br><br>
            ${rewrite}
        </div>

        <div style="
            background:#e3f2fd;
            padding:10px;
            border-radius:8px;
            margin-bottom:10px;
            font-size:13px;
            color:#1565c0;
        ">
            💡 <strong>Tip:</strong> Click on the blurred text to reveal or hide the toxic content
        </div>

        <button class="ignore-suggestion-btn" style="
            background:#ff6f00;
            color:white;
            border:none;
            padding:10px 20px;
            border-radius:8px;
            cursor:pointer;
            font-weight:bold;
            font-size:14px;
            transition:all 0.3s;
        " onmouseover="this.style.background='#e65100'" onmouseout="this.style.background='#ff6f00'">
            ✓ Got it, Dismiss
        </button>
    `;

    // Bouton pour fermer
    box.querySelector(".ignore-suggestion-btn").onclick = () => {
        console.log("🗑️ User dismissed suggestion");
        box.style.animation = "fadeOut 0.3s";
        setTimeout(() => box.remove(), 300);
    };

    // Ajouter animation fadeIn
    if (!document.querySelector('#ai-popup-animations')) {
        const style = document.createElement('style');
        style.id = 'ai-popup-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            .ai-suggestion {
                animation: fadeIn 0.4s ease-out !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Insérer le popup juste APRÈS le texte toxique
    if (textElement.parentElement) {
        textElement.parentElement.insertBefore(box, textElement.nextSibling);
    } else {
        parentPost.appendChild(box);
    }
    
    // Scroller pour montrer le popup
    setTimeout(() => {
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    console.log("✅ Popup added to DOM and scrolled into view");
}

