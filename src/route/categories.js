const express = require("express");
const multer = require("multer");
const category = require("../models/category");
const { validateCategory } = require("../utils/validation");
const { userAuth } = require("../middlewares/userAuthMiddleware");

const categoryRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

categoryRouter.post(
  "/category/create",
  upload.single("photo"),
  userAuth,
  async (req, res) => {
    try {
      const { name, description } = req.body;
      validateCategory(req);
      if (!req.file) {
        throw new Error("Photo is required");
      }
      const newCategory = new category({
        name,
        description,
        photo: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      });
      await newCategory.save();
      res.status(200).json({
        message: "Category Created Successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Error: " + error.message,
      });
    }
  }
);

categoryRouter.get("/category/:id", userAuth, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryData = await category.findById(categoryId);
    if (!categoryData) {
      throw new Error("Category not found");
    }
    let categoryObj = {
      _id: categoryData._id,
      name: categoryData.name,
      description: categoryData.description,
      photo: categoryData.photo
        ? `data:${
            categoryData.photo.contentType
          };base64,${categoryData.photo.data.toString("base64")}`
        : null,
    };
    res.status(200).json({
      data: categoryObj,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error: " + error.message,
    });
  }
});

categoryRouter.patch(
  "/category/update/:id",
  upload.single("photo"),
  userAuth,
  async (req, res) => {
    try {
      const categoryId = req.params.id;
      const categoryData = await category.findById(categoryId);
      if (!categoryData) {
        throw new Error("Category not found");
      }
      const { name, description } = req.body;
      if (name) categoryData.name = name;
      if (description) categoryData.description = description;
      if (req.file) {
        categoryData.photo = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }
      await categoryData.save();
      res.status(200).json({
        message: "Category Updated Successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Error: " + error.message,
      });
    }
  }
);

categoryRouter.get("/categoryAll", userAuth, async (req, res) => {
  try {
    const categories = await category.find();
    let categoryList = [];
    categories.forEach((category) => {
      let categoryObj = {
        _id: category._id,
        name: category.name,
        description: category.description,
        photo: category.photo
          ? `data:${
              category.photo.contentType
            };base64,${category.photo.data.toString("base64")}`
          : null,
      };
      categoryList.push(categoryObj);
    });
    res.status(200).json({
      data: categoryList,
    });
  } catch (error) {
    res.status(500).send("Error retrieving image");
  }
});

categoryRouter.delete("/category/delete/:id", userAuth, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryData = await category.findById(categoryId);
    if (!categoryData) {
      throw new Error("Category not found");
    }
    await category.findByIdAndDelete(categoryId);
    res.status(200).json({
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error: " + error.message,
    });
  }
});

module.exports = categoryRouter;
