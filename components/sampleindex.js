require("dotenv").config("/.env");
const express = require("express");
const session = require('express-session');
const multer = require('multer');
const path = require("path");
const bcrypt = require("bcrypt");
const {
    readifyUser_Collection,
    questionCollection,
    passageCollection,
} = require("./config");

const { name } = require("ejs");
const { Collection } = require("mongoose");
// Express
const app = express();
app.use(express.static('public'))

// how tf do i hide this bro the .env isn't working lmao so I just did this to test
const SESSION_SECRET = "d23b9726ff05ff2b4736107f2a3b2d27e74ddbf28b2316214d133c5e0df00050";

// Session Middleware
app.use(session({
    secret: SESSION_SECRET, // Loaded from .env
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 3600000, // 1 hour
        secure: false,    // Set to true if using HTTPS
        httpOnly: true,  // Helps prevent XSS
        sameSite: 'lax'
    }
}));

const isAuthenticated = (req, res, next) => {
    // Check if the session has our userId variable
    if (req.session && req.session.userId) {
        return next(); // User is logged in, proceed to the route
    }
    // User is not logged in, redirect to login page
    res.redirect('/login');
};

// Upload Middleware for Passage Creation 
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

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
app.get("/Home", isAuthenticated, (req, res) => {
    res.render('Home', { query: req.query });;
});

// Login Screen Render
app.get("/", (req, res) => {
    res.render("Login");
});

// Login Screen Render
app.get("/Login", (req, res) => {
    res.render("Login");
});

app.get('/Logout', (req, res) => {
    // 1. Destroy the session in the server's memory
    req.session.destroy((err) => {
        if (err) {
            console.log("Logout error:", err);
            return res.redirect('/Home'); // If it fails, keep them on the dashboard
        }
        // 2. Clear the cookie from the user's browser
        res.clearCookie('connect.sid'); // 'connect.sid' is the default cookie name
        // 3. Send them back to the login page or home
        res.redirect('/Login');
    });
});

// Signup Render
app.get("/signup", (req, res) => {
    res.render("SignUp");
});

// Creat Test Render
app.get("/PassageCreation", isAuthenticated, (req, res) => {
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
    $or: [
        { name: data.name },
        { email: data.email }
    ]
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
            $or: [
                { name: identifier },
                { email: identifier }
            ]
        });

        if (user && await bcrypt.compare(password, user.password)) {
            // Save user details to session
            req.session.userId = user._id;
            req.session.userName = user.name;
            req.session.isAdmin = user.isAdmin; // This is what the frontend needs for determining if the user is an admin or an examinee/student, depends on what you want to put 
            // it can also be like this: req.session.role = user.usAdmin ? "admin" : "examinee*;
            res.json({ // This is what the frontend needs, express can only send 1 response, so we have to be careful
                success: true,
                message: "Login successful",
                isAdmin: user.isAdmin,
                name: user.name})
            /*
            res.redirect('/Home');
            */
        } else {
            res.render('Login', { error: 'Invalid credentials. Check your username/email or password.' });
        }
    } catch (err) {
        console.error("DEBUG ERROR:", err); // Look at your terminal/command prompt!
        res.status(500).send(err.message);
    }
});

// testing feature - patrick
app.get("/auth/me", (req, res) => { // This can be used when the frontend is looking for the role of the account as well as handling user account details 
    console.log("SESSION:", req.session)
    if (!req.session.userId) {
    return res.json({ loggedIn: false });
  }

  res.json({
    loggedIn: true,
    name: req.session.userName,
    isAdmin: req.session.isAdmin
  });
});


app.get("/create-passage", isAuthenticated, (req, res) => {
    res.render("PassageCreation");
});

