const express = require("express");
const app = express();

app.listen(3010, () => {
  console.log(`Server running in 3010`);
});

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});
