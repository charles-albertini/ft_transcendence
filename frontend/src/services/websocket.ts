let socket: WebSocket;
let onMessageCallback: ((data: any) => void) | null = null;

/**
 * Ouvre une nouvelle connexion WebSocket (pour CreateGame/JoinGame)
 * et retourne le WebSocket pour pouvoir y greffer des listeners.
 */
export function connectSocket(url: string): WebSocket {
  socket = new WebSocket(url);
  socket.addEventListener('open', () => {
    console.log('[WS] connecté à', url);
  });
  socket.addEventListener('message', (evt: MessageEvent) => {
    const data = JSON.parse(evt.data);
    onMessageCallback?.(data);
  });
  socket.addEventListener('close', () => {
    console.log('[WS] déconnecté');
  });
  socket.addEventListener('error', err => {
    console.error('[WS] erreur', err);
  });
  return socket;
}

/**
 * Si une socket est déjà ouverte, on la réutilise ;
 * sinon on en crée une nouvelle.
 */
export function getSocket(url: string): WebSocket {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }
  return connectSocket(url);
}

/**
 * Définit le callback invoqué à chaque message reçu.
 */
export function setOnMessage(cb: (data: any) => void) {
  onMessageCallback = cb;
}

/**
 * Envoie un message JSON vers le serveur.
 */
export function sendMessage(type: string, payload: any) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type, payload }));
  } else {
    console.warn('[WS] envoi annulé : socket non ouverte');
  }
}
