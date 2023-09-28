const express = require("express");
const app = express();

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => response.json(phonebook));

app.get("/info", (request, response) => {
  const requestDate = new Date();
  const res = `<p>Phonebook has info for ${phonebook.length} people</p><p>${requestDate}</p>`;
  response.send(res).end();
  // "<p>Phonebook has info for  people</p><p></p>"
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});