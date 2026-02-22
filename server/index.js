require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/weather",require("./routes/weatherRoutes"));
app.use("/api/trips",require("./routes/tripRoutes"));
app.use("/api/favorites",require("./routes/favoriteRoutes"));
app.use("/api/analytics",require("./routes/analyticsRoutes"));

// API welcome endpoint
app.get("/api", (req, res) => {
  res.json({ 
    message: "Weather Travel API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth (register, login)",
      weather: "/api/weather/:city (get weather data)",
      trips: "/api/trips (CRUD operations)",
      favorites: "/api/favorites (manage favorites)",
      analytics: "/api/analytics (recommendations, packing, forecasts)"
    },
    health: "/health"
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));