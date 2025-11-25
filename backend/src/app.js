const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const rateLimiter = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const startupRoutes = require("./routes/startup.routes");
const chatRoutes = require("./routes/chat.routes");
const adminRoutes = require("./routes/admin.routes");
const orderRoutes = require("./routes/order.routes");
const deliveryRoutes = require("./routes/delivery.routes");
const s3Routes = require("./routes/s3.routes");
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/cart.routes");
const categoryRoutes = require("./routes/category.routes");
const addressRoutes = require("./routes/address.routes");
const paymentRoutes = require("./routes/payment.routes");
const startupInventoryRoutes = require("./routes/startup.inventory.routes");
const startupProductRoutes = require("./routes/startup.products.routes");

const app = express();

// ---------------------------------------------
// Global Middlewares
// ---------------------------------------------
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------------------------------------------
// CORS → Allow only frontend domain
// ---------------------------------------------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// Global Rate Limiter
app.use(rateLimiter.globalLimiter);

// ---------------------------------------------
// Healthcheck
// ---------------------------------------------
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV || "development",
    timestamp: new Date(),
  });
});

// ---------------------------------------------
// API Routes
// ---------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/profile", require("./routes/profile.routes"));
app.use("/api/products", productRoutes);
app.use("/api/startup", startupRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/s3", s3Routes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", paymentRoutes); // ⬅ NEW PAYMENT ROUTE
app.use("/api/startup/inventory", startupInventoryRoutes);
app.use("/api/startup/products", startupProductRoutes);

// ---------------------------------------------
// Global Error Handler
// ---------------------------------------------
app.use(errorHandler);

module.exports = app;
