import { useEffect, useState } from "react";
import api from "../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);   // MUST be array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const response = await api.get("/jobs");

      // 🔑 IMPORTANT FIX
      // If backend sends { jobs: [...] }
      if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else if (Array.isArray(response.data.jobs)) {
        setJobs(response.data.jobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <h3>Loading jobs...</h3>;
  }

  return (
    <div>
      <h2>Jobs Page</h2>

      {jobs.length === 0 ? (
        <p>No jobs available</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id} style={{ marginBottom: "15px" }}>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p><b>Company:</b> {job.company}</p>
              <p><b>Location:</b> {job.location}</p>
              <p><b>Type:</b> {job.jobType}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Jobs;


