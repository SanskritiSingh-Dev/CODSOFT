const express = require('express');
const router = express.Router();

const { createJob, getAllJobs } = require('../controllers/jobController');
const { protect, allowRoles } = require('../middleware/authMiddleware');
const { getJobById } = require('../controllers/jobController');

// Route to create a new job posting (employer only)
router.post('/', protect, allowRoles('employer'), createJob);

// Route to get all job postings
router.get('/', protect, getAllJobs);

//route to get job by id
router.get('/:id', protect, getJobById);

module.exports = router;