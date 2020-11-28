const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
require("dotenv").config({
  path: "./config/server.env",
});

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

//Page not found
app.use((req, res) => {
  res.status(404).json({
    msg: "Page Not Found",
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running in ${PORT}`);
});
