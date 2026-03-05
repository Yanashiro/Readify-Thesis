import React, { useEffect, useState } from 'react';
import './maintest.css';
import axios, { all } from 'axios';
import lockTest from '../../images/locktest.png'
import { Link } from 'react-router-dom';

function TestDetails({ show, isVisible, link }) {

	const [userTestHistory, setUserTestHistory] = useState([]);

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

	useEffect(() => {
		axios.get("/api/v1/users/me", { withCredentials: true })
			.then(res => {
				setUserTestHistory(res.data.data.testHistory || []);
			})
			.catch(err => console.log(err));
	}, []);

	if (!isVisible || !show) return null;

	const currentTestType = testTypeMap[show];

	// 🔥 Get latest main test attempt for this test type
	const latestTest = userTestHistory
		.filter(item =>
			Number(item.testType) === currentTestType &&
			item.testDesignation === true
		)
		.sort((a, b) => new Date(b.takenAt) - new Date(a.takenAt))[0];
	const lastScore = latestTest?.score ?? null;
	const lastTotal = latestTest?.totalQuestions ?? null;

	return (
		<div className="test-details-container">
			<div className="test-Title-Div">
				<h3 className="test-Title">{show}</h3>
			</div>

			<div id="test-Items">
				<ul id="test-List">
					<li>10 Questions</li>
					<li>15 minutes</li>
				</ul>

				{/* ✅ SHOW LAST SCORE FOR THIS TEST TYPE */}
				{lastScore !== null && (
					<p className="last-score">
						Last score was {lastScore} / {lastTotal}
					</p>
				)}
			</div>

			<div id="note-Test">
				<p id="note">
					Note: Once the test has started, you cannot go back. The test also cannot be paused
				</p>
			</div>

			<div id="button-Test-Div">
				<div id="button-Design">
					<Link to={link} id="start-Test">
						<p id="just-style">Start Test</p>
					</Link>
				</div>
			</div>
		</div>
	);
}

