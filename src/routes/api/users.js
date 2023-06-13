const router = require("express").Router();
const database = require("../../customModules/database");

router.get("/me", async (req, res) => {
  // Guard clauses
  if (!req.user) {
    res.statusMessage = "No user given";
    return res.sendStatus(400);
  }

  let user = await database.query(
    req.user.accessLevel === 1 ? "Community" : "Clients",
    "findOne",
    [{ filter: { _id: { $oid: req.user.userID } } }]
  );

  return res.json(user);
});

// Export route
module.exports = router;
