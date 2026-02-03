const express = require("express");
const router = express.Router();

const {applyToJob} = require("../controllers/applicationController");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const {getApplicationsForEmployer} = require("../controllers/applicationController");
const {updateApplicationStatus} = require("../controllers/applicationController");
const {getApplicationsForCandidate} = require("../controllers/applicationController");
//candidate applies to job
router.post("/:jobId", protect, allowRoles("candidate"), applyToJob);

// employer views applications for their jobs
router.get(
  "/employer",
  protect,
  allowRoles("employer"),
  getApplicationsForEmployer
);

// employer updates application status
router.patch(
  "/:applicationId/status",
  protect,
  allowRoles("employer"),
  updateApplicationStatus
);

// candidate views their applications
router.get(
  "/candidate",
  protect,
  allowRoles("candidate"),
  getApplicationsForCandidate
);

module.exports = router;