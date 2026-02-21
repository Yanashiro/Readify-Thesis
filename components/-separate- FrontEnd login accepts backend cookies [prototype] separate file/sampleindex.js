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