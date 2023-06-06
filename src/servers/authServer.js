const express = require("express");
const cors = require("cors");
const authServer = express();
const jwt = require("jsonwebtoken");
var axios = require("axios");
const databaseModule = require("../customModules/databaseModule");
const { database } = require("../customModules/databaseModule");

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
  var data = [
    {
      filter: {
        username: username,
        password: password,
      },
    },
  ];

  return await databaseModule
    .database(collection, "findOne", data)
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
  // data request parameters
  var data = JSON.stringify({
    collection: "RefreshTokens",
    database: "GreenGovanDatabase",
    dataSource: "GreenGovanCluster",
    filter: {
      token: token,
    },
  });

  // request configuation
  var config = {
    method: "POST",
    url: `${process.env.DATABASE_ENDPOINT}/action/findOne`,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.DATABASE_API_KEY,
    },
    data: data,
  };

  // find matching user in database
  return await axios(config)
    .then(function (response) {
      return response.data.document;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
}

// insert refresh token into database
async function addRefreshToken(token) {
  // data request parameters
  var data = JSON.stringify({
    collection: "RefreshTokens",
    database: "GreenGovanDatabase",
    dataSource: "GreenGovanCluster",
    document: {
      token: token,
      createdAt: new Date(),
    },
  });

  // request configuation
  var config = {
    method: "POST",
    url: `${process.env.DATABASE_ENDPOINT}/action/insertOne`,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.DATABASE_API_KEY,
    },
    data: data,
  };

  // send request to database api
  axios(config).catch(function (error) {
    console.warn(error);
  });
}

// remove refresh token from database
async function removeRefreshToken(token) {
  // data request parameters
  var data = JSON.stringify({
    collection: "RefreshTokens",
    database: "GreenGovanDatabase",
    dataSource: "GreenGovanCluster",
    filter: {
      token: token,
    },
  });

  // request configuation
  var config = {
    method: "POST",
    url: `${process.env.DATABASE_ENDPOINT}/action/deleteOne`,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.DATABASE_API_KEY,
    },
    data: data,
  };

  // find matching user in database
  return await axios(config)
    .then(function (response) {
      return response.data.document;
    })
    .catch(function (error) {
      console.log(error);
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
authServer.post("/login/:collection", async (req, res) => {
  const { username, password } = req.body;

  let user = await validateUser(username, password, req.params.collection);

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
