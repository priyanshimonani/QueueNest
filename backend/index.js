import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoute.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174"
]);

const configuredOrigin = process.env.CLIENT_ORIGIN?.trim().replace(/\/+$/, "");
if (configuredOrigin) {
  allowedOrigins.add(configuredOrigin);
}

app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/+$/, "");
      const isLocalhostVite =
        /^http:\/\/localhost:517\d$/.test(normalizedOrigin) ||
        /^http:\/\/127\.0\.0\.1:517\d$/.test(normalizedOrigin);

      if (allowedOrigins.has(normalizedOrigin) || isLocalhostVite) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Queue Token System backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 8080;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/queue-system";

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected successfully");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
});
