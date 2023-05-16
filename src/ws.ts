import http from "http";
import { WebSocketServer, WebSocket, MessageEvent } from "ws";
import session from "./session";
import GameController from "./controllers/game";

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
    socket.onmessage = ( (event : MessageEvent) => {
      const data = JSON.parse(event.data.toString());
      if(data.type === "move"){
        const response = GameController.move;
        socket.emit("move", response);
      }else if(data.type === "run"){
        const response = GameController.run;
        socket.send(response.toString());
      }else if(data.type === "kick"){

      }else if(data.type === "goal"){
        const response = GameController.goal;
        socket.send(response.toString());
      }else{
        return;
      }
    });

    socket.on("close", () => {
      WS.onSocketClose(userSession.user.nickname);
    });
  }

  private static async onSocketClose(nickname: string): Promise<void> {
    delete WS.sockets[nickname];
  }
}
