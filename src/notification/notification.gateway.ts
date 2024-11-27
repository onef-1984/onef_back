import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Notification } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import * as dotenv from 'dotenv';

// there is no other way to use process.env in the decorator
dotenv.config({
  path:
    process.env.NODE_ENV === undefined
      ? '.env.local'
      : `.env.${process.env.NODE_ENV}`,
});

const NAMESPACE = process.env.WS_NAMESPACE;
const ORIGIN = process.env.WS_ORIGIN;

@WebSocketGateway({
  namespace: NAMESPACE,
  cors: {
    origin: [ORIGIN],
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayDisconnect {
  private clients: Map<string, Socket> = new Map();

  @WebSocketServer()
  server: Server;

  sendMessage(userId: string, notification: Notification) {
    const client = this.clients.get(userId);

    if (client) {
      console.log('emit ' + notification.type + ' to ' + userId);
      client.emit('notification', notification);
    } else {
      console.log('Client not connected: ' + userId);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;

    if (userId) {
      this.clients.delete(userId);
      console.log('userId ' + userId + ' disconnected');
    }
  }

  @SubscribeMessage('userConnect')
  handleUserConnect(client: Socket, data: { userId: string }) {
    client.data.userId = data.userId;

    this.clients.set(data.userId, client);

    console.log('userId ' + client.data.userId + ' connected');

    return 'webSocket Connected';
  }
}
