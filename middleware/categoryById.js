const mongoose = require("mongoose");
const Category = require("../models/Category");
const category = require("../models/Category");

module.exports = async function (req, res, next) {
  const { categoryId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(403).json({
      error: "Category Not Found",
    });
  }

  try {
    let category = await Category.findById(categoryId);
    if (!category) {
      return res.status(403).json({
        error: "Category Not Found",
      });
    }

    req.category = category;
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
  next();
};
