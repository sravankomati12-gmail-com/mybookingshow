const express = require("express");
const movieControl = require("../controllers/movieController");
const { movieValidation } = require("../middleware/auth");
const movieRouter = express.Router();

movieRouter.post("/addmovie", movieValidation, movieControl.addMovie);
movieRouter.post("/updatemovie", movieValidation, movieControl.updateMovie);
movieRouter.get("/allmovies", movieControl.getAllMovie);
movieRouter.get("/moviebyid", movieControl.getMovieById);
movieRouter.delete("/deletemovie", movieControl.deleteMovie);
movieRouter.post("/moviesearch", movieControl.searchMovie);

module.exports = movieRouter;
