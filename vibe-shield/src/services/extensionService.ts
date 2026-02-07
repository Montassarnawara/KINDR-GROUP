// 🔗 Simple Extension Communication via Custom Events

export interface ExtensionStatus {
  enabled: boolean;
  success: boolean;
  error?: string;
}

/**
 * Envoyer un message à l'extension via Custom Event
 */
function sendMessage(action: string, data: any = {}): Promise<any> {
  return new Promise((resolve) => {
    // Listener pour la réponse
    const responseHandler = (event: Event) => {
      const customEvent = event as CustomEvent;
      window.removeEventListener('RESPECTREWRITE_RESPONSE', responseHandler);
      resolve(customEvent.detail);
    };
    
    window.addEventListener('RESPECTREWRITE_RESPONSE', responseHandler);
    
    // Envoyer le message via Custom Event
    window.dispatchEvent(new CustomEvent('RESPECTREWRITE_REQUEST', {
      detail: {
        action: action,
        ...data
      }
    }));
    
    // Timeout après 2 secondes
    setTimeout(() => {
      window.removeEventListener('RESPECTREWRITE_RESPONSE', responseHandler);
      resolve({ success: false, error: 'Timeout' });
    }, 2000);
  });
}

/**
 * Obtenir le statut actuel de l'extension
 */
export async function getExtensionStatus(): Promise<ExtensionStatus> {
  try {
    const response = await sendMessage('GET_STATUS');
    
    return {
      enabled: response.enabled ?? false,
      success: response.success ?? false
    };
  } catch (error) {
    return {
      enabled: false,
      success: false,
      error: "Extension not responding"
    };
  }
}

/**
 * Activer ou désactiver l'extension
 */
export async function setExtensionStatus(enabled: boolean): Promise<ExtensionStatus> {
  try {
    const response = await sendMessage('SET_STATUS', { enabled });
    
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
