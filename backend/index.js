require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
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

const url = `mongodb+srv://fullstack:${process.env.MONGO_PASSWORD}@cluster0.stqut0q.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// let phonebook = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/info", (request, response) => {
  const requestDate = new Date();
  const res = `<p>Phonebook has info for ${phonebook.length} people</p><p>${requestDate}</p>`;
  response.send(res).end();
});

app.get("/api/persons", (request, response) =>
  Person.find({}).then((person) => {
    response.json(person);
    mongoose.connection.close();
  })
);

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((person) => person.id !== id);
  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "Name or number missed" });
  } else if (phonebook.find((person) => person.name === body.name)) {
    return response.status(400).json({ error: "Name must be unique" });
  }
  const person = { ...body, id: generateId() };
  phonebook = phonebook.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
