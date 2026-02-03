const Application = require("../models/Application");
const Job = require("../models/Job");

async function applyToJob(req, res) {
    try {
        const { jobId, coverLetter } = req.body;
        const candidateId = req.user._id;
        
        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        //prevent duplicate applications
        const existingApplication = await Application.findOne({ job: jobId, candidate: candidateId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied to this job" });
        }

        const application = new Application({
            job: jobId,
            candidate: candidateId,
            coverLetter,
        });

        await application.save();

        res.status(201).json({ message: "Application submitted successfully", application });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getApplicationsForEmployer(req, res) {
  try {
    const employerId = req.user.id;

    // find jobs posted by this employer
    const jobs = await Job.find({ postedBy: employerId }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    // find applications for those jobs
    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("job", "title company location")
      .populate("candidate", "name email");

    res.json({
      totalApplications: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function updateApplicationStatus(req, res) {
  try {
    const employerId = req.user.id;
    const applicationId = req.params.applicationId;
    const { status } = req.body;

    // allowed statuses
    const allowedStatuses = ["reviewed", "accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // find application
    const application = await Application.findById(applicationId).populate(
      "job"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // check ownership: employer must own the job
    if (application.job.postedBy.toString() !== employerId) {
      return res.status(403).json({ message: "Access denied" });
    }

    application.status = status;
    await application.save();

    res.json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getApplicationsForCandidate(req, res) {
  try {
    const candidateId = req.user.id;

    const applications = await Application.find({
      candidate: candidateId,
    })
      .populate("job", "title company location jobType")
      .populate("job.postedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      totalApplications: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
    applyToJob,
    getApplicationsForEmployer,
    updateApplicationStatus,
    getApplicationsForCandidate
};      
