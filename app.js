const express = require("express");
const bodyParser = require("body-parser");

const placeRoutes = require("./routes/place-routes");
const userRoutes = require("./routes/user-routes");

const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json()); //.urlencoded()

app.use("/api/places", placeRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error; //default error handler에서 메세지 출력
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error" });
});

//app.use("/api/users", userRoutes);
app.listen(5000);
