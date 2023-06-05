const dotenv = require("dotenv");
const authServer = require("./src/servers/authServer");

dotenv.config();

// ports
const MAIN_PORT = 5050;
const AUTH_PORT = 5051;

authServer.listen(AUTH_PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Auth Server: https://localhost:${AUTH_PORT}`);
  }
});
