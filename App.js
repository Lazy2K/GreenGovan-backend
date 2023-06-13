const dotenv = require("dotenv");
const authServer = require("./src/servers/authServer");
const apiServer = require("./src/servers/apiServer");

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
