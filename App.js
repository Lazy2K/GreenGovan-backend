const dotenv = require("dotenv");
const authServer = require("./src/servers/authServer");
const apiServer = require("./src/servers/apiServer");

const WebSocket = require("ws");

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Handle incoming WebSocket connections
wss.on("connection", (ws) => {
  console.log("New client connected");

  // Handle incoming messages from clients
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);

    // Broadcast the received message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

dotenv.config();

// ports
const MAIN_PORT = 5050;
const AUTH_PORT = 5051;

authServer.listen(AUTH_PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Auth Server: http://localhost:${AUTH_PORT}`);
  }
});

apiServer.listen(MAIN_PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Api Server: http://localhost:${MAIN_PORT}`);
  }
});
