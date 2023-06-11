const router = require("express").Router();
const database = require("../../customModules/database");

router.post("/id", async (req, res) => {
  // Guard clauses
  if (!req.body.clientID) {
    res.statusMessage = "No ID given";
    return res.sendStatus(400);
  }
  if (!req.body.terminalID) {
    res.statusMessage = "No ID given";
    return res.sendStatus(400);
  }
  if (!req.body.id) {
    res.statusMessage = "No ID given";
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
    .query("Clients", "insertOne", data)
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
