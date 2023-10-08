const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    minLength: [8, "Must be min 8 digits"],
    validate: {
      validator: (value) => {
        const pattern = /^\d{2,3}-\d+$/;
        return pattern.test(value);
      },
      message: () =>
        `Invalid format! Use XX-XXXXX, where XX is 2-3 numbers and XXXXX is numbers`,
    },
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
