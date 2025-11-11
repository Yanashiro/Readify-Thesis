// Mongoose Module Import
const { name } = require("ejs");
const mongoose = require("mongoose");

// Database Connection - EDIT THIS TO CLOUD FOR LATER TESTING
const connect = mongoose.connect("mongodb://localhost:27017/readifyTesting")

// Database Connection Test
connect.then(() => {
    console.log("Database Connection Successful.");
})
.catch(() => {
    console.log("Database Connection Failed.")
})

// Schema Creation - Edit Here when creating new variables for the database
const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
});

// Database Collection
const readifyCollection = new mongoose.model("users", loginSchema);

// Exporting Model
module.exports = readifyCollection;

