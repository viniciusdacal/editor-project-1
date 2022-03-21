import { Socket } from 'socket.io';

import notesWsRoutes from './packages/notes/wsRoutes';

export default function initialize(socket: Socket): void {
  notesWsRoutes(socket);
}
