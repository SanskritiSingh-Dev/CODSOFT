const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
async function registerUser(req, res) {
    try {
        const { name, email, password, role } = req.body;

        //basic validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ 
            message: "User registered successfully" 
        });
    } catch (error) {
        console.error("Error registering user: ", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Login function to be implemented
async function loginUser(req, res) {
    // Login logic to be implemented
    try{
        const {email, password} = req.body;
        // Validate input
        if(!email || !password){
            return res.status(400).json({message: "Please provide email and password"});
        }

        // Check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        // Create token
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    registerUser, loginUser
};