// Mongoose Module Import
const { name } = require("ejs");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

// Database Connection - EDIT THIS TO CLOUD FOR LATER TESTING
const connect = mongoose.connect("mongodb://localhost:27017/readifyTesting");

// Database Connection Test
connect
    .then(() => {
        console.log("Database Connection Successful.");
    })
    .catch(() => {
        console.log("Database Connection Failed.");
    });

// Schema Creation - Edit Here when creating new variables for the database

// Schema for New Users

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    testHistory: [
        {
            passageId: { type: Number, required: true },
            passageTitle: String,
            score: { type: Number, required: true },
            totalQuestions: { type: Number, required: true },
            takenAt: { type: Date, default: Date.now },
        }
    ],
    achievements: [
        {
            title: { type: String, required: true }, // Title
            description: String, // Short Description
            earnedAt: { type: Date, default: Date.now }, // Date and Time
            icon: String, // URL to an image/icon
        },
    ],
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
});
userSchema.plugin(autoIncrement, { inc_field: "userId" }); // Auto Increment for User ID

// Schema for Passages & Questions
const questionSchema = new mongoose.Schema({
        questionNumber: {
            type: Number,
            required: true,
        },
        questionText: {
            type: String,
            required: true,
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
        },
        correctAnswer: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    { _id: false },); // Stops Object ID Generation

const passageSchema = new mongoose.Schema({
    testDesignation: {
        // Checkbox or Dropdown
        type: Boolean,
        required: true,
    },
    testType: {
        // Dropdown
        // testType 1 (Multiple Choices)
        // testType 2 (True / False / Not Given)
        // testType 3 (Yes / No / Not Given)
        // testType 4 (Matching Information)
        // testType 5 (Matching Headings)
        // testType 6 (Matching Features)
        // testType 7 (Matching Sentence Endings)
        // testType 8 (Sentence Completion)
        // testType 9 (Summary Completion)
        // testType 10 (Diagram-Label Completion)
        // testType 11 (Short-Answer Questions)
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    },
    passageTitle: {
        // Textbox
        type: String,
        required: true,
    },
    passage: {
        // Textbox
        type: String,
        required: true,
    },
    passageSource: {
        // Textbox
        type: String,
        required: false,
    },
    passageImage:{
        type: String,
        required: false
    },
    questions: {
        // Textbox
        type: [questionSchema],
        default: [],
    },
});
passageSchema.plugin(autoIncrement, { inc_field: "passageId" }); // Auto Increment for Passage ID

// Database Collection
const readifyUser_Collection = new mongoose.model("users", userSchema);
const questionCollection = new mongoose.model("questions", questionSchema);
const passageCollection = new mongoose.model("passages", passageSchema);

// Exporting Model
module.exports = {
    readifyUser_Collection,
    questionCollection,
    passageCollection,
};
