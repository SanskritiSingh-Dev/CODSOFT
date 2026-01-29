const express = require('express');
const cors = require('cors');

const app = express();

//to take the json data from frontend
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Sample route
app.get("/", (req, res) => {
    res.send("Welcome to the Job Portal Backend!");
});

const PORT = 5000;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});
