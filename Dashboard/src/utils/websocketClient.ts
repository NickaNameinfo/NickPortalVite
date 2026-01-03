/**
 * WebSocket Client for Barcode Scanning
 * Connects to WebSocket server and listens for barcode events
 */

import { io, Socket } from "socket.io-client";

export interface WebSocketCallbacks {
  onBarcodeReceived?: (barcode: string) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
}

class WebSocketClient {
  private socket: Socket | null = null;
  private wsUrl: string;
  private callbacks: WebSocketCallbacks = {};
  private isConnected: boolean = false;

  constructor(wsUrl?: string) {
    // Get WebSocket URL from environment or use default
    if (wsUrl) {
      this.wsUrl = wsUrl;
    } else if (import.meta.env.VITE_WS_URL) {
      this.wsUrl = import.meta.env.VITE_WS_URL;
    } else {
      // Default: WebSocket server runs on port 3001
      // For production, construct from current hostname
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        this.wsUrl = "http://localhost:3001";
      } else {
        // Use wss:// for HTTPS sites, ws:// for HTTP
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        this.wsUrl = `${protocol}//${window.location.hostname}:3001`;
      }
    }
  }

  /**
   * Connect to WebSocket server
   */
  connect(callbacks?: WebSocketCallbacks): void {
    if (this.socket?.connected) {
      console.log("[WebSocket] Already connected");
      return;
    }

    if (callbacks) {
      this.callbacks = callbacks;
    }

    console.log(`[WebSocket] Connecting to ${this.wsUrl}`);

    this.socket = io(this.wsUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("[WebSocket] Connected to server");
      this.isConnected = true;
      this.callbacks.onConnected?.();
    });

    this.socket.on("product-barcode", (barcode: string) => {
      console.log("[WebSocket] Received barcode:", barcode);
      if (barcode && barcode.trim() !== "") {
        this.callbacks.onBarcodeReceived?.(barcode.trim());
      }
    });

    this.socket.on("disconnect", () => {
      console.log("[WebSocket] Disconnected from server");
      this.isConnected = false;
      this.callbacks.onDisconnected?.();
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error("[WebSocket] Connection error:", error);
      this.isConnected = false;
      this.callbacks.onError?.(error);
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log("[WebSocket] Disconnected");
    }
  }

  /**
   * Check if connected
   */
  get connected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Update callbacks
   */
  setCallbacks(callbacks: WebSocketCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }
}

// Export singleton instance
export const websocketClient = new WebSocketClient();

// Export class for multiple instances if needed
export default WebSocketClient;

