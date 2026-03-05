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
	vocabCollection,
} = require("./config");
const { ObjectId } = require('mongodb');
const { name } = require("ejs");
const { Collection } = require("mongoose");

// Routers
const userRouter = require('./userRoutes');
const { log } = require("console");
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
		httpOnly: true  // Helps prevent XSS
	}
}));

app.use('/api/v1/users', userRouter);

const isAuthenticated = (req, res, next) => {
	// Check if the session has our userId variable
	if (req.session && req.session.userId) {
		return next(); // User is logged in, proceed to the route
	}
	// User is not logged in, redirect to login page
	res.redirect('/Login');
};

// Upload Middleware for Passage Creation 
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function (req, file, cb) {
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
	res.render('Home');;
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
// /^\/maintest(.*)/ causes error when clicking one of the main tests
// /^\/maintest(.*)/ means to respond to api requests that starts with /maintest , /maintestselection triggers this middleware
app.get(/^\/maintest(.*)/, (req, res) => {
	// res.render("MainTest");
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
			req.session.isAdmin = user.isAdmin;
			// This is what the frontend needs for determining if the user is an admin or an examinee/student, depends on what you want to put 
			// it can also be like this: req.session.role = user.usAdmin ? "admin" : "examinee*; /

			// res.json({ // This is what the frontend needs, express can only send 1 response, so we have to be careful
			//     success: true,
			//     message: "Login successful",
			//     isAdmin: user.isAdmin,
			//     name: user.name})
			// This is not what the fucking frontend needs. I commented this and the fucking login worked but it just didn't fucking redirect.

			res.status(200).json({
				success: true,
			});

		} else {
			res.render('Login', { error: 'Invalid credentials. Check your username/email or password.' });
		}
	} catch (err) {
		console.error("DEBUG ERROR:", err); // Look at your terminal/command prompt!
		res.status(500).send(err.message);
	}
});


app.get("/auth/me", (req, res) => { // This can be used when the frontend is looking for the role of the account as well as handling user account details 
	if (!req.session.userId) {
		return res.json({ loggedIn: false });
	}

	res.json({
		loggedIn: true,
		name: req.session.userName,
		isAdmin: req.session.isAdmin
	});
});

app.delete('/attempt', async (req, res) => {
	try {

		const { userId, attemptId } = req.body;

		if (!userId || !attemptId) {
			return res.status(400).json({
				status: 'error',
				message: 'Missing userId or attemptId'
			});
		}

		await readifyUser_Collection.updateOne(
			{ _id: new ObjectId(userId) },
			{
				$pull: {
					testHistory: { _id: new ObjectId(attemptId) }
				}
			}
		);

		res.status(200).json({
			status: 'success',
			message: 'Attempt deleted successfully'
		});

	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: 'error',
			message: 'Server error'
		});
	}
});

const testTypeMap = {
	"Multiple Choice": 1,
	"Matching Features": 2,
	"Matching Information": 3,
	"Identifying Information": 4,
	"Identifying Writer's Views": 5,
	"Matching Sentence Endings": 6,
	"Matching Headings": 7,
	"Summary Completion": 8,
	"Short-Answer Questions": 9,
	"Sentence Completion": 10,
	"Diagram Label Completion": 11
};



app.get('/maintestselection/retrieveData', async (req, res) => {
	try {

		const { title, designation } = req.query;

		if (!req.session.userId) {
			return res.status(401).json({
				status: false,
				message: "Not authenticated"
			});
		}

		const user = await readifyUser_Collection.findOne({
			_id: new ObjectId(req.session.userId)
		});

		if (!user) {
			return res.status(404).json({
				status: false,
				message: "User not found"
			});
		}

		const testType = testTypeMap[title];

		if (!testType) {
			return res.status(400).json({
				status: false,
				message: "Invalid test type"
			});
		}

		// Filter attempts for:
		// - Main test only
		// - Specific testType
		const attempts = user.testHistory
			.filter(t =>
				t.testDesignation === true &&
				t.testType === testType
			)
			.sort((a, b) => new Date(b.takenAt) - new Date(a.takenAt));

		if (attempts.length === 0) {
			return res.status(200).json({
				status: false,
				score: 0,
				totalQuestions: 0,
				band: 0
			});
		}

		const latestAttempt = attempts[0];

		// Placeholder band formula (replace later)
		const percent = (latestAttempt.score / latestAttempt.totalQuestions) * 100;

		let band = 1;
		if (percent >= 85) band = 9;
		else if (percent >= 70) band = 7;
		else if (percent >= 55) band = 5;
		else if (percent >= 40) band = 3;

		res.status(200).json({
			status: true,
			score: latestAttempt.score,
			totalQuestions: latestAttempt.totalQuestions,
			band: band
		});

	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: false,
			message: "Server error"
		});
	}
});

