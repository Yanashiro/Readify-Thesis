// Mongoose Module Import
const { name } = require("ejs");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

// Database Connection - EDIT THIS TO CLOUD FOR LATER TESTING
const connect = mongoose.connect("mongodb://localhost:27017/readifyTesting");

// Database Connection Test
connect
	.then(async() => {
		console.log("Database Connection Successful.");
		// Updates Passage Counter
		const maxDoc = await passageCollection.findOne().sort({ passageId: -1 });
    const maxId = maxDoc ? maxDoc.passageId : 0;
		await mongoose.connection.collection('counters').updateOne(
      { id: 'passageId' }, 
      { $set: { seq: maxId } },
      { upsert: true });
		console.log(`Passage Counter synced to ${maxId}`);
		// Updates User Counter
		// Updates User Counter
		const maxUser = await readifyUser_Collection.findOne().sort({ userId: -1 });
		const maxUserId = maxUser ? maxUser.userId : 0;

		await mongoose.connection.collection('counters').updateOne(
			{ id: 'userId' }, 
			{ $set: { seq: maxUserId } }, 
			{ upsert: true }
		);
		console.log(`User Counter synced to ${maxUserId}`);
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
	// Updated at the end of every test
	// Sum of testHistory.score divided by testHistory.totalQuestions = Band Score 
	// (Rounded to nearest no decimal max is 9 lowest is 1 (not 0))
	// MAX POSSIBLE SCORE IS 12 Questions * 11 Test Types = 132/132 - CANNOT GO OVER
	// Just update this whenever its rendered to be displayed
	bandScore: {
		type: Number,
		// If Over >9 Set to 9
		default: 0,
	},
	// yung bandscore pang main test ? sum of all main test hindi siya main test , sum ng scores ng lahat ng main Yes
	// Di lang score pati total questions bawal lumagpas ng 132 

	// possible yan dito 
	// aggregate
	// Kaya mo ireplace ung old mainTest Score ng bago
	// nasaan yung old meaintest score
	// wait

	testHistory: [
		{
			testDesignation: { type: Boolean, required: true },
			testType: { type: Number, required: true },
			score: { type: Number, required: true },
			totalQuestions: { type: Number, required: true },
			takenAt: { type: Date, default: Date.now } // lateste
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
	answerExplanation:{
		type: String,
		required: false
	}
},
	{ _id: false },); // Stops Object ID Generation

const passageSchema = new mongoose.Schema({
	passageId: {
		type: Number,
		unique: true,
	},
	testDesignation: {
		// Checkbox or Dropdown
		type: Boolean,
		required: true,
	},
	testType: {
		// Dropdown
		// testType 1 (Multiple Choices)
		// testType 2 (Matching Features)
		// testType 3 (Matching Information)
		// testType 4 (Identifying Information)
		// testType 5 (Identifying Writers Views)
		// testType 6 (Matching Sentence Endings)
		// testType 7 (Matching Headings)
		// testType 8 (Summary Completion)
		// testType 9 (Short Answer Questions)
		// testType 10 (Sentence Completion)
		// testType 11 (Diagram Label Completion)
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
	passageImage: {
		type: String,
		required: false
	},
	passageSource: {
		type: String,
		required: false
	},
	questions: {
		// Textbox
		type: [questionSchema],
		default: [],
	},
});
passageSchema.plugin(autoIncrement, { inc_field: "passageId",}); // Auto Increment for Passage ID

const vocabularySchema = new mongoose.Schema({
	wordEntry: {
		type: String},
	wordDescriptors: [{
		// 4 Descriptions only one right description
		type: String
	}],
	correctAnswer: {
		type: String
	}
});

// Database Collection
const readifyUser_Collection = new mongoose.model("users", userSchema);
const questionCollection = new mongoose.model("questions", questionSchema);
const passageCollection = new mongoose.model("passages", passageSchema);
const vocabCollection = new mongoose.model("vocabularyTest", vocabularySchema)

// Exporting Model
module.exports = {
	readifyUser_Collection,
	questionCollection,	
	passageCollection,
	vocabCollection,
};