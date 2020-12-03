const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const productById = require("../middleware/productById");
const adminAuth = require("../middleware/adminAuth");

//@route POST api/product
//@desc Add a product
//@access Private admin
router.post("/", auth, adminAuth, async (req, res) => {
  //check for all fileds
  const {
    name,
    description,
    price,
    category,
    quantity,
    shipping,
    photo,
  } = req.body;
  if (
    !name ||
    !description ||
    !price ||
    !category ||
    !quantity ||
    !shipping ||
    !photo
  ) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  let product = new Product(req.body);

  try {
    await product.save();
    res.json("Product Created Successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route GET api/product/:productId
//@desc get a product
//@access public
router.get("/:productId", productById, (req, res) => {
  return res.json(req.product);
});

//@route GET api/product
//@desc get list of product with filter
//options (order=asc or desc, sortBy any product property like name, limit, number of returned product)
//@access public
router.get("/", async (req, res) => {
  let order = req.query ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit && parseInt(req.query.limit);

  try {
    let products = await Product.find({})
      // .select("-photo")
      .populate("category")
      .sort([[sortBy, order]])
      .limit(limit)
      .exec();
    res.json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Invalid query");
  }
});

//@route GET api/product/all/categories
//@desc get a list category products
//@access public
router.get("/all/categories", async (req, res) => {
  try {
    let category = await Product.distinct("category");
    if (!category) {
      return res.status(400).json({
        error: "Category not found",
      });
    }
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//@route GET api/product/all/search
//@desc get a list products by search query
//@access public
router.get("/all/search", async (req, res) => {
  const query = {};
  if (req.query.search) {
    query.name = {
      $regex: req.query.search,
      $options: "i", //ignore case sensitive
    };

    //asign category
    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
    }
  }
  try {
    let products = await Product.find(query);
    // .select("-photo");
    res.json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error to get products");
  }
});

module.exports = router;
