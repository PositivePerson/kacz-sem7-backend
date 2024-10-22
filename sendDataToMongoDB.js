const mongoose = require("mongoose");
const User = require("./Models/User");

// Connect to MongoDB
mongoose.connect("mongodb+srv://264046:5cNy8qv6Xcz0Zw0L@bsiaw.vkn8n.mongodb.net/?retryWrites=true&w=majority&appName=BSIAW", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});

// Sample user data
const users = [
    {
        username: "Anonym Ouse",
        email: "samihan@example.com",
        password: "password123", // In real apps, hash the password
        profilePicture: "/assets/person/1.jpg",
        coverPicture: "",
        followers: [],
        following: [],
        isAdmin: false,
        description: "Hello, I am Samihan.",
        city: "Chicago",
        relationship: 1
    },
    {
        username: "PersonOne Friend",
        email: "personone@example.com",
        password: "password123",
        profilePicture: "/assets/person/2.png",
        coverPicture: "",
        followers: [],
        following: [],
        isAdmin: false,
        description: "PersonOne bio.",
        city: "New York",
        relationship: 2
    },
    {
        username: "PersonTwo Friend",
        email: "persontwo@example.com",
        password: "password123",
        profilePicture: "/assets/person/3.png",
        coverPicture: "",
        followers: [],
        following: [],
        isAdmin: false,
        description: "PersonTwo bio.",
        city: "San Francisco",
        relationship: 3
    },
    {
        username: "PersonThree Friend",
        email: "personthree@example.com",
        password: "password123",
        profilePicture: "/assets/person/4.png",
        coverPicture: "",
        followers: [],
        following: [],
        isAdmin: false,
        description: "PersonThree bio.",
        city: "Los Angeles",
        relationship: 1
    },
    {
        username: "PersonFour Friend",
        email: "personfour@example.com",
        password: "password123",
        profilePicture: "/assets/person/5.png",
        coverPicture: "",
        followers: [],
        following: [],
        isAdmin: false,
        description: "PersonFour bio.",
        city: "Seattle",
        relationship: 2
    },
    {
        username: "PersonFive Friend",
        email: "personfive@example.com",
        password: "password123",
        profilePicture: "/assets/person/6.png",
        coverPicture: "",
        followers: [],
        following: [],
        isAdmin: false,
        description: "PersonFive bio.",
        city: "Houston",
        relationship: 3
    },
    {
        username: "PersonSix Friend",
        email: "personsix@example.com",
        password: "password123",
        profilePicture: "/assets/person/7.jpg",
        coverPicture: "",
        followers: [],
        following: [],
        isAdmin: false,
        description: "PersonSix bio.",
        city: "Austin",
        relationship: 1
    },
    {
        username: "PersonSeven Friend",
        email: "personseven@example.com",
        password: "password123",
        profilePicture: "/assets/person/8.png",
        coverPicture: "",
        followers: [],
        following: [],
        isAdmin: false,
        description: "PersonSeven bio.",
        city: "Miami",
        relationship: 2
    },
    {
        username: "PersonEight Friend",
        email: "personeight@example.com",
        password: "password123",
        profilePicture: "/assets/person/9.png",
        coverPicture: "",
        followers: [],
        following: [],
        isAdmin: false,
        description: "PersonEight bio.",
        city: "Boston",
        relationship: 3
    },
    {
        username: "PersonNine Friend",
        email: "personnine@example.com",
        password: "password123",
        profilePicture: "/assets/person/10.png",
        coverPicture: "",
        followers: [],
        following: [],
        isAdmin: false,
        description: "PersonNine bio.",
        city: "Dallas",
        relationship: 1
    }
];

// Insert the user data into MongoDB
User.insertMany(users)
    .then(() => {
        console.log("Users inserted successfully");
        mongoose.connection.close();  // Close the connection after insertion
    })
    .catch((err) => {
        console.error("Error inserting users", err);
    });
