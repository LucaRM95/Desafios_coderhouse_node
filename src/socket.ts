import { Server } from 'socket.io';
import { MessageManager } from './dao/messages/MessageManger';

export let io: Server;

let messages: any = [];
const messageManager = new MessageManager();

export const init = (httpServer: any) => {
  io = new Server(httpServer);

  io.on('connection', (socketClient) => {
    console.log(`Se ha conectado un nuevo cliente 🎉 (${socketClient.id})`);

    socketClient.emit('notification', { messages });

    socketClient.broadcast.emit('new-client');

    socketClient.on('new-message', async (data) => {
      const { user, message } = data;
      messages.push({ user, message });
      messageManager.setMessage({ user, message });
      io.emit('notification', { messages });
      messages = []
    })
  });

  console.log('Server socket running 🚀');
};

export const emitFromApi = (event: any, data: any) => io.emit(event, data);