import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8800, {
  namespace: '/ws',
  cors: {
    origin: ['http://localhost:3001'],
    credentials: true,
  },
})
export class NotificationGateway {
  userMap: Map<string, string> = new Map();

  @WebSocketServer()
  server: Server;

  sendMessage(userId: string, message: string) {
    const clientId = this.userMap.get(userId);

    const client = this.server.sockets.sockets.get(clientId);

    if (client) {
      client.emit('notification', message);
    }
  }

  @SubscribeMessage('userConnect')
  handleUserConnect(client: Socket, data: { id: string }) {
    this.userMap.set(data.id, client.id);

    return 'webSocket Connected';
  }

  @SubscribeMessage('userDisconnect')
  handleUserDisconnect(client: Socket, data: { id: string }) {
    this.userMap.delete(data.id);

    return 'webSocket Disconnected';
  }
}
