const router = require("express").Router();

router.get("/me", async (req, res) => {
  // Guard clauses
  if (!req.user) {
    res.statusMessage = "No user given";
    return res.sendStatus(400);
  }

  return res.json(req.user);
});

// Export route
module.exports = router;
