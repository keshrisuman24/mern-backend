const express = require("express");
const multer = require("multer");
const { userAuth } = require("../middlewares/userAuthMiddleware");
const brand = require("../models/brand");
const { validateBrand } = require("../utils/validation");
const brandRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

brandRouter.post(
  "/brand/create",
  upload.single("photo"),
  userAuth,
  async (req, res) => {
    try {
      const { name, description, categoryId } = req.body;
      validateBrand(req);
      if (!req.file) {
        throw new Error("Please Upload Photo");
      }
      const newBrand = new brand({
        name,
        description,
        categoryId,
        user: req.user._id,
        photo: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      });

      await newBrand.save();
      res.status(200).json({
        message: "Brand Created Successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Error: " + error.message,
      });
    }
  }
);

brandRouter.get("/brandAll", userAuth, async (req, res) => {
  try {
    const brands = await brand
      .find()
      .where({ user: req.user._id })
      .populate("categoryId", "name");
    let brandList = [];
    brands.forEach((el) => {
      let brandObj = {
        _id: el._id,
        name: el.name,
        description: el.description,
        photo: el.photo
          ? `data:${el.photo.contentType};base64,${el.photo.data.toString(
              "base64"
            )}`
          : null,
        categoryId: el.categoryId._id,
        categoryName: el.categoryId.name,
      };
      brandList.push(brandObj);
    });
    res.status(200).json({
      data: brandList,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error: " + error.message,
    });
  }
});

brandRouter.get("/brand/getBrand/:id", userAuth, async (req, res) => {
  try {
    const brandId = req.params.id;
    const brands = await brand
      .findById(brandId)
      .where({ user: req.user._id })
      .populate("categoryId", "name");
    if (!brands) {
      throw new Error("Brand not found");
    }
    const brandObj = {
      _id: brands._id,
      name: brands.name,
      description: brands.description,
      photo: brands.photo
        ? `data:${brands.photo.contentType};base64,${brands.photo.data.toString(
            "base64"
          )}`
        : null,
      categoryId: brands.categoryId._id,
      categoryName: brands.categoryId.name,
    };
    res.status(200).json({
      data: brandObj,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error: " + error.message,
    });
  }
});

brandRouter.patch(
  "/brand/update/:id",
  upload.single("photo"),
  userAuth,
  async (req, res) => {
    try {
      const brandId = req.params.id;
      const brandData = await brand
        .findById(brandId)
        .where({ user: req.user._id })
        .populate("categoryId", "name");
      if (!brandData) {
        throw new Error("Brand not found");
      }
      const { name, description, categoryId } = req.body;
      if (name) brandData.name = name;
      if (description) brandData.description = description;
      if (categoryId) brandData.categoryId = categoryId;
      if (req.file) {
        brandData.photo = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      await brandData.save();
      res.status(200).json({
        message: "Brand Updated Successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Error: " + error.message,
      });
    }
  }
);

brandRouter.get("/brand/delete/:id", userAuth, async (req, res) => {
  try {
    const brandId = req.params.id;
    const brandData = await brand
      .findById(brandId)
      .where({ user: req.user._id });
    if (!brandData) {
      throw new Error("Brand not found");
    }
    await brand.findByIdAndDelete(brandId);
    res.status(200).json({
      message: "Brand Deleted Successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error: " + error.message,
    });
  }
});

module.exports = brandRouter;
