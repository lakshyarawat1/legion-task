import { Response } from "express";

class SSEManager {
  private connections: Map<string, Set<Response>>;

  constructor() {
    this.connections = new Map();

    // Start a periodic heartbeat to keep connections alive
    setInterval(() => {
      this.broadcastToAll("heartbeat", { timestamp: new Date().toISOString() });
    }, 30000);
  }

  /**
   * Add a new connection for a user.
   */
  public addConnection(userId: string, res: Response): void {
    if (!this.connections.has(userId)) {
      this.connections.set(userId, new Set());
    }
    this.connections.get(userId)!.add(res);

    // Initial connection heartbeat
    this.sendToResponse(res, "heartbeat", { timestamp: new Date().toISOString() });
  }

  /**
   * Remove a connection for a user.
   */
  public removeConnection(userId: string, res: Response): void {
    const userConnections = this.connections.get(userId);
    if (userConnections) {
      userConnections.delete(res);
      if (userConnections.size === 0) {
        this.connections.delete(userId);
      }
    }
  }

  /**
   * Send an event to all active connections for a specific user.
   */
  public sendToUser(userId: string, event: string, data: any): void {
    const userConnections = this.connections.get(userId);
    if (userConnections) {
      for (const res of userConnections) {
        this.sendToResponse(res, event, data);
      }
    }
  }

  /**
   * Broadcast an event to all active connections (internal use for heartbeats).
   */
  private broadcastToAll(event: string, data: any): void {
    for (const [userId, userConnections] of this.connections.entries()) {
      for (const res of userConnections) {
        this.sendToResponse(res, event, data);
      }
    }
  }

  /**
   * Helper to write formatted SSE strings to a response stream.
   */
  private sendToResponse(res: Response, event: string, data: any): void {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  public getConnectionCount(): number {
    let count = 0;
    for (const [userId, userConnections] of this.connections.entries()) {
      count += userConnections.size;
    }
    return count;
  }
}

// Export as a singleton
export const sseManager = new SSEManager();
