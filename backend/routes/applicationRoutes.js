const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const { protect, allowRoles } = require("../middleware/authMiddleware");

// Apply for a job
router.post(
  "/",
  protect,
  allowRoles("candidate"),
  async (req, res) => {
    try {
      const { jobId } = req.body;

      const application = await Application.create({
        job: jobId,
        applicant: req.user._id,
      });

      res.status(201).json({
        message: "Job applied successfully",
        application,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          message: "You have already applied for this job",
        });
      }

      res.status(500).json({ message: "Failed to apply for job" });
    }
  }
);

module.exports = router;
