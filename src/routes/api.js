const router = require("express").Router();
const authMiddleware = require("../customModules/authenticationMiddleware");

// api routes
// const exampleRoute = require("../routes/api/exampleRoute");

// router.use("/example", authMiddleware.authenticateAccessToken, exampleRoute);

const pointsRoute = require("../routes/api/points");
router.use("/points", pointsRoute);

router.get("/", (req, res) => {
  var data = {
    heading: "API functioning correctly.",
    route: "/api",
  };
  res.json(data);
});

module.exports = router;
