const router = require("express").Router();
const database = require("../../customModules/database");
const authMiddleware = require("../../customModules/authenticationMiddleware");

// Importing points modification routes
const earnRoute = require("../api/earn");
const redeemRoute = require("../api/redeem");
router.use("/earn", earnRoute);
router.use("/redeem", redeemRoute);

// Main points route
router.get("/", async (req, res) => {
  if (!req.body.userID) {
    res.statusMessage = "No userID given";
    return res.sendStatus(400);
  }
  var data = [
    {
      // Filter user documents by object ID
      filter: { _id: { $oid: req.body.userID } },
    },
  ];
  await database
    .query("Community", "findOne", data)
    .then((document) => {
      return res.json(document.points);
    })
    .catch((err) => {
      res.statusMessage = "Couldn't load users points from database";
      return res.sendStatus(500);
    });
});

module.exports = router;
