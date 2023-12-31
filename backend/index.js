require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Person = require("./models/person");
const unknownEndpointMiddleware = require("./middlewares/unknownEndpoints");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const morganMiddleware = require("./middlewares/morgan");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("static_dist"));
app.use(morganMiddleware);

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

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) response.json(person).end();
      else response.status(404).end();
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

const updateOrCreatePerson = (request, response, next) => {
  const body = request.body;
  if (!body.name || !body.number)
    return response.status(400).json({ error: "Name or number missed" });

  Person.findOne({ name: body.name })
    .then((person) => {
      // That person is not in the db
      if (!person) {
        const newPerson = new Person({ ...body });
        newPerson
          .save()
          .then((savedPerson) => response.json(savedPerson))
          .catch((error) => next(error));
      } else {
        // Otherwise, take its id and update
        Person.findByIdAndUpdate(
          person.id,
          { ...body },
          { new: true, runValidators: true, context: "query" }
        )
          .then((updatedPerson) => response.json(updatedPerson))
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));
};

app.post("/api/persons", (request, response, next) => {
  updateOrCreatePerson(request, response, next);
});

app.put("/api/persons/:id", (request, response, next) => {
  updateOrCreatePerson(request, response, next);
});

app.use(unknownEndpointMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
