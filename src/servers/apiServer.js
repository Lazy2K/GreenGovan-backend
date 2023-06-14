const express = require("express");
const apiServer = express();

apiServer.use(express.json());

const apiRoute = require("../routes/api");

apiServer.use("/api", apiRoute);

apiServer.get("/", (req, res) => {
  res.redirect("/api");
});

module.exports = apiServer;
