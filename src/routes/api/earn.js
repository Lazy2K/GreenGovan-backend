const router = require("express").Router();
const database = require("../../customModules/database");

router.post("/", async (req, res) => {
  // Guard clauses
  if (!req.body.points) {
    res.statusMessage = "Points not set";
    return res.sendStatus(400);
  }
  if (!req.body.userID) {
    res.statusMessage = `UserID ${req.body.userID} not set`;
    return res.sendStatus(400);
  }
  if (!Number.isInteger(req.body.points)) {
    res.statusMessage = `Points ${req.body.points} is not an integer`;
    return res.sendStatus(400);
  }

  // Database query arguments
  var data = [
    {
      // Filter user documents by object ID
      filter: { _id: { $oid: req.body.userID } },
    },
    {
      // Increment users points by points value
      update: { $inc: { points: req.body.points } },
    },
  ];

  // Call to database
  await database
    .query("Community", "updateOne", data)
    .then((document) => {
      res.statusMessage = "Points added";
      return res.sendStatus(200);
    })
    .catch(() => {
      res.statusMessage = "Points failed to update";
      return res.sendStatus(500);
    });
});

// Export route
module.exports = router;
