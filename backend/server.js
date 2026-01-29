const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');

require("dotenv").config();

const app = express();

//to take the json data from frontend
app.use(express.json());

app.use('/api/auth', authRoutes);

// Enable CORS for all routes
app.use(cors());

//connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() =>{
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error: ", error);
    });

//test route
app.get("/",(req, res) =>{
    res.send("Job Portal Backend is running");
});

// Sample route
app.get("/", (req, res) => {
    res.send("Welcome to the Job Portal Backend!");
});

// Test User Model
async function testUserModel() {
    const user = new User({
        name: "Test user",
        email: "testuser@gmail.com",
        password: "password123",
        role: "candidate"
    });

    await user.save();
    console.log("Test user saved:");
}

const PORT = 5000;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});
