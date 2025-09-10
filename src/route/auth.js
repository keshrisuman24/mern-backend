const express = require("express");
const user = require("../models/user");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/userAuthMiddleware");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    validateSignUpData(req);
    const currentUser = await user.findOne({ emailId });
    if (currentUser) {
      throw new Error("User Already Exist");
    }
    const passwordHash = await bcrypt.hashSync(password, 10);
    const newUser = new user({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      role: "user",
    });
    await newUser.save();
    res.status(200).json({
      message: "User Created Successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error: " + error.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    validateLoginData(req);
    const currentUser = await user.findOne({ emailId });
    if (currentUser) {
      const isValidPassword = await currentUser.validatePassword(password);
      if (isValidPassword) {
        const token = await currentUser.getJwt();
        res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
        res.status(200).json({
          message: "Login Success",
          data: currentUser,
        });
      } else {
        throw new Error("Invalid Password");
      }
    } else {
      throw new Error("User Not Found");
    }
  } catch (error) {
    res.status(400).json({
      message: "Error: " + error.message,
    });
  }
});

authRouter.get("/getCurrentUser", userAuth, async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("No Token Provided");
    }
    const currentUser = await req.user;
    if (!currentUser) {
      throw new Error("Invalid Token");
    }
    res.status(200).json({
      message: "Current User",
      data: currentUser,
    });
  } catch (error) {
    res.status(401).json({
      message: "Error: " + error.message,
    });
  }
});

authRouter.get("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.status(200).json({
      message: "Logout Success",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error: " + error.message,
    });
  }
});

module.exports = authRouter;
