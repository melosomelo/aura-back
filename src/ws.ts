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

  public static send(
    receiverNickname: string,
    event: string,
    payload = {}
  ): void {
    const socket = WS.sockets[receiverNickname];
    if (socket) socket.send(JSON.stringify({ event, payload }));
  }

  private static async onConnection(
    socket: WebSocket,
    request: http.IncomingMessage
  ): Promise<void> {
    const sessionId = request.headers["aura-auth"];
    if (typeof sessionId !== "string") return;
    const userSession = await session.getUserSession(sessionId);
    if (userSession === null) {
      socket.close();
      return;
    }
    WS.sockets[userSession.user.nickname] = socket;
    socket.onmessage = async (event: MessageEvent) => {
      const data = JSON.parse(event.data.toString());
      if (data.event === "PLAYER_MOVED") {
        const game = await session.movePlayer(
          data.payload.gameId,
          data.payload.playerNickname,
          {
            x: data.payload.x,
            y: data.payload.y,
            z: data.payload.z,
          }
        );
        await game.teamA.players
          .concat(...game.teamB.players)
          .filter((p) => p.nickname !== userSession!.user.nickname)
          .map((p) => WS.send(p.nickname, "PLAYER_MOVED", data.payload));
      } else if (data.payload.event === "GOAL") {
      } else if (data.payload.event === "MOVE_BALL") {
      }
    };

    socket.on("close", () => {
      WS.onSocketClose(userSession.user.nickname);
    });
  }

  private static async onSocketClose(nickname: string): Promise<void> {
    delete WS.sockets[nickname];
  }
}
