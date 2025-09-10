const express = require("express");
const Product = require("../models/product");
const { validateProduct } = require("../utils/validation");
const { userAuth } = require("../middlewares/userAuthMiddleware");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });
const productRouter = express.Router();

productRouter.post(
  "/product/create",
  upload.single("photo"),
  userAuth,
  async (req, res) => {
    try {
      const { name, description, price, category, brand } = req.body;
      if (!req.file) {
        throw new Error("Please Add Product Image");
      }
      validateProduct(req);
      const productData = new Product({
        name,
        description,
        price,
        category,
        user: req.user._id,
        brand,
        photo: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      });
      await productData.save();
      res.status(200).json({
        message: "Product Created Successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Error: " + error.message,
      });
    }
  }
);

productRouter.get("/productAll", userAuth, async (req, res) => {
  try {
    const products = await Product.find()
      .where({ user: req.user._id })
      .populate("category", "name")
      .populate("brand", "name");
    let productList = [];
    products.forEach((el) => {
      let productObj = {
        _id: el._id,
        name: el.name,
        description: el.description,
        price: el.price,
        photo: el.photo
          ? `data:${el.photo.contentType};base64,${el.photo.data.toString(
              "base64"
            )}`
          : null,
        categoryId: el.category._id,
        categoryName: el.category.name,
        brandId: el.brand?._id,
        brandName: el.brand?.name,
      };
      productList.push(productObj);
    });
    res.status(200).json({
      data: productList,
      message: "Product List",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error: " + error.message,
    });
  }
});

productRouter.get("/product/getProduct/:id", userAuth, async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = await Product.findById(productId)
      .where({ user: req.user._id })
      .populate("category", "name")
      .populate("brand", "name");
    if (!productData) {
      throw new Error("Product not found");
    }
    const productObj = {
      _id: productData._id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      photo: productData.photo
        ? `data:${
            productData.photo.contentType
          };base64,${productData.photo.data.toString("base64")}`
        : null,
      categoryId: productData.category._id,
      categoryName: productData.category.name,
      brandId: productData.brand?._id,
      brandName: productData.brand?.name,
    };
    res.status(200).json({
      data: productObj,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error: " + error.message,
    });
  }
});

productRouter.patch(
  "/product/update/:id",
  upload.single("photo"),
  userAuth,
  async (req, res) => {
    try {
      const productId = req.params.id;
      const productData = await Product.findById(productId)
        .where({ user: req.user._id })
        .populate("category", "name")
        .populate("brand", "name");
      if (!productData) {
        throw new Error("Product not found");
      }
      const { name, description, price, brand, category } = req.body;
      if (name) productData.name = name;
      if (description) productData.description = description;
      if (category) productData.category = category;
      if (brand) productData.brand = brand;
      if (price) productData.price = price;
      if (req.file) {
        productData.photo = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      await productData.save();
      res.status(200).json({
        message: "Product Updated Successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Error: " + error.message,
      });
    }
  }
);

productRouter.get("/product/delete/:id", userAuth, async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = await Product.findById(productId).where({
      user: req.user._id,
    });
    if (!productData) {
      throw new Error("Product not found");
    }
    await Product.findByIdAndDelete(productId);
    res.status(200).json({
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error: " + error.message,
    });
  }
});

module.exports = productRouter;