// Create Test Passage
app.post('/create-passage', upload.single('passageImage'), async (req, res) => {
    try {
        const { testDesignation, testType, passageTitle, passage, questions } = req.body;
        
        // Get image path if a file was uploaded
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const formattedQuestions = Object.values(questions).map(q => ({
            questionNumber: parseInt(q.number),
            questionText: q.text,
            correctAnswer: q.answer,
            data: q.data ? q.data.split(',').map(item => item.trim()) : null
        }));

        const newPassage = new passageCollection({
            testDesignation: testDesignation === 'true',
            testType: parseInt(testType),
            passageTitle,
            passage,
            passageImage: imagePath, // Save the path to DB
            questions: formattedQuestions
        });

        await newPassage.save();
        res.redirect('/test-selection');
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

// Multiple Choices Route
app.post("/maintestroute/multiplechoices", isAuthenticated, async (req, res) => {
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

// Exam Test - Prototype for rendering the exam page with dynamic data based on query parameters
app.get('/take-exam', async (req, res) => {
    try {
        const isMainTest = req.query.designation !== 'false';
        const selectedType = parseInt(req.query.type) || 1;

        // Find the specific test
        const testData = await passageCollection.findOne({ 
            testDesignation: isMainTest,
            testType: selectedType 
        });

        if (!testData) return res.send("No test found for this selection.");

        const typeLabels = {
            1: "Multiple Choices", 2: "Matching Features", 3: "Matching Information",
            4: "Identifying Information", 5: "Identifying Writers Views", 6: "Matching Sentence Endings",
            7: "Matching Headings", 8: "Summary Completion", 9: "Short Answer Questions",
            10: "Sentence Completion", 11: "Diagram Label Completion"
        };

        res.render('ExamMode', { 
            test: testData, 
            typeLabel: typeLabels[selectedType] 
        });
    } catch (err) {
        res.status(500).send("Error entering exam mode.");
    }
});


// Exam Results Route - Processes the submitted answers and calculates the score
app.post('/submit-results', async (req, res) => {
    try {
        const { passageId, userAnswers } = req.body;
        const test = await passageCollection.findOne({ passageId: passageId });
        if (!test) return res.status(404).send("Test not found.");
        let score = 0;
        const results = test.questions.map((q, index) => {
            const rawAnswer = (userAnswers && userAnswers[index]) ? userAnswers[index] : "";
            const userAns = Array.isArray(rawAnswer) ? rawAnswer[0].trim() : rawAnswer.trim();
            const correctAns = q.correctAnswer.toString().trim();
            const isCorrect = userAns.toLowerCase() === correctAns.toLowerCase();
            if (isCorrect) score++;
            return {
                questionNumber: q.questionNumber,
                userAns,
                correctAns,
                isCorrect
            };
        });

        // SAVE TO USER HISTORY
        if (req.session.userId) {
            await readifyUser_Collection.findOneAndUpdate(
                { userId: req.session.userId }, 
                { 
                    $push: { 
                        testHistory: {
                            passageId: test.passageId,
                            passageTitle: test.passageTitle,
                            score: score,
                            totalQuestions: test.questions.length,
                            takenAt: new Date()
                        } 
                    } 
                }
            );
        }
        res.render('Results', { score, total: test.questions.length, results, passageTitle: test.passageTitle });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error processing results.");
    }
});

// Step 1: Show the Selection Page
app.get('/exam-launcher', (req, res) => {
    const typeLabels = {
        1: "Multiple Choices", 2: "Matching Features", 3: "Matching Information",
        4: "Identifying Information", 5: "Identifying Writers Views", 6: "Matching Sentence Endings",
        7: "Matching Headings", 8: "Summary Completion", 9: "Short Answer Questions",
        10: "Sentence Completion", 11: "Diagram Label Completion"
    };
    res.render('Launcher', { typeLabels });
});

// Step 2: Process selection and find Random Test
app.get('/start-random-exam', async (req, res) => {
    try {
        const isMain = req.query.designation === 'true';
        const type = parseInt(req.query.type);
        const randomTest = await passageCollection.aggregate([
            { $match: { testDesignation: isMain, testType: type } },
            { $sample: { size: 1 } }
        ]);
        if (randomTest.length === 0) {
            return res.send("No tests found for this criteria. <a href='/exam-launcher'>Go Back</a>");
        }
        // Redirect to the Exam Mode with the specific ID found
        res.redirect(`/take-exam/${randomTest[0].passageId}`);
    } catch (err) {
        res.status(500).send("Error selecting test.");
    }
});

// Grabs the specific exams that fits the parameters and samples one 
app.get('/take-exam/:id', async (req, res) => {
    try {
        const test = await passageCollection.findOne({ passageId: req.params.id });

        if (!test) {
            return res.status(404).send("Test not found.");
        }

        // We need to redefine this here so EJS can find the label for the number
        const typeLabels = {
            1: "Multiple Choices", 2: "Matching Features", 3: "Matching Information",
            4: "Identifying Information", 5: "Identifying Writers Views", 6: "Matching Sentence Endings",
            7: "Matching Headings", 8: "Summary Completion", 9: "Short Answer Questions",
            10: "Sentence Completion", 11: "Diagram Label Completion"
        };

        // Send BOTH the test data and the specific label to the view
        res.render('ExamMode', { 
            test: test, 
            typeLabel: typeLabels[test.testType] // This fixes the ReferenceError
        });

        // Frontend needs JSON response
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading exam.");
    }
});

// Passage Selection Filter Test
app.get('/test-selection', async (req, res) => {
    try {
        // Get Designation (default to true/Main if not specified)
        // NOTE: Query Parameters come as strings, so we compare to 'true'
        const isMainTest = req.query.designation !== 'false'; 

        // Get Test Type (default to 1)
        const selectedType = parseInt(req.query.type) || 1;

        // Queries the collection using BOTH filters
        const TestSelection = await passageCollection.find({ 
            testDesignation: isMainTest,
            testType: selectedType 
        });

        const typeLabels = {
            1: "Multiple Choices", 2: "Matching Features", 3: "Matching Information",
            4: "Identifying Information", 5: "Identifying Writers Views", 6: "Matching Sentence Endings",
            7: "Matching Headings", 8: "Summary Completion", 9: "Short Answer Questions",
            10: "Sentence Completion", 11: "Diagram Label Completion"
        };

        res.render('TestSelection', { 
            TestSelection, 
            selectedType, 
            isMainTest,
            typeLabels 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading filtered tests");
    }
});

// User Management Part of the System
app.get("/UserManagement", isAuthenticated, async (req, res) => {
    try {
        const users = await readifyUser_Collection.find();
        /*
        res.render('userManagement', { users });
        */
        // Frontend is looking for JSON response to be absorbed by axios,get("/UserManagement")
        res.json(users);
    } catch (err) {
        res.status(500).send("Error fetching users");
    }
});

app.get('/UserManagement/edit/:userId', isAuthenticated, async (req, res) => {
    try {
        // req.params.userId will now be "1"
        const user = await readifyUser_Collection.findOne({ userId: req.params.userId });
        
        if (!user) return res.status(404).send("User not found");
        
        res.render('EditUser', { user }); 
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// Add User Render
app.get('/UserManagement/add', isAuthenticated, (req, res) => {
    res.render('addUser');
});

// Basically same code as signup xd
app.post('/UserManagement/create',isAuthenticated, async (req, res) => {
    // Gets data from Body to send to Database
    const data = {
        name: req.body.username,
        password: req.body.password,
        email: req.body.email,
    };
    // Checks if User already exists in the Database
    const existingUser = await readifyUser_Collection.findOne({
    $or: [
        { name: data.name },
        { email: data.email }
    ]
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
        res.redirect('/UserManagement');
    }
});

// Update User 
app.post('/UserManagement/update/:userId', isAuthenticated, async (req, res) => {
    try {
        const { name, email, isAdmin } = req.body;

        const updatedUser = await readifyUser_Collection.findOneAndUpdate(
            { userId: req.params.userId }, 
            { 
                name: name,
                email: email,
                // If isAdmin exists in req.body, it's true; otherwise, it's false
                isAdmin: isAdmin === 'on' ? true : false 
            },
            { new: true, runValidators: true } // Helpful for debugging
        );

        if (!updatedUser) {
            return res.status(404).send("User not found in database.");
        }

        res.redirect('/UserManagement');
    } catch (err) {
        console.error(err); // LOOK AT YOUR TERMINAL for the real error!
        res.status(500).send("Update failed: " + err.message);
    }
});

// Delete User
app.get('/UserManagement/delete/:userId', isAuthenticated, async (req, res) => {
   try {
        // Convert the string parameter to a number
        const targetId = Number(req.params.userId);
        const deletedUser = await readifyUser_Collection.findOneAndDelete({ userId: targetId });
        if (!deletedUser) {
            return res.status(404).send("User not found. Check if the ID is correct.");
        }
        res.redirect('/UserManagement');
    } catch (err) {
        console.error("Delete Error:", err); // Error Log 
        res.status(500).send("Could not delete user: " + err.message);
    }
});

// Profile Display
app.get('/profile', isAuthenticated, async (req, res) => {
    try {
        // Find the user by the ID stored in the session
        const user = await readifyUser_Collection.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }
        if (user.testHistory) {
            user.testHistory.sort((a, b) => b.takenAt - a.takenAt);
        }
        // Render the profile page and pass the user object
        /*
        res.render('profile', { user });
        */
        // frontend needs json response
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading profile");
    }
});
// Port for Express
const port = 5000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});