const router = require("express").Router();
const authMiddleware = require("../customModules/authenticationMiddleware");

// api routes
const pointsRoute = require("./api/points");
const usersRoute = require("./api/users");
const scannerRoute = require("./api/scanner");

router.use("/points", authMiddleware.authenticateAccessToken, pointsRoute);
router.use("/users", authMiddleware.authenticateAccessToken, usersRoute);
router.use("/scanner", authMiddleware.authenticateAccessToken, scannerRoute);

router.get("/", (req, res) => {
  var data = {
    heading: "API Version 3",
    route: "/api",
  };
  res.json(data);
});

module.exports = router;
