const express = require("express");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow credentials
  })
);

app.use(express.json());

require("./connectDB");

const vendorRoutes = require("./src/routes/vendorRoutes");
const categoryRoutes = require("./src/routes/categoriesRoutes");
const productRoutes = require("./src/routes/productRoutes");

app.use("/api/v1/product", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/vendors", vendorRoutes);

// handle error
app.use((error, req, res, next) => {
  console.log(error);
  const status = error?.status || 500;
  return res.status(status).json({
    success: false,
    message: error?.message || "Internal Server Error",
  });
});

app.listen(5000, () => console.log("Server is running on port 5000"));
