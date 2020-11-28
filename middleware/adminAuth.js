const User = require("../models/User");
module.exports = async function (req, res, next) {
  try {
    //get user information
    const user = await User.findOne({
      _id: req.user.id,
    });

    if (user.role === 0) {
      return res.status(403).json({
        error: "Admin Resource denied",
      });
    }
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};
