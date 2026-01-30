const Job = require("../models/Job");

// Create a new job posting
async function createJob(req, res) {
  try {
    const { title, company, location, jobType, description, salary } = req.body;

    if (!title || !company || !location || !jobType || !description) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const job = new Job({
      title,
      company,
      location,
      jobType,
      description,
      salary,
      postedBy: req.user.id, //from JWT
    });

    await job.save();

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating job", error: error.message });
  }
}

// Get all job postings
async function getAllJobs(req, res) {
  try {
    const { search, location,jobType, page = 1, limit = 5 } = req.query;
    const query = {};

    // Search by title or company
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Filter by jobType
    if (jobType) {
      query.jobType = jobType;
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate("postedBy", "name email")
      .skip(skip)
      .limit(limit * 1)
      .sort({ createdAt: -1 });

    const totalJobs = await Job.countDocuments(query);

    res.json({
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: Number(page),
      jobs,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error"});
  }
}

//get the job details by id
async function getJobById(req, res) {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate(
      "postedBy",
      "name email"
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Invalid job ID" });
  }
}

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
};
