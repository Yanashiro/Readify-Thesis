const express = require('express');
const pasth = require('path');
const bcrypt = require('bcrypt');
const readifyUser_Collection = require("./config");
const questionCollection = require("./config");
const passageCollection = require("./config");

const { name } = require('ejs');
const { Collection } = require('mongoose');

// Express
const app = express()

// For conversion of data into json
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// View Engine Setup
app.set('view engine', 'ejs')

// Static Files
app.use(express.static("public"))
// Static files for bundle.js and bundle.css created by Vite/Rollup - new from patrick
app.use(express.static(path.join(__dirname, '../dist')));

// Home Render
app.get('/home', (req, res) =>{
    res.render("home");
})

// Profile Render
app.get('/Leaderboard', async (req,res)=>{
    try {
        // Find ALL users, but exclude sensitive fields
        const users = await readifyUser_Collection.find({}).select('-password -email -isAdmin');

        // Pass the 'users' array to your EJS template
        res.render('Leaderboard', { allUsers: users });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
})

// Login Screen Render
app.get("/", (req , res) =>{
    res.render("Login");
})

// Signup Render
app.get('/signup', (req, res) =>{
    res.render("SignUp");
})

// Creat Test Render
app.get('/PassageCreation', (req, res) =>{
    res.render("PassageCreation");
})

// MainTest Render - new from patrick
app.get(/^\/maintest(.*)/, (req, res) =>{
    res.render("MainTest")
})

// Function for Signing Up Users
app.post("/signup", async (req, res) => {
    // Gets data from Body to send to Database
    const data = {
        name: req.body.username,
        password: req.body.password,
        email: req.body.email   
    }

    // Checks if User already exists in the Database
    const existingUser = await readifyUser_Collection.findOne({name: data.name});
    if(existingUser){
        res.send("Username already exists. Please choose a different username.");
    } 
    else{
        // Password Hash using BCrypt
        const saltRounds = 10; // Number of Salt Rounds for BCrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;
        // Sends the data to the database
        const userdata = await readifyUser_Collection.insertMany(data);
        // Logging
        console.log(userdata);
    } 
    res.render("Login");
})
 
// Function for Logging Users In
app.post('/login', async (req, res) =>{
    try{
        const check = await readifyUser_Collection.findOne({name: req.body.username});
        if(!check){
            res.send("Username or Password Incorrect.");
        }

        // Compare Hash Password to Database
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch){
            res.render("Home");
        }
        else{
            req.send("Username or Password Incorrect")
        }
    }   
    catch{
        console.log(data);
        res.send("Wrong Details");
    } 
})

// Create Test Passage
app.post('/createPassage', async (req, res) => {
    try {

        const formData = req.body;

        // Handle Checkbox: If unchecked, it won't exist in req.body. 
        // We force it to a Boolean.
        formData.testDesignation = formData.testDesignation === 'true';

        // Optional: Parse the 'data' field in each question if you sent it as JSON string
        if (formData.questions) {
            formData.questions = formData.questions.map(q => {
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

        res.send("Test created successfully! ID: " + newPassage.testId);
        res.render("Home");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving test: " + err.message);
    }
});

// Test Data Simulation
const testData = {
    testId: 101,
    testDesignation: true,
    testType: 1,
    passageTitle: "The Renaissance Era",
    passage: "The Renaissance was a fervent period of European cultural, artistic, political and economic 'rebirth' following the Middle Ages. It began in the 14th century and spread across Europe, marking the transition from the Middle Ages to Modernity.",
    questions: [
        { questionNumber: 1, questionText: "What does the word 'Renaissance' mean?", correctAnswer: "Rebirth" },
        { questionNumber: 2, questionText: "Which era preceded the Renaissance?", correctAnswer: "The Middle Ages" },
        { questionNumber: 3, questionText: "In which century did the Renaissance begin?", correctAnswer: "14th Century" }
    ]
};

app.get('/testUI', (req, res) => {
    res.render('TestView', { item: testData });
});

// Port for Express
const port = 5000;
app.listen(port, () => {
    console.log('Server running on Port: ${port}');
})
