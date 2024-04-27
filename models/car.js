//Import
const mongoose = require("mongoose");

//Create Mongoose Schema
const carSchema = new mongoose.Schema({
    make: String,
    model: String,
    year: Number,
    domestic: Boolean,
    image: String,
    description: String
})

//Create model/collection
const Car = mongoose.model("Car", carSchema);

//Export model
module.exports = Car;
