const router = require("express").Router();
const authMiddleware = require("../customModules/authenticationMiddleware");

// api routes
const pointsRoute = require("./api/points");
const usersRoute = require("./api/users");

router.use("/points", authMiddleware.authenticateAccessToken, pointsRoute);
router.use("/users", authMiddleware.authenticateAccessToken, usersRoute);

router.get("/", (req, res) => {
  var data = {
    heading: "API Version 2 - test",
    route: "/api",
  };
  res.json(data);
});

module.exports = router;
