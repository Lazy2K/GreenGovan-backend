var axios = require("axios");

var ags = [
  {
    filter: {
      token: "hello",
    },
  },
  {
    documents: {
      hello: "hello",
    },
  },
];

async function database(collection, action, args) {
  // Guard clauses !

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

  args.forEach((element) => {
    Object.assign(config.data, element);
  });

  console.log(config.data);
}

database("Collectoin", "Action", ags);

module.exports;
