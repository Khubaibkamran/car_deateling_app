import { API_URL } from './client';
import { freshAccessToken } from './session';

/** A message as the server pushes it over the socket. */
export type SocketMessage = { id: number; text: string; created_at: string; read_at: string | null; sender_id: number };

type Handlers = {
  onMessage: (message: SocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

// http://host:8000/api/v1  ->  ws://host:8000
const SOCKET_BASE = API_URL.replace(/^http/, 'ws').replace(/\/api\/v1\/?$/, '');
const MAX_WAIT_MS = 10000;

/**
 * Live connection to one chat. It reconnects by itself (with a growing pause) until `close()` is called,
 * so a dropped network or an expired token doesn't leave the chat dead.
 */
export function openChatSocket(conversationId: number, handlers: Handlers) {
  let socket: WebSocket | undefined;
  let closed = false;
  let wait = 1000;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const connect = async () => {
    if (closed) return;
    const token = await freshAccessToken();
    if (closed) return;
    if (!token) {
      timer = setTimeout(connect, wait);
      return;
    }
    const ws = new WebSocket(`${SOCKET_BASE}/ws/chat/${conversationId}/?token=${encodeURIComponent(token)}`);
    socket = ws;
    ws.onopen = () => {
      wait = 1000;
      handlers.onOpen?.();
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(String(event.data));
        if (data.type === 'message') handlers.onMessage(data.message);
      } catch {
        // Ignore anything that isn't a chat message.
      }
    };
    ws.onclose = () => {
      if (socket === ws) socket = undefined;
      handlers.onClose?.();
      if (!closed) {
        timer = setTimeout(connect, wait);
        wait = Math.min(wait * 2, MAX_WAIT_MS);
      }
    };
    ws.onerror = () => ws.close();
  };
  connect();

  return {
    /** Sends a message; false means the socket isn't open right now. */
    send(text: string): boolean {
      if (socket?.readyState !== WebSocket.OPEN) return false;
      socket.send(JSON.stringify({ text }));
      return true;
    },
    close() {
      closed = true;
      clearTimeout(timer);
      socket?.close();
    },
  };
}
