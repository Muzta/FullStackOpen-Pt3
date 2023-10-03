require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("static_dist"));

morgan.token("person-data", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person-data"
  )
);

app.get("/info", (request, response) => {
  const requestDate = new Date();
  Person.find({}).then((phonebook) => {
    const res = `<p>Phonebook has info for ${phonebook.length} people</p><p>${requestDate}</p>`;
    response.send(res).end();
  });
});

app.get("/api/persons", (request, response) =>
  Person.find({}).then((phonebook) => {
    response.json(phonebook).end();
  })
);

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) =>
    response.json(person).end()
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "Name or number missed" });
  }

  const person = new Person({ ...body });
  person.save().then((savedPerson) => response.json(savedPerson));
});

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "Unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
