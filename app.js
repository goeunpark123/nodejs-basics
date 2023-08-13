const bodyParser = require("body-parser");

const express = require("express");
const app = express();

const feedRoutes = require("./routes/feed");

app.use(bodyParser.json());
app.use("/feed", feedRoutes);

app.listen(3000);
