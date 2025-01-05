const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName) {
    throw new Error("Please Enter First Name");
  }
  if (!lastName) {
    throw new Error("Please Enter Last Name");
  }
  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First Name must be between 4-50 characters");
  }
  if (!emailId) {
    throw new Error("Please Enter Email Id");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Please Enter Valid Email Id");
  }
  if (!password) {
    throw new Error("Please Enter Password");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter Strong Password");
  }
};

const validateLoginData = (req) => {
  const { emailId, password } = req.body;
  if (!emailId) {
    throw new Error("Please Enter Email Id");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Please Enter Valid Email Id");
  }
  if (!password) {
    throw new Error("Please Enter Password");
  }
};

const validateResetPasswordData = (req) => {
  const { lastPassword, newPassword } = req.body;
  if (!lastPassword) {
    throw new Error("Please Enter Last Password");
  }
  if (!newPassword) {
    throw new Error("Please Enter New Password");
  }
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Please Enter Strong New Password");
  }
};

const validateCategory = (res) => {
  const { name, description } = res.body;
  if (!name) {
    throw new Error("Please Enter Category Name");
  }
  if (name.length < 3 || name.length > 50) {
    throw new Error("Category Name must be between 3-50 characters");
  }
  if (!description) {
    throw new Error("Please Enter Category Description");
  }
  if (description.length < 10 || description.length > 200) {
    throw new Error("Category Description must be between 10-200 characters");
  }
};

const validateBrand = (res) => {
  const { name, description, categoryId } = res.body;
  if (!name) {
    throw new Error("Please Enter Brand Name");
  }
  if (name.length < 3 || name.length > 50) {
    throw new Error("Brand Name must be between 3-50 characters");
  }
  if (!description) {
    throw new Error("Please Enter Brand Description");
  }
  if (description.length < 10 || description.length > 200) {
    throw new Error("Brand Description must be between 10-200 characters");
  }
  if (!categoryId) {
    throw new Error("Please Select Category");
  }
};

const validateProduct = (res) => {
  const { name, description, category, price } = res.body;
  if (!name) {
    throw new Error("Please Enter Brand Name");
  }
  if (name.length < 3 || name.length > 50) {
    throw new Error("Brand Name must be between 3-50 characters");
  }
  if (!description) {
    throw new Error("Please Enter Brand Description");
  }
  if (description.length < 10 || description.length > 200) {
    throw new Error("Brand Description must be between 10-200 characters");
  }
  if (!price) {
    throw new Error("Please Enter Price");
  }
  if (price < 1) {
    throw new Error("Price must be greater than 1");
  }
  if (!category) {
    throw new Error("Please Select Category");
  }
};

module.exports = {
  validateSignUpData,
  validateLoginData,
  validateResetPasswordData,
  validateCategory,
  validateBrand,
  validateProduct,
};
