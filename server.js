const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
require("dotenv").config({
  path: "./config/server.env",
});
app.use(express.static(__dirname + "/public"));
const auth = require("./middleware/auth");
const adminAuth = require("./middleware/adminAuth");

//mongodb connection
const connectDb = require("./config/db");
connectDb();

//routes
app.use("/api/user", require("./routes/auth.routes"));
app.use(
  "/uploadproduct",
  auth,
  adminAuth,
  require("./routes/productImage.routes")
);
app.use("/api/category", require("./routes/category.routes"));
app.use("/api/product", require("./routes/product.routes"));
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
