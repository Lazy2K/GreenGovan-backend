const express = require("express");
const apiServer = express();
const cors = require("cors");

apiServer.use(express.json());

apiServer.use(
  cors({ origin: "https://6488ae95304b69007f07e988--greengovan.netlify.app" })
);

const apiRoute = require("../routes/api");

apiServer.use("/api", apiRoute);

apiServer.get("/", (req, res) => {
  res.redirect("/api");
});

module.exports = apiServer;
