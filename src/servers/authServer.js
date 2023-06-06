const express = require("express");
const cors = require("cors");
const authServer = express();
const jwt = require("jsonwebtoken");
const database = require("../customModules/database");

authServer.use(express.json());
authServer.use(
  cors({
    origin: "http://localhost:19006",
  })
);

// generates new access token
function generateAccessToken(user) {
  return jwt.sign(
    {
      username: user.username,
      firstname: user.firstname,
      surname: user.surname,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "5m",
    }
  );
}

// validates user against database
async function validateUser(username, password, collection) {
  // data request parameters
  var args = [
    {
      filter: {
        username: username,
        password: password,
      },
      projection: {
        password: 0,
      },
    },
  ];

  return await database
    .query(collection, "findOne", args)
    .then((document) => {
      return document;
    })
    .catch((err) => {
      console.warn(err);
      return null;
    });
}

// validates user against database
async function validateRefreshToken(token) {
  var args = [
    {
      filter: {
        token: token,
      },
    },
  ];

  return await database
    .query("RefreshTokens", "findOne", args)
    .then((document) => {
      return document;
    })
    .catch((err) => {
      console.warn(err);
      return null;
    });
}

// insert refresh token into database
async function addRefreshToken(token) {
  var args = [
    {
      document: {
        token: token,
        createdAt: new Date(),
      },
    },
  ];

  return await database
    .query("RefreshTokens", "insertOne", args)
    .then((document) => {
      return document;
    })
    .catch((err) => {
      console.warn(err);
      return null;
    });
}

// remove refresh token from database
async function removeRefreshToken(token) {
  var args = [
    {
      filter: {
        token: token,
      },
    },
  ];

  return await database
    .query("RefreshTokens", "deleteOne", args)
    .then((document) => {
      return document;
    })
    .catch((err) => {
      console.warn(err);
      return null;
    });
}

//ROUTES

// default
authServer.get("/", (req, res) => {
  var data = {
    heading: "Authorisation Server",
    route: "/",
  };
  res.json(data);
});

// authenticate users
authServer.post("/login/:portal", async (req, res) => {
  const { username, password } = req.body;

  let collection =
    req.params.portal.toLowerCase() === "client" ? "Clients" : "Users";

  let user = await validateUser(username, password, collection);

  // send error message and appropriate status code to frontend if no user's account has both that username and password
  if (!user) {
    res.statusMessage = "Invalid Username or Password";
    res.status(401).end();
    return;
  }

  let userData = {
    username: user.username,
    firstname: user.firstname,
    surname: user.surname,
  };

  console.log(`${userData.username} is logged in`); //testing

  // signs a new token for that userID, using the secret key stored in the eviromnent variable - includes their accessLevel
  const accessToken = generateAccessToken(userData);
  const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET_KEY);

  addRefreshToken(refreshToken);

  // send token back to frontend with response status 200 (OK)
  res
    .status(200)
    .send({ accessToken: accessToken, refreshToken: refreshToken });
});

// logout user and remove refresh token from database
authServer.delete("/logout", async (req, res) => {
  const refreshToken = req.body.token;

  // if not refresh token provided
  if (refreshToken == null) return res.sendStatus(401);

  // validates refresh token
  const validRefreshToken = await validateRefreshToken(refreshToken);

  // if refresh token is not valid
  if (!validRefreshToken) {
    return res.sendStatus(403);
  }

  // verify refresh token, subsequently logging user out if verified
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    (err, user) => {
      // if token is invalid return error
      if (err) return res.sendStatus(403);

      console.log(`Logging out user: ${user.firstname}`); //debugging

      // remove refresh token from database
      removeRefreshToken(refreshToken);
      res.status(200).send({ message: "Successfully logged out" });
    }
  );
});

// get a new access token
authServer.post("/token", async (req, res) => {
  const refreshToken = req.body.token;

  // if not refresh token provided
  if (refreshToken == null) return res.sendStatus(401);

  const validRefreshToken = await validateRefreshToken(refreshToken);

  // if refresh token is not valid
  if (!validRefreshToken) {
    return res.sendStatus(403);
  }

  // verify refresh token, subsequently generating a new access token if verified
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    (err, user) => {
      // if token is invalid return error
      if (err) return res.sendStatus(403);

      console.log(`Refreshing token for user: ${user.firstname}`); //debugging

      // otherwise generate a new access token
      const accessToken = generateAccessToken(user);
      // and send that access token back to the frontend
      res.status(200).send({ accessToken: accessToken });
    }
  );
});

module.exports = authServer;
