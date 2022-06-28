const movieModel = require("../models/movieModel");
const movieModel123 = require("../models/moviesModel");
const fs = require("fs");
const xlsxFile = require("read-excel-file/node");
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
      const { page = 1 } = req.query;
      const data = await movieModel
        .find()
        .select({ name: 1, _id: 1, image: 1 })
        .skip(10 * page - 10)
        .limit(10);
      const count = await movieModel.count();
      res.json({
        message: "List of movies",
        data,
        current: page,
        pages: Math.ceil(count / 10),
      });
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
        try {
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
        } catch (error) {
          await movieModel.findByIdAndDelete(req.query.id);
          res.json({ message: "This movie is deleted" });
        }
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
  uploadExcelSheet: async (req, res) => {
    const { sheet } = req.files;
    const sheetName = Date.now() + "_" + sheet.name;
    const sheeteStore = "./sheets/" + sheetName;
    if (sheet.name.split(".")[1] == "xlsx") {
      sheet.mv(sheeteStore, async (err) => {
        if (err) {
          console.log(err);
        } else {
          xlsxFile(sheeteStore).then(async (rows) => {
            if (rows.length == 0) {
              res.json({ error: "excel sheet not be empty" });
            } else if (String(rows[0][0]) != "name") {
              res.json({ error: "1 cell should be name field" });
            } else if (String(rows[0][1]) != "description") {
              res.json({ error: "2 cell should be decription field" });
            } else if (String(rows[0][2]) != "language") {
              res.json({ error: "3rd cell should be language field" });
            } else if (String(rows[0][3]) != "releaseDate") {
              res.json({ error: "4th cell should be releaseDate field" });
            } else if (String(rows[0][4]) != "rating") {
              res.json({ error: "5th cell should be rating field" });
            } else if (String(rows[0][5]) != "director") {
              res.json({ error: "6th cell should be director field" });
            } else if (String(rows[0][6]) != "producers") {
              res.json({ error: "7th cell should be producers field" });
            } else if (String(rows[0][7]) != "casting") {
              res.json({ error: "8th cell should be casting field" });
            } else {
              for (let i = 1; i < rows.length; i++) {
                await movieModel.insertMany({
                  name: rows[i][0],
                  decription: rows[i][1],
                  language: rows[i][2],
                  releaseDate: rows[i][3],
                  rating: rows[i][4],
                  director: rows[i][5],
                  producers: rows[i][6],
                  casting: rows[i][7],
                });
              }
              res.json({ message: "file is imported" });
            }
          });
        }
      });
    } else {
      res.json({ error: "Please upload file only xlsx format" });
    }
  },
};
