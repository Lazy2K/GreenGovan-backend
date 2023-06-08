const router = require("express").Router();
const database = require("../../customModules/database");
const authMiddleware = require("../../customModules/authenticationMiddleware");

router.post(
  "/",
  /* Client only access middleware */ async (req, res) => {
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
    var data = [
      {
        filter: { id: req.body.userID },
      },
      {
        update: { $inc: { points: req.body.points } },
      },
    ];
    await database
      .query("Users", "updateOne", data)
      .then((document) => {
        console.log(document);
        res.statusMessage = "Points added";
        return res.sendStatus(200);
      })
      .catch(() => {
        res.statusMessage = "Points failed to update";
        return res.sendStatus(500);
      });
  }
);

module.exports = router;
