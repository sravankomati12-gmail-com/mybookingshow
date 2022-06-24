const express = require("express");
const app = express();
require("./config/db");
const mainRoute = require("./routes/index");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger.json");
const uploaded = require("express-fileupload");
const cors = require("cors");
const frontendRoute = require("./routes/frontendRouter");
require("dotenv").config();
require("./config/passport")(passport);

app.use(uploaded());
app.set("view engine", "ejs");
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(passport.initialize());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", mainRoute);
// frontend Router
app.use(frontendRoute);

app.listen(process.env.PORT, () => {
  console.log("Server is started");
});
