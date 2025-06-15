// src/services/websocket.ts
// ─────────────────────────────────────────────────────────────────
// Service minimal pour gérer une connexion WebSocket.
// connectSocket(url)       → se connecte (ou se reconnecte) au serveur.
// sendMessage(type, payload) → envoie { type, payload } au serveur.
// setOnMessage(callback)   → définit le callback qui sera appelé à chaque message reçu.
// ─────────────────────────────────────────────────────────────────

let socket: WebSocket | null = null;
let onMessageCallback: ((data: any) => void) | null = null;

/**
 * Ouvre (ou réouvre) la connexion WebSocket sur l'URL donnée.
 * Si une connexion existe déjà et est ouverte, on ne fait rien.
 * 
 * @param url L'URL du WebSocket, ex. "ws://localhost:3002"
 */
export function connectSocket(url: string) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    // Déjà connecté, inutile de réouvrir
    return;
  }

  // Si une ancienne connexion existe mais est fermée, on la remplace
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("[WebSocket] Connecté au serveur:", url);
  };

  socket.onmessage = (event) => {
    let data: any;
    try {
      data = JSON.parse(event.data);
    } catch (err) {
      console.error("[WebSocket] Erreur lors du parsing JSON :", event.data);
      return;
    }
    console.log("[WebSocket] Reçu ▶", data);
    if (onMessageCallback) {
      onMessageCallback(data);
    }
  };

  socket.onerror = (err) => {
    console.error("[WebSocket] Erreur de connexion :", err);
  };

  socket.onclose = (ev) => {
    console.log("[WebSocket] Connexion fermée", ev);
    socket = null;
  };
}

/**
 * Envoie un message { type, payload } sous forme JSON via WebSocket.
 * Si la connexion n'est pas ouverte, on logge un avertissement.
 */
export function sendMessage(type: string, payload: any) {
  if (!socket) {
    console.warn("[WebSocket] sendMessage appelé alors que socket est null.");
    return;
  }
  if (socket.readyState !== WebSocket.OPEN) {
    console.warn("[WebSocket] sendMessage appelé alors que socket n'est pas OPEN (readyState=", socket.readyState, ")");
    return;
  }
  const msg = JSON.stringify({ type, payload });
  console.log("[WebSocket] Envoi ▶", msg);
  socket.send(msg);
}

/**
 * Définit une fonction à appeler à chaque message JSON reçu du serveur.
 */
export function setOnMessage(cb: (data: any) => void) {
  onMessageCallback = cb;
}
