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
      this.wsUrl = `https://nicknameinfo.net`;
    }
  }

  /**
   * Connect to WebSocket server
   */
  connect(callbacks?: WebSocketCallbacks): void {
    if (this.socket?.connected) {
      console.log("[WebSocket] Already connected, updating callbacks");
      if (callbacks) {
        this.callbacks = { ...this.callbacks, ...callbacks };
      }
      return;
    }

    // Disconnect existing socket if any
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
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
      console.log("[WebSocket] ✅ Connected to server:", this.wsUrl);
      this.isConnected = true;
      this.callbacks.onConnected?.();
    });

    // Helper function to extract barcode from string or object
    const extractBarcode = (data: any): string | null => {
      if (!data) return null;
      
      // If it's already a string, return it
      if (typeof data === 'string') {
        return data.trim();
      }
      
      // If it's an object, try to get barcode property
      if (typeof data === 'object' && data !== null) {
        if (data.barcode && typeof data.barcode === 'string') {
          return data.barcode.trim();
        }
        // If barcode is a number, convert to string
        if (data.barcode && typeof data.barcode === 'number') {
          return data.barcode.toString().trim();
        }
      }
      
      return null;
    };

    // Listen for barcode events (support both event names for compatibility)
    this.socket.on("product-barcode", (data: any) => {
      console.log("[WebSocket] 📦 Received barcode (product-barcode):", data);
      const barcode = extractBarcode(data);
      if (barcode && barcode !== "") {
        console.log("[WebSocket] Calling onBarcodeReceived callback with:", barcode);
        this.callbacks.onBarcodeReceived?.(barcode);
      } else {
        console.warn("[WebSocket] Invalid barcode data received:", data);
      }
    });

    // Also listen for scan-product event (from mobile scanner)
    // Note: Server should broadcast scan-product events to all clients
    this.socket.on("scan-product", (data: any) => {
      console.log("[WebSocket] 📱 Received barcode (scan-product):", data);
      const barcode = extractBarcode(data);
      if (barcode && barcode !== "") {
        console.log("[WebSocket] Calling onBarcodeReceived callback with:", barcode);
        this.callbacks.onBarcodeReceived?.(barcode);
      } else {
        console.warn("[WebSocket] Invalid barcode data received:", data);
      }
    });

    // Listen for any other events for debugging
    this.socket.onAny((eventName, ...args) => {
      console.log("[WebSocket] 🔔 Received event:", eventName, args);
    });

    this.socket.on("disconnect", () => {
      console.log("[WebSocket] ❌ Disconnected from server");
      this.isConnected = false;
      this.callbacks.onDisconnected?.();
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error("[WebSocket] ❌ Connection error:", error);
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