app.get('/user', async (req, res) => {
	try {

		const { userId } = req.query;

		if (!userId) {
			return res.status(400).json({
				status: 'error',
				message: 'User ID is required'
			});
		}

		const user = await readifyUser_Collection.findOne({
			_id: new ObjectId(userId)
		});

		if (!user) {
			return res.status(404).json({
				status: 'error',
				message: 'User not found'
			});
		}

		res.status(200).json({
			status: 'success',
			data: user
		});

	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: 'error',
			message: 'Server error'
		});
	}
});


app.get("/create-passage", isAuthenticated, (req, res) => {
	res.render("PassageCreation");
});

// Create Test Passage
app.post('/create-passage', upload.single('passageImage'), async (req, res) => {
	try {
		const { testDesignation, testType, passageTitle, passage, passageImage, passageSource, questions } = req.body;

		// Get image path if a file was uploaded
		const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

		const formattedQuestions = Object.values(questions).map(q => ({
			questionNumber: parseInt(q.number),
			questionText: q.text,
			correctAnswer: q.answer,
			data: q.data ? q.data.split(',').map(item => item.trim()) : null,
			answerExplaination: q.explaination
		}));

		const newPassage = new passageCollection({
			testDesignation: testDesignation === 'true',
			testType: parseInt(testType),
			passageTitle,
			passage,
			passageImage: imagePath, // Save the path to DB
			passageSource,
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
// const testData = {
//     testId: 101,
//     testDesignation: true,
//     testType: 1,
//     passageTitle: "The Renaissance Era",
//     passage:
//         "The Renaissance was a fervent period of European cultural, artistic, political and economic 'rebirth' following the Middle Ages. It began in the 14th century and spread across Europe, marking the transition from the Middle Ages to Modernity.",
//     questions: [
//         {
//             questionNumber: 1,
//             questionText: "What does the word 'Renaissance' mean?",
//             correctAnswer: "Rebirth",
//         },
//         {
//             questionNumber: 2,
//             questionText: "Which era preceded the Renaissance?",
//             correctAnswer: "The Middle Ages",
//         },
//         {
//             questionNumber: 3,
//             questionText: "In which century did the Renaissance begin?",
//             correctAnswer: "14th Century",
//         },
//     ],
// };

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

		/*res.render('ExamMode', { 
				test: testData, 
				typeLabel: typeLabels[selectedType] 
		});*/
		res.json({
			questions: testData.questions,
			test: testData,
			typeLabel: typeLabels[selectedType]
		})
	} catch (err) {
		res.status(500).send("Error entering exam mode.");
	}
});


// Exam Results Route - Processes the submitted answers and calculates the score
app.post('/submit-results', async (req, res) => {
	try {

		const { submissionData, testType } = req.body;
		const testDesignation = req.body.testDesignation;

		console.log('test type: ', testType);
		console.log('test designation: ', testDesignation);

		if (!submissionData) {
			return res.status(400).json({ status: "error", message: "No data received" });
		}

		let totalCorrect = 0;
		let totalQuestions = 0;

		for (const passageResult of submissionData) {

			const passage = await passageCollection.findOne({
				passageId: passageResult.passageId
			});

			if (!passage) continue;

			const questions = passage.questions || [];
			totalQuestions += questions.length;

			questions.forEach((q, idx) => {

				const userAnswer = passageResult.answers[idx];

				console.log('User answer: ', userAnswer);
				console.log('Correct answer: ', q.correctAnswer);

				if (userAnswer && userAnswer.toLowerCase() === q.correctAnswer.toLowerCase()) {
					totalCorrect++;
				}

			});
		}

		console.log(`User Score: ${totalCorrect} / ${totalQuestions}`);

		/* =========================
			 UPSERT TEST HISTORY
		========================= */

		const updateResult = await readifyUser_Collection.updateOne(
			{
				_id: new ObjectId(req.session.userId),
				testHistory: {
					$elemMatch: {
						testDesignation: testDesignation,
						testType: testType
					}
				}
			},
			{
				$set: {
					"testHistory.$.score": totalCorrect,
					"testHistory.$.totalQuestions": totalQuestions,
					"testHistory.$.takenAt": new Date()
				}
			}
		);

		if (updateResult.matchedCount === 0) {

			await readifyUser_Collection.updateOne(
				{ _id: new ObjectId(req.session.userId) },
				{
					$push: {
						testHistory: {
							testDesignation,
							testType,
							score: totalCorrect,
							totalQuestions,
							takenAt: new Date()
						}
					}
				}
			);

		}

		/* =========================
			 ACHIEVEMENTS (MAIN TESTS ONLY)
		========================= */

		let newAchievements = [];

		if (testDesignation === true) {

			const achievementList = [
				{ title: "First Steps", description: "Completed your first test", icon: "/icons/test.jpg" },
				{ title: "Getting the Hang of it", description: "Completed 5 tests", icon: "/icons/test.jpg" },
				{ title: "Marathon Reader", description: "Completed 10 tests", icon: "/icons/test.jpg" },
				{ title: "Comprehension Starter", description: "Scored 50% or higher in a test", icon: "/icons/test.jpg" },
				{ title: "Sharp Reader", description: "Scored 75% or higher in a test", icon: "/icons/test.jpg" },
				{ title: "IELTS Star", description: "Scored 90% or higher in a test", icon: "/icons/test.jpg" },
				{ title: "Perfect Score", description: "Scored 100% in one test", icon: "/icons/test.jpg" },
				{ title: "Elite Achiever", description: "Unlocked all achievements", icon: "/icons/test.jpg" }
			];

			const user = await readifyUser_Collection.findOne({
				_id: new ObjectId(req.session.userId)
			});

			const earnedTitles = user.achievements.map(a => a.title);

			const percentage = (totalCorrect / totalQuestions) * 100;

			/* count ONLY main tests */
			const mainTestsCompleted =
				user.testHistory.filter(t => t.testDesignation === true).length;

			function unlock(title) {

				const achievement = achievementList.find(a => a.title === title);

				if (achievement && !earnedTitles.includes(title)) {

					newAchievements.push({
						title: achievement.title,
						description: achievement.description,
						icon: achievement.icon,
						earnedAt: new Date(),
						userId: req.session.userId
					});

				}
			}

			/* TEST COUNT ACHIEVEMENTS */

			if (mainTestsCompleted >= 1) unlock("First Steps");
			if (mainTestsCompleted >= 5) unlock("Getting the Hang of it");
			if (mainTestsCompleted >= 10) unlock("Marathon Reader");

			/* SCORE ACHIEVEMENTS */

			if (percentage >= 50) unlock("Comprehension Starter");
			if (percentage >= 75) unlock("Sharp Reader");
			if (percentage >= 90) unlock("IELTS Star");
			if (percentage === 100) unlock("Perfect Score");

			/* ELITE ACHIEVER */

			const possibleAchievements = achievementList.length - 1;

			if ((user.achievements.length + newAchievements.length) === possibleAchievements) {
				unlock("Elite Achiever");
			}

			/* SAVE NEW ACHIEVEMENTS */

			if (newAchievements.length > 0) {

				await readifyUser_Collection.updateOne(
					{ _id: new ObjectId(req.session.userId) },
					{
						$push: {
							achievements: { $each: newAchievements }
						}
					}
				);

			}

		}

		/* =========================
			 RESPONSE
		========================= */

		res.status(200).json({
			status: "success",
			totalCorrect,
			totalQuestions,
			newAchievements
		});

	} catch (err) {

		console.error(err);

		res.status(500).json({
			status: "error",
			message: "Server error"
		});

	}
});
// const { passageId, userAnswers } = req.body;
// const test = await passageCollection.findOne({ passageId: passageId });
// if (!test) return res.status(404).send("Test not found.");
// let score = 0;
// const results = test.questions.map((q, index) => {
// 	const rawAnswer = (userAnswers && userAnswers[index]) ? userAnswers[index] : "";
// 	const userAns = Array.isArray(rawAnswer) ? rawAnswer[0].trim() : rawAnswer.trim();
// 	const correctAns = q.correctAnswer.toString().trim();
// 	const isCorrect = userAns.toLowerCase() === correctAns.toLowerCase();
// 	if (isCorrect) score++;
// 	return {
// 		questionNumber: q.questionNumber,
// 		userAns,
// 		correctAns,
// 		isCorrect
// 	};
// });

// SAVE TO USER HISTORY
// if (req.session.userId) {
// 	await readifyUser_Collection.findOneAndUpdate(
// 		{ userId: req.session.userId },
// 		{
// 			$push: {
// 				testHistory: {
// 					passageId: test.passageId,
// 					passageTitle: test.passageTitle,
// 					score: score,
// 					totalQuestions: test.questions.length,
// 					takenAt: new Date()
// 				}
// 			}
// 		}
// 	);
// }
// res.render('Results', { score, total: test.questions.length, results, passageTitle: test.passageTitle });
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500).send("Error processing results.");
// 	}
// });

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

// app.get('/start-main-test', async (req, res) => {
// 	const testDesignation = req.query.designation === 'true';
// 	const testType = parseInt(req.query.type);

// 	const randomPassages = await passageCollection.aggregate([
// 		{
// 			$match: {
// 				testDesignation: testDesignation,
// 				testType: testType
// 			}
// 		},
// 		{
// 			$sample: { size: 3 }
// 		}
// 	]);

// 	res.status(200).json({
// 		status: 'success',
// 		results: randomPassages.length,
// 		data: randomPassages
// 	})
// })

app.get('/start-vocabulary-exam', async (req, res) => {

	try {
		console.log('vocab runs');
		

		const randomWord = await vocabCollection.aggregate([
			{ $sample: { size: 1 } }
		]);

		res.status(200).json({
			status: "success",
			data: randomWord[0]
		});

	} catch (err) {

		console.error(err);

		res.status(500).json({
			status: "error",
			message: "Server error"
		});

	}

});
// Step 2: Process selection and find Random Test
app.get('/start-random-exam', async (req, res) => {
	try {
		const testDesignation = req.query.designation === 'true';
		const testType = parseInt(req.query.type);

		const randomPassages = await passageCollection.aggregate([
			{
				$match: {
					testDesignation,
					testType
				}
			},
			{
				$sample: { size: 3 }
			}
		]);

		// console.log(randomPassages)

		if (!randomPassages) {
			return res.status(404).json({
				status: 'failed',
				message: 'No passages detected',
			});
		} else {
			return res.status(200).json({
				status: 'success',
				results: randomPassages.length,
				data: randomPassages
			});
		};
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

		res.status(200).json({
			status: 'success',
			data: test,
			typeLabel: typeLabels[test.testType]
		})
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

		// console.log(users)

		res.status(200).json({
			status: "success",
			data: users
		});


		// pag inedit kotong .render sa 5000 d sya gagana pero try ko both ayusin 5000 at 5173 - richard
		// res.render('userManagement', { users }); 
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
app.post('/UserManagement/create', isAuthenticated, async (req, res) => {
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
		const hashedPassword = await bcrypt.hash(data.password, 10);
		data.password = hashedPassword;
		// Sends the data to the database
		const userdata = new readifyUser_Collection(data);
		await userdata.save();
		// Logging
		// console.log(userdata);
		res.redirect('/UserManagement');
	}
});

// Update User 
app.post('/UserManagement/update/:userId', isAuthenticated, async (req, res) => {
	try {
		const { name, email, isAdmin, password } = req.body;

		let updateData = {
			name,
			email,
			isAdmin: isAdmin === 'on'
		};

		// Only add password to the update if the user actually typed one
		if (password && password.trim() !== "") {
			updateData.password = await bcrypt.hash(password, 10);
			updateData.password = password;
		}

		const updatedUser = await readifyUser_Collection.findOneAndUpdate(
			{ userId: Number(req.params.userId) },
			updateData,
			{ new: true, runValidators: true }
		);
		if (!updatedUser) return res.status(404).send("User not found.");
		res.redirect('/UserManagement');
	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).send("Update Failed: Username or Email is already in use.");
		}
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

// Delete Test Results
app.get('/UserManagement/delete-test/:userId/:passageId', async (req, res) => {
	try {
		const { userId, passageId } = req.params;
		const result = await User.findOneAndUpdate(
			{ userId: Number(userId) },
			{
				$pull: {
					testHistory: { passageId: Number(passageId) }
				}
			},
			{ new: true }
		);

		if (!result) {
			return res.status(404).send("User or Test not found.");
		}
		res.redirect(`/UserManagement/edit/${userId}`);
	} catch (err) {
		console.error("Error deleting test record:", err);
		res.status(500).send("Server Error: " + err.message);
	}
});

app.get('/achievements', async (req, res, next) => {
	try {
		const user = await readifyUser_Collection.findById(req.session.userId);
		if (!user) {
			return res.redirect('/login');
		}

		if (user.achievements) {
			user.achievements.sort((a, b) => b.earnedAt - a.earnedAt);
		}
		console.log(user.achievements);

		res.status(200).json({
			status: 'success',
			results: user.achievements.length,
			data: user.achievements
		});
	} catch (err) {
		console.error(err);
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

		res.status(200).json({
			data: user
		});

		// doesn't send data to profile.jsx . it sends data to profile.ejs
		// res.render('profile', { user });
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

module.exports = app;