const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ErrorHandler = require("./middlewares/error.middleware.js");
const middleWares = require("./middlewares/middlewares");

const app = express();
require("dotenv").config();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ req: "welcome to the test main app" });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
const db = require("./models");
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

const userRoute = require("./routes/user.route");

app.use("/v1/users/", [middleWares.tokenMiddleware], userRoute);
// custom error handler middleware
app.use(ErrorHandler);
