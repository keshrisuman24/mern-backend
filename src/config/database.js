const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://keshrisuman0924:9vnzZ2ImrinaTKZo@namastenode.ovm42.mongodb.net/ecommerce"
  );
};

module.exports = connectDB;
