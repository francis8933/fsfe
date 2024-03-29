const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname });
});
server.on('request', app);
server.listen(3000, function () {
  console.log('server started on port 3000');
});

/** Begin websocket  */
//we will use a library ws

const WebSocketServer = require('ws').Server;

//create a variable that store connection between the new websockectserver and the server created in express
const wss = new WebSocketServer({ server: server });

wss.on('connection', function connection(ws) {
  const numClient = wss.clients.size;
  console.log('Client connected', numClient);

  wss.broadcast(`Current visitors: ${numClient}`);

  if (ws.readyState === ws.OPEN) {
    ws.send('Welcome to my server');
  }

  ws.on('close', function close() {
    wss.broadcast(`Current visitors: ${numClient}`);
    console.log('A client has disconnected');
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
