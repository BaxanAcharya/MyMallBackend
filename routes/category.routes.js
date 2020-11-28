const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const categoryById = require("../middleware/categoryById");
const { check, validationResult } = require("express-validator");

//@routes POST api/category/
//@desc Get All Category
//@access public
router.get("/all", async (req, res) => {
  try {
    let data = await Category.find({});
    res.json(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@routes POST api/category/:categoryId
//@desc Get Single Category
//@access public
router.get("/:categoryId", categoryById, async (req, res) => {
  res.json(req.category);
});

//@routes PUT api/category/:categoryId
//@desc Update Single Category
//@access private admin
router.put("/:categoryId", auth, adminAuth, categoryById, async (req, res) => {
  //category from middleware categoryById
  let category = req.category;
  //getting name from body
  const { name } = req.body;
  //removing whitespace
  if (name) category.name = name.trim();
  try {
    //updating a category
    category = await category.save();
    res.json(category);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@routes DELETE api/category/:categoryId
//@desc Delete Single Category
//@access private admin
router.delete(
  "/:categoryId",
  auth,
  adminAuth,
  categoryById,
  async (req, res) => {
    let category = req.category;
    try {
      let deletedCategory = await category.remove();
      res.json({
        message: `${deletedCategory.name} deleted successfully`,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//@routes POST api/category/
//@desc Add Category
//@access private admin
router.post(
  "/",
  [check("name", "Name is required").trim().not().isEmpty()],
  auth,
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg,
      });
    }
    const { name } = req.body;
    try {
      let category = await Category.findOne({ name });
      if (category) {
        return res.status(403).json({
          error: `Category ${name} already exist`,
        });
      }
      const newCategory = new Category({ name });
      category = await newCategory.save();
      res.json(category);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
module.exports = router;
