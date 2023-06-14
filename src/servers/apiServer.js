const express = require("express");
const apiServer = express();
const cors = require("cors");

apiServer.use(express.json());

apiServer.use(
  cors({
    origin: [
      "https://greengovan.netlify.app",
      "https://greengovanclient.netlify.app",
      "http://localhost:19006",
    ],
  })
);

const apiRoute = require("../routes/api");

apiServer.use("/api", apiRoute);

apiServer.get("/", (req, res) => {
  res.redirect("/api");
});

module.exports = apiServer;
