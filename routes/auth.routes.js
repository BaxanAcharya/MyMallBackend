const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); //to generate token
const bcrypt = require("bcryptjs"); // to encrpyt password

const { check, validationResult } = require("express-validator"); //validation of incoming requests
const gravatar = require("gravatar"); //get user image by email
const auth = require("../middleware/auth");
//models
const User = require("../models/User");
const { token } = require("morgan");

//@routes POST api/user/
//@desc User Information
//@access private

router.get("/", auth, async (req, res) => {
  try {
    //get user information by id
    //.select to exclude password
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@routes POST api/user/register
//@desc Register user
//@access Public
router.post(
  "/register",
  [
    //validation
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    //get name, email and password from req
    const { name, email, password } = req.body;
    try {
      //check is email already exist
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: "Email already exist",
            },
          ],
        });
      }
      //if not exist
      //get image from gravatar
      const avatar = gravatar.url(email, {
        s: "200", //Size
        r: "pg", //Rate
        d: "mm", //
      });

      //create user oject
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //encrypt password
      const salt = await bcrypt.genSalt(10); //generate salt with 10
      //save password
      user.password = await bcrypt.hash(password, salt); //use salt and password to hash password
      //save user in db
      await user.save();

      //payload to generate token
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 36000, //for development for production it will 36000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//@routes POST api/user/login
//@desc Login user
//@access Public
router.post(
  "/login",
  [
    //validation
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    //if every thing is perfect
    //get email and password from body
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      //User not found in database
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid Email Credentails",
            },
          ],
        });
      }

      //user found compare the password
      const isMatch = await bcrypt.compare(password, user.password);

      //invalid password
      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid Password Credentails",
            },
          ],
        });
      }

      //payload for jwt
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
module.exports = router;
