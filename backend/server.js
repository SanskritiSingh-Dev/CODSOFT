const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const { protect, allowRoles } = require("./middleware/authMiddleware");
const applicationRoutes = require("./routes/applicationRouters");

require("dotenv").config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Job Portal Backend is running");
});

// protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You have accessed a protected route",
    user: req.user,
  });
});

// employer-only route
app.get(
  "/api/employer-only",
  protect,
  allowRoles("employer"),
  (req, res) => {
    res.json({ message: "Welcome Employer!" });
  }
);

// database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("MongoDB connection error:", error));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
