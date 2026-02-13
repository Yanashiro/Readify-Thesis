require("dotenv").config("/.env");
const express = require("express");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");
const {
    readifyUser_Collection,
    questionCollection,
    passageCollection,
    testAttemptCollection,
} = require("./config");

const { name } = require("ejs");
const { Collection } = require("mongoose");
// Express
const app = express();

// how tf do i hide this bro the .env isn't working lmao so I just did this to test
const SESSION_SECRET =
    "d23b9726ff05ff2b4736107f2a3b2d27e74ddbf28b2316214d133c5e0df00050";

// Session Middleware
app.use(
    session({
        secret: SESSION_SECRET, // Loaded from .env
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000, // 1 hour
            secure: false, // Set to true if using HTTPS
            httpOnly: true, // Helps prevent XSS
        },
    }),
);

const isAuthenticated = (req, res, next) => {
    // Check if the session has our userId variable
    if (req.session && req.session.userId) {
        return next(); // User is logged in, proceed to the route
    }
    // User is not logged in, redirect to login page
    res.redirect("/login");
};

// Middleware to pass query parameters to all views
app.use((req, res, next) => {
    res.locals.query = req.query; // Make query parameters available in all EJS templates
    next();
});

// For conversion of data into json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Engine Setup
app.set("view engine", "ejs");

// Static Files
app.use(express.static("public"));
// Static files for bundle.js and bundle.css created by Vite/Rollup - new from patrick
app.use(express.static(path.join(__dirname, "../dist")));

// Home Render
app.get("/home", (req, res) => {
    res.render("Home", { query: req.query });
});

