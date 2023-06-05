const jwt = require("jsonwebtoken");

// token authentication middleware (run for all requests to /api route)
function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  // if no token is present
  if (!token) {
    console.log("Request made with no token");
    res.statusMessage = "Request made with no token";
    res.sendStatus(401);
    return;
  }

  // verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    // token is no longer valid
    if (err) {
      console.log("Request made with invalid token");
      return res.sendStatus(403);
    }
    console.log(`Authorised ${user.userID} for ${req.originalUrl}`); //debugging
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateAccessToken: authenticateAccessToken,
};
