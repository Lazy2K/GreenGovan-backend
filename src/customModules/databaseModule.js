var axios = require("axios");

async function database(collection, action, args) {
  // Guard Clauses
  if (!Array.isArray(args)) {
    throw new Error("Args not passes as Array.");
  }

  // Database call config
  var config = {
    method: "POST",
    url: `${process.env.DATABASE_ENDPOINT}/action/${action}`,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.DATABASE_API_KEY,
    },
    data: {
      collection: collection,
      database: "GreenGovanDatabase",
      dataSource: "GreenGovanCluster",
    },
  };

  // Add arguments to database call
  args.forEach((element) => {
    Object.assign(config.data, element);
  });

  // Execute database call
  return await axios(config)
    .then(function (response) {
      return response.data.document;
    })
    .catch(function (error) {
      console.warn(error);
      return null;
    });
}

module.exports = { database: database };
