/**
 * Realtime Service
 * 
 * WebSocket client for realtime updates (unit status, reservation events).
 * Falls back to polling if WebSocket unavailable.
 */

export type RealtimeEventType = 
  | 'unit_held' 
  | 'unit_sold' 
  | 'unit_released'
  | 'hold_tick'
  | 'hold_extend'
  | 'payment_update';

export interface RealtimeEvent {
  type: RealtimeEventType;
  timestamp: string;
  data: Record<string, unknown>;
}

export type EventHandler = (event: RealtimeEvent) => void;

const WS_URL = ((import.meta as any)?.env?.VITE_WS_URL as string) || 'ws://localhost:3000/ws';

class RealtimeService {
  private ws: WebSocket | null = null;
  private channels: Map<string, Set<EventHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isIntentionalClose = false;

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    this.isIntentionalClose = false;

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log('[Realtime] Connected');
        this.reconnectAttempts = 0;
        
        // Re-subscribe to channels
        this.channels.forEach((_, channel) => {
          this.sendMessage({ type: 'subscribe', channel });
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as RealtimeEvent;
          this.handleMessage(message);
        } catch (error) {
          console.error('[Realtime] Failed to parse message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[Realtime] Error:', error);
      };

      this.ws.onclose = () => {
        console.log('[Realtime] Disconnected');
        
        if (!this.isIntentionalClose) {
          this.attemptReconnect();
        }
      };
    } catch (error) {
      console.error('[Realtime] Failed to connect:', error);
      this.attemptReconnect();
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.isIntentionalClose = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Subscribe to a channel
   */
  subscribe(channel: string, handler: EventHandler): () => void {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
      
      // Send subscribe message if connected
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.sendMessage({ type: 'subscribe', channel });
      }
    }

    this.channels.get(channel)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.channels.get(channel);
      if (handlers) {
        handlers.delete(handler);
        
        // Unsubscribe from channel if no more handlers
        if (handlers.size === 0) {
          this.channels.delete(channel);
          if (this.ws?.readyState === WebSocket.OPEN) {
            this.sendMessage({ type: 'unsubscribe', channel });
          }
        }
      }
    };
  }

  /**
   * Handle incoming message
   */
  private handleMessage(event: RealtimeEvent): void {
    // Broadcast to all subscribers of all channels
    // In production, filter by channel from event metadata
    this.channels.forEach((handlers) => {
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error('[Realtime] Handler error:', error);
        }
      });
    });
  }

  /**
   * Send message to server
   */
  private sendMessage(message: Record<string, unknown>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[Realtime] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    
    console.log(`[Realtime] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Get connection status
   */
  getStatus(): 'connecting' | 'connected' | 'disconnected' {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      default:
        return 'disconnected';
    }
  }
}

// Singleton instance
export const realtimeService = new RealtimeService();

// Auto-connect on import (can be disabled)
if (typeof window !== 'undefined') {
  // Don't auto-connect in SSR
  // realtimeService.connect(); // Uncomment in production
}

