import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import apiRoutes from './routes';
import wsRoutes from './wsRoutes';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  transports: ['websocket'],
});

const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api', apiRoutes);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.join(socket.id);
  wsRoutes(socket);
});

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
