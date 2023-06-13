const express = require("express");
const cors = require("cors");
const apiServer = express();

apiServer.use(express.json());
apiServer.use(
  cors({
    origin: "http://localhost:19006",
  })
);

const apiRoute = require("../routes/api");

apiServer.use("/api", apiRoute);

apiServer.get("/", (req, res) => {
  res.redirect("/api");
});

module.exports = apiServer;
