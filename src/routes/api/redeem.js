const router = require("express").Router();
const database = require("../../customModules/database");
const authMiddleware = require("../../customModules/authenticationMiddleware");

router.post(
  "/",
  /* Client only access middleware */ async (req, res) => {
    // Guard clauses
    if (!req.body.points) {
      res.statusMessage = "Points 'points' not set";
      return res.sendStatus(400);
    }
    if (!req.body.userID) {
      res.statusMessage = "UserID 'userID' not set";
      return res.sendStatus(400);
    }
    if (!Number.isInteger(req.body.points)) {
      res.statusMessage = "Points 'points' is not an integer";
      return res.sendStatus(400);
    }

    // Database query arguments
    var data = [
      {
        // Filter user documents by object ID
        filter: { _id: { $oid: req.body.userID } },
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
        return res.sendStatus(200);
      })
      .catch(() => {
        res.statusMessage = "Points failed to update";
        return res.sendStatus(500);
      });
  }
);

// Export route
module.exports = router;
