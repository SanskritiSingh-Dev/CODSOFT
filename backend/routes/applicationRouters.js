const express = require("express");
const router = express.Router();

const {applyToJob} = require("../controllers/applicationController");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const {getApplicationsForEmployer} = require("../controllers/applicationController");
//candidate applies to job
router.post("/:jobId", protect, allowRoles("candidate"), applyToJob);

// employer views applications for their jobs
router.get(
  "/employer",
  protect,
  allowRoles("employer"),
  getApplicationsForEmployer
);

module.exports = router;