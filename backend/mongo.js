const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Give password as argument");
  process.exit(1);
} else if (process.argv.length > 5) {
  console.log("Too many arguments have been given");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.stqut0q.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length == 3) {
  console.log("Phonebook:");
  Person.find({})
    .then((people) => {
      people.forEach((person) => {
        console.log(person.name, person.number);
      });
      mongoose.connection.close();
    })
    .catch((error) => console.log("An error occurred", error));
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4] ?? "",
  });
  person.save().then(() => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
