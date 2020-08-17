const http = require('http');
const express = require('express');
const app = express();
const webSocket = require('ws');
const db = require('./config/db');
const server = http.createServer(app);
const PORT = process.env.PORT || 10001;
const wss = new webSocket.Server({ server: server });

app.listen(PORT, () => {
  console.log(`app running on port ${PORT} ...`);
  db();
});
