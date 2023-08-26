const express = require("express");
const app = express();

app.use((req, res, next) => {
  let body = "";
  req.on("end", () => {
    //2
    const userName = body.split("=")[1];
    if (userName) {
      req.body = { name: userName };
    }
    console.log(body + "2");
    next();
  });
  req.on("data", (chunk) => {
    //1
    body += chunk;
  });
});

app.use((req, res, next) => {
  //second middleware
  if (req.body) {
    return res.send("<h1>" + req.body.name + "</h1>");
  }
  res.send(
    '<form method="POST"><input type="text" name="userName"><button type="text">check</button>'
  );
});

app.listen(5000);
