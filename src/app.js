const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./route/auth");
const categoryRouter = require("./route/categories");
const brandRouter = require("./route/brands");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", categoryRouter);
app.use("/", brandRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on Port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
