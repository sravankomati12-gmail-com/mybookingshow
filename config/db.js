const mongoose = require("mongoose");
require("dotenv").config();

const connect =
  process.env.dbConnect ||
  "mongodb+srv://sravan_vision:Sravan%40123@cluster0.vr3xu.mongodb.net/movies?retryWrites=true&w=majority";
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
