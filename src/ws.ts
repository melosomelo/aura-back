import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import session from "./session";

export default class WS {
  private static ws: WebSocketServer;
  private static sockets: Record<string, WebSocket> = {};

  private constructor() {}

  public static init(httpServer: http.Server): void {
    WS.ws = new WebSocketServer({ server: httpServer });
    WS.ws.on("connection", this.onConnection);
  }

  public static async send<T = any>(
    receiverNickname: string,
    event: string,
    payload: T
  ): Promise<void> {
    const socket = WS.sockets[receiverNickname];
    socket.send(JSON.stringify({ event, payload }));
  }

  private static async onConnection(
    socket: WebSocket,
    request: http.IncomingMessage
  ): Promise<void> {
    const sessionId = request.headers["aura-auth"];
    if (typeof sessionId !== "string") return;
    const userSession = await session.getUserSession(sessionId);
    if (userSession === null) return;
    WS.sockets[userSession.user.nickname] = socket;
    socket.on("close", () => {
      WS.onSocketClose(userSession.user.nickname);
    });
  }

  private static async onSocketClose(nickname: string): Promise<void> {
    delete WS.sockets[nickname];
  }
}
