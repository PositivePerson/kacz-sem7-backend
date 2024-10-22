const router = require("express").Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import JWT

// Endpoint to verify the auth API is working
router.get("/", (req, res) => {
    res.send("This is the auth API");
});

// Register a new user
router.post("/register", async (req, res) => {
    try {
        // Check if user already exists
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) return res.status(400).json("Email already in use");

        // Generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPass,
            profilePicture: req.body.profilePicture,
        });

        // Save the new user
        const savedUser = await newUser.save();

        // Don't return password in the response
        const { password, ...userWithoutPassword } = savedUser._doc;
        res.status(201).json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login a user
router.post("/login", async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.error("User not found for email:", req.body.email);
            return res.status(404).json("User not found");
        }

        // Check if password matches
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            console.error("Invalid password for user:", user.username);
            return res.status(400).json("Invalid password");
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send user info and token
        const { password, ...userWithoutPassword } = user._doc;
        res.status(200).json({ token, ...userWithoutPassword });
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).json("Internal server error");
    }
});

module.exports = router;
