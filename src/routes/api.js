const router = require("express").Router();
const authMiddleware = require("../customModules/authenticationMiddleware");

// api routes
// const exampleRoute = require("../routes/api/exampleRoute");

// router.use("/example", authMiddleware.authenticateAccessToken, exampleRoute);

const earnRoute = require("../routes/api/earn");
const redeemRoute = require("../routes/api/redeem");

router.use("/earn", earnRoute);
router.use("/redeem", redeemRoute);

router.get("/", (req, res) => {
  var data = {
    heading: "API functioning correctly.",
    route: "/api",
  };
  res.json(data);
});

module.exports = router;
