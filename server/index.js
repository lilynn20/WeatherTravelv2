require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/weather",require("./routes/weatherRoutes"));
app.use("/api/trips",require("./routes/tripRoutes"));
app.use("/api/favorites",require("./routes/favoriteRoutes"));
app.use("/api/analytics",require("./routes/analyticsRoutes"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));