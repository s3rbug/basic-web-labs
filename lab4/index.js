import express from "express"
import { createServer } from "node:http"
import path from "node:path"
import { Server } from "socket.io"

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("public")));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.html'));
});

io.on('connection', (socket) => {
  socket.on('chat message', (name, message) => {
    io.emit('chat message', name, message);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
