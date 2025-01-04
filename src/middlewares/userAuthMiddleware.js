const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Please Login");
    }
    const verifyToken = jwt.verify(token, "JWTToken@123#");
    if (verifyToken) {
      const { _id } = verifyToken;
      const userDet = await User.findById(_id);
      req.user = userDet;
      next();
    } else {
      throw new Error("Unauthorized User");
    }
  } catch (error) {
    res.status(400).json({
      message: "Error: " + error.message,
    });
  }
};

module.exports = {
  userAuth,
};