function MTPage() {
	const [userTestHistory, setUserTestHistory] = useState([]);
	const [allPassages, setAllPassages] = useState([]);
	const [currentPassage, setCurrentPassage] = useState(0);


	const testTypeMap = {
		1: "Multiple Choice",
		2: "Matching Features",
		3: "Matching Information",
		4: "Identifying Information",
		5: "Identifying Writer's Views",
		6: "Matching Sentence Endings",
		7: "Matching Headings",
		8: "Summary Completion",
		9: "Short-Answer Questions",
		10: "Sentence Completion",
		11: "Diagram Label Completion"
	};
	const [isVisible, setIsVisible] = useState(false);
	const [selectedTitle, setSelectedTitle] = useState("");
	const [frontEndLink, setFrontEndLink] = useState("");
	const [isTestDetails, setTestDetails] = useState(0);
	const [isBandScore, setBandScore] = useState(0);
	//let [isCompleted, setCompleted] = useState("");
	//const [isMainResults, setMainResults] = useState({});
	const [isAnswered, setItemAnswered] = useState(false);


	useEffect(() => {
		axios.get("/api/v1/users/me", { withCredentials: true })
			.then(res => {
				console.log(res.data.data.testHistory);

				setUserTestHistory(res.data.data.testHistory || []);
			})
			.catch(err => console.log(err));
	}, []);

	// This function now handles everything when a button is clicked
	const handleButtonClick = (title, link, type) => {

		// If same title, close it. If new title, open it.
		if (selectedTitle === title && isVisible) {
			setIsVisible(false);
			setSelectedTitle("");
		} else {
			setSelectedTitle(title);
			setIsVisible(true);
			setFrontEndLink(link);
		}

		const queryParams = {
			title: title,
			designation: 'true'
		}
		// Fetch the data for this specific test
		// axios
		// 	// change this post route if needed
		// 	.get('/maintestselection/retrieveData', { params: queryParams, withCredentials: true })
		// 	.then((res) => {
		// 		// Update all states with the response from the backend
		// 		//setCompleted(res.data.status);
		// 		setTestDetails(res.data);
		// 		setBandScore(res.data.band);
		// 		//setMainResults(res.data.calculations);

		// 		// update the status that TestDetails uses to switch views (IF/Else statement)
		// 		setItemAnswered(res.data.status);
		// 	})
		// 	.catch((err) => console.error("Error retrieving data:", err));

		fetch(`/start-random-exam?designation=true&type=${type}`)
			.then(res => res.json())
			.then(data => {

				if (data && data.questions) {
					
					setAllPassages([data]);
					setCurrentPassage(data);
				}
				else if (data.data && data.data.length > 0) {
					setAllPassages(data.data);
					setCurrentPassage(data.data[0]);
				}

			})
			.catch(err => console.error(err));
	};

	// Keep the initial load status check
	useEffect(() => {

		axios
			// change t his get route if needed
			.get('/maintestselection/status', { withCredentials: true })
			.then((res) => {
				//setCompleted(res.data.status);
				setTestDetails(res.data);
				setBandScore(res.data.band);
				//setMainResults(res.data);
				setItemAnswered(res.data.status);
			})
			.catch((err) => console.error(err));
	}, [])

	const getSkillLevel = (score) => {
		if (score >= 11) return "Expert";
		if (score >= 9) return "Very Good";
		if (score >= 7) return "Good";
		if (score === 6) return "Competent";
		if (score === 5) return "Modest";
		if (score === 4) return "Limited";
		if (score === 3) return "Extremely Limited";
		if (score === 2) return "Intermittent";
		if (score === 1) return "Non-user";
		return "-";
	};
	const getBandScore = (score) => {
		if (score >= 11) return 9;
		if (score >= 9) return 8;
		if (score >= 7) return 7;
		if (score === 6) return 6;
		if (score === 5) return 5;
		if (score === 4) return 4;
		if (score === 3) return 3;
		if (score === 2) return 2;
		if (score === 1) return 1;
		return "-";
	};
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleString("en-PH", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	};
	return (
		<main className='maintest-main'>
			<section id="section1">
				<div className='maintest-title'>
					<h1 className='main-test-h1'>Main Test</h1>
				</div>
				<div>

					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Multiple Choice", "/maintest/multiplechoices", 1)} >
							<p className="title multipleChoice">Multiple Choice</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Identifying Information", "/maintest/identifyinginformation", 4)} >
							<p className="title identifyingInfo">Identifying Information (True/False/NotGiven)</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Identifying Writer's Views", "/maintest/identifyingwritersviews", 5)}>
							<p className="title identifyingView">Identifying writer's views/claims (Yes/No/Not given)</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Information", "/maintest/matchinginformation", 3)}>
							<p className="title matchingInfo">Matching Information</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Headings", "/maintest/matchingheadings", 7)}>
							<p className="title matchingHead">Matching Headings</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Features", "/maintest/matchingfeatures", 2)}>
							<p className="title matchingFeat">Matching Features</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Sentence Endings", "/maintest/matchingsentenceendings", 6)}>
							<p className="title matchingSent">Matching Sentence Endings</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Sentence Completion", "/maintest/sentencecompletion", 10)}>
							<p className="title sentenceComp">Sentence Completion</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Summary Completion", "/maintest/summarycompletion", 8)}>
							<p className="title summary">Summary Completion</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Diagram Label Completion", "/maintest/diagramlabelcompletion", 11)}>
							<p className="title diagramLabel">Diagram Label Completion</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Short-Answer Questions", "/maintest/shortanswerquestions", 9)}>
							<p className="title shortAnswer">Short-Answer Questions</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
				</div>
			</section>
			<section id="section2">
				<TestDetails show={selectedTitle} isVisible={isVisible} alreadyAnswered={isAnswered} link={frontEndLink} allPassages={allPassages} currentPassage={currentPassage} score={isTestDetails.score} totalQuestions={isTestDetails.totalQuestions} band={isBandScore} /*mainResults={isMainResults}*/ />
			</section>
			<div className='section-main-test-results'>
				<div className="main-test-results">

					<table className="main-test-results table">

						<thead className="main-test-results__head table__head">
							<tr className="main-test-results__row main-test-results__row--header table__row">
								<th className="main-test-results__cell table__cell">Test Type</th>
								<th className="main-test-results__cell table__cell">Score</th>
								<th className="main-test-results__cell table__cell">Band Score</th>
								<th className="main-test-results__cell table__cell">Skill Level</th>
								<th className="main-test-results__cell table__cell">Date Taken</th>
							</tr>
						</thead>

						<tbody className="main-test-results__body table__body">

							{userTestHistory
								?.filter(test => test.testDesignation === true)
								.map((test) => (
									<tr key={test._id} className="main-test-results__row table__row">

										<td className="main-test-results__cell table__cell">
											{testTypeMap[test.testType]}
										</td>

										<td className="main-test-results__cell table__cell">
											{test.score}
										</td>

										<td className="main-test-results__cell table__cell">
											{getBandScore(test.score)}
										</td>

										<td className="main-test-results__cell table__cell">
											{getSkillLevel(test.score)}
										</td>

										<td className="main-test-results__cell table__cell">
											{formatDate(test.takenAt)}
										</td>

									</tr>
								))}

						</tbody>

					</table>

				</div>
			</div>
		</main>
	)
}

export default MTPage;
