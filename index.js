const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const cors = require("cors");
const https = require('https');
const fs = require("fs");
const path = require("path");
const accessLogStream = fs.createWriteStream(path.join(__dirname, "logs/access.log"), { flags: "a" });

const rateLimit = require("express-rate-limit");
const { authLimiter, generalLimiter } = require("./middleware/rateLimiters");

dotenv.config();

// CORS configuration
const corsOptions = {
    origin: 'https://localhost:3000', // Allow only this origin
    credentials: true, // Enable cookies
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions)); // Use CORS with options

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
    console.log("Connected to MongoDB");
});

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream })); // Save logs in 'combined' format to the file

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Defining Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

// GET Queries
app.get("/", (req, res) => {
    res.send("Hello, Welcome to Homepage!");
});

// HTTPS options
const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt')
};

// Create HTTPS server
https.createServer(options, app).listen(8800, () => {
    console.log('HTTPS Server running on port 8800');
});

// Fallback to HTTP server for development purposes
// app.listen(3000, () => {
//     console.log("HTTP Server is running on port 3000");
// });