const morgan = require("morgan");

morgan.token("person-data", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
});

module.exports = morgan(
  ":method :url :status :res[content-length] - :response-time ms :person-data"
);
