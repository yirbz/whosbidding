type SSEController = ReadableStreamDefaultController<Uint8Array>;

class SSEBroadcaster {
  private clients: Set<SSEController> = new Set();
  private encoder: TextEncoder = new TextEncoder();

  /**
   * Register a new client SSE stream controller
   */
  public addClient(controller: SSEController): () => void {
    this.clients.add(controller);
    console.log(`[SSE] Client connected. Active streams: ${this.clients.size}`);

    // Return cleanup function
    return () => {
      this.clients.delete(controller);
      console.log(`[SSE] Client disconnected. Active streams: ${this.clients.size}`);
    };
  }

  /**
   * Broadcast a payload to all connected SSE clients
   */
  public broadcast(event: string, data: any): void {
    if (this.clients.size === 0) return;

    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    const encoded = this.encoder.encode(message);

    for (const client of this.clients) {
      try {
        client.enqueue(encoded);
      } catch (err) {
        // Client connection closed or broken
        this.clients.delete(client);
      }
    }
  }

  /**
   * Send heartbeat ping to keep connection alive through proxies/ngrok
   */
  public sendHeartbeat(controller: SSEController): boolean {
    try {
      controller.enqueue(this.encoder.encode(": ping\n\n"));
      return true;
    } catch {
      this.clients.delete(controller);
      return false;
    }
  }

  /**
   * Get active connection count
   */
  public get clientCount(): number {
    return this.clients.size;
  }
}

// Global singleton instance
const globalBroadcaster = (globalThis as any).__sseBroadcaster || new SSEBroadcaster();
if (process.env.NODE_ENV !== "production") {
  (globalThis as any).__sseBroadcaster = globalBroadcaster;
}

export const sseBroadcaster = globalBroadcaster;
