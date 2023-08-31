const express = require("express");
const bodyParser = require("body-parser");
const placeRoutes = require("./routes/place-routes");
const userRoutes = require("./routes/user-routes");

const app = express();

app.use("/api/places", placeRoutes);
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error" });
});

//app.use("/api/users", userRoutes);
app.listen(5000);
