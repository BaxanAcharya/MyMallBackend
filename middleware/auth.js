const jwt = require("jsonwebtoken");
module.exports = middwalre = (req, res, next) => {
  //Get token from header
  const token = req.header("x-auth-token");
  //if no token
  if (!token) {
    return res.status(401).json({
      msg: "No token, auth denied!!!",
    });
  }
  //verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //set user id in req.user
    req.user = decoded.user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      msg: "Token is not valid",
    });
  }
};
