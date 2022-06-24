const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  name: String,
  decription: String,
  language: String,
  image: String,
  releaseDate: { type: Date, default: Date.now },
  rating: Number,
  director: String,
  producers: String,
  casting: String,
});

module.exports = mongoose.model("moviesInfo", movieSchema);
