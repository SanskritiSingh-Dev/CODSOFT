const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Job = require("./models/Job");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const EMPLOYER_ID = "69875330182192842c2eca4d"; 
// ⚠️ use a real employer user _id from MongoDB

const jobs = [
  {
    title: "Frontend Developer",
    description: "Build responsive UI using React",
    company: "TechNova",
    location: "Bangalore",
    jobType: "full-time",
    postedBy: EMPLOYER_ID,
  },
  {
    title: "Backend Developer",
    description: "Node.js and MongoDB backend development",
    company: "CodeCraft",
    location: "Hyderabad",
    jobType: "full-time",
    postedBy: EMPLOYER_ID,
  },
  {
    title: "Full Stack Developer",
    description: "React + Node full stack development",
    company: "DevSphere",
    location: "Mumbai",
    jobType: "contract",
    postedBy: EMPLOYER_ID,
  },
  {
    title: "UI/UX Designer",
    description: "Design modern and clean interfaces",
    company: "PixelWorks",
    location: "Pune",
    jobType: "contract",
    postedBy: EMPLOYER_ID,
  },
  {
    title: "Software Engineer Intern",
    description: "Assist senior developers",
    company: "StartupHub",
    location: "Chennai",
    jobType: "internship",
    postedBy: EMPLOYER_ID,
  },
  {
    title: "QA Engineer",
    description: "Manual and automation testing",
    company: "TestPro",
    location: "Bangalore",
    jobType: "full-time",
    postedBy: EMPLOYER_ID,
  },
  {
    title: "Mobile App Developer",
    description: "Build apps using React Native",
    company: "Appify",
    location: "Delhi",
    jobType: "full-time",
    postedBy: EMPLOYER_ID,
  },
  {
    title: "DevOps Engineer",
    description: "CI/CD pipelines and cloud infra",
    company: "CloudOps",
    location: "Hyderabad",
    jobType: "contract",
    postedBy: EMPLOYER_ID,
  },
  {
    title: "Product Manager",
    description: "Manage product lifecycle",
    company: "VisionTech",
    location: "Mumbai",
    jobType: "full-time",
    postedBy: EMPLOYER_ID,
  },
  {
    title: "Data Analyst",
    description: "Analyze data and create reports",
    company: "DataMinds",
    location: "Pune",
    jobType: "part-time",
    postedBy: EMPLOYER_ID,
  },
];

async function seedJobs() {
  try {
    await Job.deleteMany();
    await Job.insertMany(jobs);
    console.log("✅ 10 jobs inserted successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedJobs();
