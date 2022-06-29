const mongoose = require("mongoose");
require("dotenv").config();

const connect = process.env.dbConnect;
mongoose.connect(connect, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (error) => {
  console.error(error);
});
mongoose.connection.on("open", () => {
  console.log("Database is connected");
});
