import type { PartyKitServer } from "partykit/server";
import type { UserJoinedEvent } from "~/utils/chat";

const server: PartyKitServer = {
  onConnect(websocket, _room) {
    const userJoinedEvent: UserJoinedEvent = {
      __type: "USER_JOINED",
      data: {
        name: "Conor",
        userId: "",
      },
    };
    // This is invoked whenever a user joins a room
    websocket.send(JSON.stringify(userJoinedEvent));
  },
  onMessage: (message, websocket, room) => {
    if (typeof message === "string") {
      room.broadcast(message, [websocket.id]);
    }
  },
  // optionally, you can respond to HTTP requests as well
  onRequest(request, room) {
    return new Response("hello from room: " + room.id);
  },
};

export default server;
