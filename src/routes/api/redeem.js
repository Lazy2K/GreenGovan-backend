const router = require("express").Router();
const database = require("../../customModules/database");
const crypto = require("crypto");

router.post("/", async (req, res) => {
  // Guard clauses
  if (!req.body.points) {
    res.statusMessage = "No points given";
    return res.sendStatus(400);
  }
  if (!req.user.userID) {
    res.statusMessage = "No userId given";
    return res.sendStatus(400);
  }

  if (!Number.isInteger(req.body.points)) {
    res.statusMessage = "Points is not an integer";
    return res.sendStatus(400);
  }

  // Database query arguments
  var data = [
    {
      // Filter user documents by object ID
      filter: { _id: { $oid: req.user.userID } },
    },
    {
      // Increment users points by negative points value
      update: { $inc: { points: req.body.points * -1 } },
    },
  ];

  // Call to database
  await database
    .query("Community", "updateOne", data)
    .then((document) => {
      res.statusMessage = "Points deducted";
      return res.send({
        ticket: crypto
          .createHash("sha256", process.env.REFRESH_TOKEN_SECRET_KEY)
          .update(JSON.stringify({ user: req.user, points: req.body.points }))
          .digest("hex"),
      });
    })
    .catch(() => {
      res.statusMessage = "Points failed to update";
      return res.sendStatus(500);
    });
});

// Export route
module.exports = router;