// Profile Render
app.get("/Leaderboard", async (req, res) => {
    try {
        // Find ALL users, but exclude sensitive fields
        const users = await readifyUser_Collection
            .find({})
            .select("-password -email -isAdmin");

        // Pass the 'users' array to your EJS template
        res.render("Leaderboard", { allUsers: users });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Login Screen Render
app.get("/", (req, res) => {
    res.render("Login");
});

// Login Screen Render
app.get("/Login", (req, res) => {
    res.render("Login");
});

app.get("/Logout", (req, res) => {
    // 1. Destroy the session in the server's memory
    req.session.destroy((err) => {
        if (err) {
            console.log("Logout error:", err);
            return res.redirect("/Home"); // If it fails, keep them on the dashboard
        }
        // 2. Clear the cookie from the user's browser
        res.clearCookie("connect.sid"); // 'connect.sid' is the default cookie name
        // 3. Send them back to the login page or home
        res.redirect("/Login");
    });
});

// Signup Render
app.get("/signup", (req, res) => {
    res.render("SignUp");
});

// Creat Test Render
app.get("/PassageCreation", (req, res) => {
    res.render("PassageCreation");
});

// MainTest Render - new from patrick
app.get(/^\/maintest(.*)/, (req, res) => {
    res.render("MainTest");
});

// PracticeTest Render - new from patrick
app.get(/^\/practicetest(.*)/, (req, res) => {
    res.render("PracticeTest");
});

// Function for Signing Up Users
app.post("/signup", async (req, res) => {
    // Gets data from Body to send to Database
    const data = {
        name: req.body.username,
        password: req.body.password,
        email: req.body.email,
    };

    // Checks if User already exists in the Database
    const existingUser = await readifyUser_Collection.findOne({
        $or: [{ name: data.name }, { email: data.email }],
    });
    if (existingUser) {
        return res.status(409).send("Username or Email already exists.");
    } else {
        // Password Hash using BCrypt
        const saltRounds = 10; // Number of Salt Rounds for BCrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;
        // Sends the data to the database
        const userdata = new readifyUser_Collection(data);
        await userdata.save();
        // Logging
        console.log(userdata);
        res.render("Login");
    }
});

// Function for Logging Users In
app.post("/Login", async (req, res) => {
    // We'll call the input 'identifier' since it could be Name OR Email
    const { identifier, password } = req.body;

    try {
        // Search for a user where name matches OR email matches
        const user = await readifyUser_Collection.findOne({
            $or: [{ name: identifier }, { email: identifier }],
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Save user details to session
            req.session.userId = user._id;
            req.session.userName = user.name;
            res.redirect("/Home");
        } else {
            res.render("/Login", {
                error: "Invalid credentials. Check your username/email or password.",
            });
        }
    } catch (err) {
        console.error("DEBUG ERROR:", err); // Look at your terminal/command prompt!
        res.status(500).send(err.message);
    }
});

// Create Test Passage
app.post("/createPassage", async (req, res) => {
    try {
        const formData = req.body;

        // Handle Checkbox: If unchecked, it won't exist in req.body.
        // We force it to a Boolean.
        formData.testDesignation = formData.testDesignation === "true";

        // Optional: Parse the 'data' field in each question if you sent it as JSON string
        if (formData.questions) {
            formData.questions = formData.questions.map((q) => {
                try {
                    // If the user entered valid JSON (like {"options": ["A","B"]}), parse it.
                    // Otherwise, keep it as a string.
                    return { ...q, data: JSON.parse(q.data) };
                } catch (e) {
                    return q;
                }
            });
        }

        const newPassage = new passageCollection(formData);
        await newPassage.save();
        res.redirect(`/Home?msg=success&id=${newPassage.testId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving test: " + err.message);
    }
});

// Multiple Choices Route
app.post("/maintestroute/multiplechoices", async (req, res) => {
    try {
        const passage = await passageCollection.findOne({ testType: 1 });
        if (!passage) {
            return res.status(404).json({ error: "No passage found" });
        }
        res.json({
            testTitle: "Multiple Choices",
            title: passage.passageTitle,
            passage: passage.passage,
            description: "Choose the correct letter, A, B, C or D.",
            linkReference: "",
            questions: passage.questions,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Test Data Simulation
const testData = {
    testId: 101,
    testDesignation: true,
    testType: 1,
    passageTitle: "The Renaissance Era",
    passage:
        "The Renaissance was a fervent period of European cultural, artistic, political and economic 'rebirth' following the Middle Ages. It began in the 14th century and spread across Europe, marking the transition from the Middle Ages to Modernity.",
    questions: [
        {
            questionNumber: 1,
            questionText: "What does the word 'Renaissance' mean?",
            correctAnswer: "Rebirth",
        },
        {
            questionNumber: 2,
            questionText: "Which era preceded the Renaissance?",
            correctAnswer: "The Middle Ages",
        },
        {
            questionNumber: 3,
            questionText: "In which century did the Renaissance begin?",
            correctAnswer: "14th Century",
        },
    ],
};

app.get("/testUI", (req, res) => {
    res.render("TestView", { item: testData });
});

app.get("/UserManagement", isAuthenticated, async (req, res) => {
    try {
        const users = await readifyUser_Collection.find();
        res.render("userManagement", { users });
    } catch (err) {
        res.status(500).send("Error fetching users");
    }
});

app.get("/UserManagement/edit/:userId", isAuthenticated, async (req, res) => {
    try {
        // req.params.userId will now be "1"
        const user = await readifyUser_Collection.findOne({
            userId: req.params.userId,
        });

        if (!user) return res.status(404).send("User not found");

        res.render("EditUser", { user });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// Add User Render
app.get("/UserManagement/add", isAuthenticated, (req, res) => {
    res.render("addUser");
});

// Basically same code as signup xd
app.post("/UserManagement/create", isAuthenticated, async (req, res) => {
    // Gets data from Body to send to Database
    const data = {
        name: req.body.username,
        password: req.body.password,
        email: req.body.email,
    };
    // Checks if User already exists in the Database
    const existingUser = await readifyUser_Collection.findOne({
        $or: [{ name: data.name }, { email: data.email }],
    });
    if (existingUser) {
        return res.status(409).send("Username or Email already exists.");
    } else {
        // Password Hash using BCrypt
        const saltRounds = 10; // Number of Salt Rounds for BCrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;
        // Sends the data to the database
        const userdata = new readifyUser_Collection(data);
        await userdata.save();
        // Logging
        console.log(userdata);
        res.redirect("/UserManagement");
    }
});

// Update User
app.post(
    "/UserManagement/update/:userId",
    isAuthenticated,
    async (req, res) => {
        try {
            const { name, email, isAdmin } = req.body;

            const updatedUser = await readifyUser_Collection.findOneAndUpdate(
                { userId: req.params.userId },
                {
                    name: name,
                    email: email,
                    // If isAdmin exists in req.body, it's true; otherwise, it's false
                    isAdmin: isAdmin === "on" ? true : false,
                },
                { new: true, runValidators: true }, // Helpful for debugging
            );

            if (!updatedUser) {
                return res.status(404).send("User not found in database.");
            }

            res.redirect("/UserManagement");
        } catch (err) {
            console.error(err); // LOOK AT YOUR TERMINAL for the real error!
            res.status(500).send("Update failed: " + err.message);
        }
    },
);

// Delete User
app.get("/UserManagement/delete/:userId", async (req, res) => {
    try {
        // Convert the string parameter to a number
        const targetId = Number(req.params.userId);
        const deletedUser = await readifyUser_Collection.findOneAndDelete({
            userId: targetId,
        });
        if (!deletedUser) {
            return res
                .status(404)
                .send("User not found. Check if the ID is correct.");
        }
        res.redirect("/UserManagement");
    } catch (err) {
        console.error("Delete Error:", err); // Error Log
        res.status(500).send("Could not delete user: " + err.message);
    }
});

app.get("/profile", isAuthenticated, async (req, res) => {
    try {
        // Find the user by the ID stored in the session
        const user = await readifyUser_Collection.findById(req.session.userId);
        if (!user) {
            return res.redirect("/login");
        }
        // Render the profile page and pass the user object
        res.render("profile", { user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading profile");
    }
});
const categoryToTestType = {
    "Multiple Choice": 1,
    "Matching Features": 2,
    "Matching Information": 3,
    "Identifying Information": 4,
    "Identifying Writer's Views": 5,
    "Identifying Writers Views": 5,
    "Matching Sentence Endings": 6,
    "Matching Headings": 7,
    "Summary Completion": 8,
    "Short-Answer Questions": 9,
    "Short Answer Questions": 9,
    "Sentence Completion": 10,
    "Diagram Label Completion": 11,
};

function computeBand(score, total) {
    const ratio = score / total;
    if (ratio >= 0.9) return 9;
    if (ratio >= 0.8) return 8;
    if (ratio >= 0.7) return 7;
    if (ratio >= 0.6) return 6;
    if (ratio >= 0.5) return 5;
    if (ratio >= 0.4) return 4;
    if (ratio >= 0.3) return 3;
    if (ratio >= 0.2) return 2;
    return 1;
}

async function scoreSubmission(testCategory, submittedAnswers) {
    const testTypeNum = categoryToTestType[testCategory];
    if (!testTypeNum) return { score: 0, totalQuestions: 0 };

    const passage = await passageCollection.findOne({ testType: testTypeNum });
    if (!passage) return { score: 0, totalQuestions: 0 };

    let score = 0;
    const totalQuestions = passage.questions.length;

    for (const question of passage.questions) {
        const userAnswer = submittedAnswers[question.questionNumber];
        if (userAnswer && userAnswer === question.correctAnswer) {
            score++;
        }
    }

    return { score, totalQuestions };
}

app.post("/maintestroute/examSubmission", async (req, res) => {
    try {
        const { examinee, testType, testCategory, submittedAnswers } = req.body;
        const { score, totalQuestions } = await scoreSubmission(
            testCategory,
            submittedAnswers,
        );

        const attempt = new testAttemptCollection({
            examinee,
            testType: testType || "Main",
            testCategory,
            submittedAnswers,
            score,
            totalQuestions,
        });
        await attempt.save();

        res.json({ score, totalQuestions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Submission failed" });
    }
});

app.post("/practicetestroute/examSubmission", async (req, res) => {
    try {
        const { examinee, testType, testCategory, submittedAnswers } = req.body;
        const { score, totalQuestions } = await scoreSubmission(
            testCategory,
            submittedAnswers,
        );

        const attempt = new testAttemptCollection({
            examinee,
            testType: testType || "Practice",
            testCategory,
            submittedAnswers,
            score,
            totalQuestions,
        });
        await attempt.save();

        res.json({ score, totalQuestions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Submission failed" });
    }
});

app.get("/maintestAttempts", async (req, res) => {
    try {
        const { examinee } = req.query;
        const user = await readifyUser_Collection
            .findOne({ name: examinee })
            .select("-password");
        const history = await testAttemptCollection
            .find({ examinee })
            .sort({ testDate: -1 });

        res.json({
            user: user
                ? {
                      name: user.name,
                      email: user.email,
                      accountType: user.isAdmin ? "Admin" : "Examinee",
                      dateCreated: user._id.getTimestamp(),
                  }
                : null,
            history,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch attempts" });
    }
});

app.post("/maintestselection/retrieveData", async (req, res) => {
    try {
        const { examinee, title } = req.body;
        const attempt = await testAttemptCollection
            .findOne({ examinee, testCategory: title, testType: "Main" })
            .sort({ testDate: -1 });

        if (!attempt) {
            return res.json({
                status: false,
                answers: 0,
                band: 0,
                calculations: { totalCorrectAnswers: 0, totalQuestions: 0 },
            });
        }

        const allMainAttempts = await testAttemptCollection.find({
            examinee,
            testType: "Main",
        });
        let totalCorrect = 0;
        let totalQs = 0;
        for (const a of allMainAttempts) {
            totalCorrect += a.score;
            totalQs += a.totalQuestions;
        }

        res.json({
            status: true,
            answers: attempt.score,
            band: computeBand(attempt.score, attempt.totalQuestions),
            calculations: {
                totalCorrectAnswers: totalCorrect,
                totalQuestions: totalQs,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to retrieve data" });
    }
});

app.get("/maintestselection/status", async (req, res) => {
    try {
        const { examinee } = req.query;
        const attempts = await testAttemptCollection.find({
            examinee,
            testType: "Main",
        });

        let totalCorrect = 0;
        let totalQs = 0;
        for (const a of attempts) {
            totalCorrect += a.score;
            totalQs += a.totalQuestions;
        }

        res.json({
            status: attempts.length > 0,
            answers: totalCorrect,
            band: totalQs > 0 ? computeBand(totalCorrect, totalQs) : 0,
            totalCorrectAnswers: totalCorrect,
            totalQuestions: totalQs,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch status" });
    }
});

app.post("/accountlist", async (req, res) => {
    try {
        const users = await readifyUser_Collection
            .find({ isAdmin: false })
            .select("-password");
        const result = users.map((u) => ({
            id: u.userId,
            name: u.name,
            username: u.name,
            email: u.email,
            accountType: "Examinee",
            dateCreated: u._id.getTimestamp().toLocaleDateString(),
        }));
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch accounts" });
    }
});

app.get("/accountAttempts", async (req, res) => {
    try {
        const { examinee } = req.query;
        const history = await testAttemptCollection
            .find({ examinee })
            .sort({ testDate: -1 });
        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch attempts" });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log("Server running on Port: ${port}");
});
