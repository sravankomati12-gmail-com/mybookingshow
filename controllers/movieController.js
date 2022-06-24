const movieModel = require("../models/movieModel");
const fs = require("fs");
const path = process.env.imagepath;

module.exports = {
  addMovie: async (req, res) => {
    try {
      const {
        name,
        decription,
        language,
        releaseDate,
        rating,
        director,
        producers,
        casting,
      } = req.body;

      const { image } = req.files;

      const imageName = Date.now() + "_" + image.name;
      const imageStore = "./public/" + imageName;
      image.mv(imageStore, async (err) => {
        if (err) {
          console.log(err);
        } else {
          const imagePath = path + imageName;
          await movieModel.create({
            name,
            decription,
            language,
            releaseDate,
            rating,
            director,
            producers,
            casting,
            image: imagePath,
          });
          res.json({ message: "New movie are added" });
        }
      });
    } catch (error) {
      // console.log(error.message);
      res.json({ error: error.message });
    }
  },
  getAllMovie: async (req, res) => {
    try {
      const { skipNo, fetchNo } = req.query;
      if (
        (skipNo == "" && fetchNo == "") ||
        (skipNo === undefined && fetchNo === undefined)
      ) {
        const data = await movieModel
          .find()
          .select({ name: 1, _id: 1, image: 1 })
          .skip(0)
          .limit(10);
        res.json({ message: "List of movies", data });
      } else {
        const data = await movieModel
          .find()
          .select({ name: 1, _id: 1, image: 1 })
          .skip(skipNo)
          .limit(fetchNo);
        res.json({ message: "List of movies", data });
      }
    } catch (error) {
      console.log(error.message);
    }
  },
  getMovieById: async (req, res) => {
    try {
      const data = await movieModel.findOne({ _id: req.query.id });
      if (data) {
        res.json({ message: "Get movie by id", data });
      } else {
        res.json({ message: "This movie id is not exist" });
      }
    } catch (error) {
      console.log(error.message);
    }
  },
  updateMovie: async (req, res) => {
    try {
      const {
        name,
        decription,
        language,
        releaseDate,
        rating,
        director,
        producers,
        casting,
        id,
      } = req.body;
      const { image } = req.files;
      const imageName = Date.now() + "_" + image.name;
      const imageStore = "./public/" + imageName;
      const data = await movieModel.findOne({ _id: id });
      if (data) {
        fs.unlink(`./public/${data.image.split("4005/")[1]}`, (err, data) => {
          if (err) {
            res.status(404).json({ message: err.message });
          } else {
            image.mv(imageStore, async (err) => {
              if (err) {
                console.log(err);
              } else {
                const imagePath = path + imageName;
                await movieModel.findByIdAndUpdate(
                  { _id: id },
                  {
                    name,
                    decription,
                    language,
                    releaseDate,
                    rating,
                    director,
                    producers,
                    casting,
                    image: imagePath,
                  }
                );
                res.json({ message: "This movie detail is updated " });
              }
            });
          }
        });
      } else {
        res.json({ message: "This movie id is not exist" });
      }
    } catch (error) {
      console.log(error.message);
    }
  },
  deleteMovie: async (req, res) => {
    try {
      const data = await movieModel.findOne({ _id: req.query.id });
      if (data) {
        fs.unlink(
          `./public/${data.image.split("4005/")[1]}`,
          async (err, data) => {
            if (err) {
              res.status(404).json({ message: err.message });
            } else {
              await movieModel.findByIdAndDelete(req.query.id);
              res.json({ message: "This movie is deleted" });
            }
          }
        );
      } else {
        res.json({ message: "This movie id is not exist" });
      }
    } catch (error) {
      console.log(error.message);
    }
  },
  searchMovie: async (req, res) => {
    try {
      // console.log(req.body);
      const { name } = req.body;
      // const result = await movieModel.find(req.body);
      const data = await movieModel.find({
        name: { $regex: `${name}`, $options: "i" },
      });
      res.json({ message: "Get movies by what your search", data });
    } catch (error) {
      res.json({ message: error.message });
    }
  },
};
