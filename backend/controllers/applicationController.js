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


module.exports = {
    applyToJob,
    getApplicationsForEmployer,
};      
