import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import session from "./session";

export default class WS {
  private static ws: WebSocketServer;
  private static sockets: Record<string, WebSocket> = {};

  private constructor() {}

  public static init(httpServer: http.Server): void {
    this.ws = new WebSocketServer({ server: httpServer });
    this.ws.on("connection", this.onConnection);
  }

  private static async onConnection(
    socket: WebSocket,
    request: http.IncomingMessage
  ): Promise<void> {
    const sessionId = request.headers["aura-auth"];
    if (typeof sessionId !== "string") return;
    const userSession = await session.getUserSession(sessionId);
    if (userSession === null) return;
    this.sockets[sessionId] = socket;
    socket.on("close", () => {
      this.onSocketClose(sessionId);
    });
  }

  private static async onSocketClose(sessionId: string): Promise<void> {}
}
