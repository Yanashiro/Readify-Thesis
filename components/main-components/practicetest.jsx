import React, { useEffect, useState } from 'react';
import './maintest.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function TestDetails({ show, isVisible, link, alreadyAnswered, score, totalQuestions, band /*mainResults*/ }) {

	if (!isVisible) return null;


	if (alreadyAnswered === false) {
		return (
			<>
				<div className="test-details-container">
					<div className="test-Title-Div">
						<h3 className="test-Title">{show}</h3>
					</div>
					<div id="test-Items">
						<ul id="test-List">
							<li>10 Questions</li>
							<li>15 minutes</li>
						</ul>
					</div>
					<div id="note-Test">
						<p id="note">Note: Once the test has started, you cannot go back. The test also cannot be paused</p>
					</div>
					<div id="button-Test-Div">
						<div id="button-Design">
							<a href={link} id="start-Test"><p id="just-style">Start Test</p></a>
						</div>
					</div>
				</div>
			</>
		);
	} else if (alreadyAnswered === true) {
		return (
			<>
				<div>
					<div className="test-details-container2">
						<div className="test-title-div2">
							<h3 className="test-Title">{show} Results:</h3>
						</div>
						<div id="items-Completed">
							<ul id="correct-Answers">
								<li>{score}/{totalQuestions} Correct Answer</li>
								<li>Band Score: {band}</li>
							</ul>
						</div>
						<div id="button-Test-Completed">
							<div id="button-Design-Completed">
								<p>Test Done <img width={"10px"} height={"10px"}></img></p>
							</div>
						</div>
					</div>
					{/*
            <div className="main-Test-Container">
                <div>
                    <p className="p-test-results">Current Main Test Results:</p>
                </div>
                <div>
                    {mainResults?.totalCorrectAnswers ?? 0} / {mainResults?.totalQuestions ?? 0}
                </div>
            </div>
            */}
				</div>
			</>
		);
	}
}

function PTPage() {


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
	const handleButtonClick = (title, link) => {

		// If same title, close it. If new title, open it.
		if (selectedTitle === title && isVisible) {
			setIsVisible(false);
			return;
		}

		setSelectedTitle(title);
		setIsVisible(true);
		setFrontEndLink(link);

		const queryParams = {
			title: title,
			designation: 'true'
		}

		// Fetch the data for this specific test
		// axios
		//     // change this post route if needed
		//     .get('/test-scoring', {params: queryParams, withCredentials: true})
		//     .then((res) => {
		//         console.log('reached');
		//         // Update all states with the response from the backend
		//         //setCompleted(res.data.status);
		//         setTestDetails(res.data);
		//         setBandScore(res.data.band);
		//         //setMainResults(res.data.calculations);

		//         // update the status that TestDetails uses to switch views (IF/Else statement)
		//         setItemAnswered(res.data.status); 
		//     })
		//     .catch((err) => console.error("Error retrieving data:", err));
	};

	// Keep the initial load status check
	// useEffect(() => {

	//     axios
	//         // change t his get route if needed
	//         .get('/test-scoring', { withCredentials: true })
	//         .then((res) => {
	//             //setCompleted(res.data.status);
	//             setTestDetails(res.data);
	//             //setBandScore(res.data.band);
	//             //setMainResults(res.data);
	//             setItemAnswered(res.data.status);
	//         })
	//         .catch((err) => console.error(err));
	// }, [])


	return (
		<main className='maintest-main'>
			<section id="section1">
				<div className='maintest-title'>
					<h1 className='main-test-h1'>Practice Test</h1>
				</div>
				<div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Multiple Choice", "/practicetest/multiplechoices")} >
							<p className="title multipleChoice">Multiple Choice</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Identifying Information", "/practicetest/identifyinginformation")} >
							<p className="title identifyingInfo">Identifying Information (True/False/NotGiven)</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Identifying Writer's Views", "/practicetest/identifyingwritersviews")}>
							<p className="title identifyingView">Identifying writer's views/claims (Yes/No/Not given)</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Information", "/practicetest/matchinginformation")}>
							<p className="title matchingInfo">Matching Information</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Headings", "/practicetest/matchingheadings")}>
							<p className="title matchingHead">Matching Headings</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Features", "/practicetest/matchingfeatures")}>
							<p className="title matchingFeat">Matching Features</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Sentence Endings", "/practicetest/matchingsentenceendings")}>
							<p className="title matchingSent">Matching Sentence Endings</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Sentence Completion", "/practicetest/sentencecompletion")}>
							<p className="title sentenceComp">Sentence Completion</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Summary Completion", "/practicetest/summarycompletion")}>
							<p className="title summary">Summary Completion</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Diagram Label Completion", "/practicetest/diagramlabelcompletion")}>
							<p className="title diagramLabel">Diagram Label Completion</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
					<div className='buttons'>
						<button className="main-test-buttons" onMouseDown={() => handleButtonClick("Short-Answer Questions", "/practicetest/shortanswerquestions")}>
							<p className="title shortAnswer">Short-Answer Questions</p>
							<p className='main-arrow'>〉</p>
						</button>
					</div>
				</div>
			</section>
			<section id="section2">
				<TestDetails show={selectedTitle} isVisible={isVisible} alreadyAnswered={isAnswered} link={frontEndLink} score={isTestDetails.score} totalQuestions={isTestDetails.totalQuestions} band={isBandScore} /*mainResults={isMainResults}*/ />
			</section>
			<div className='section-main-test-results'>
				<div className="practice-test-results">

					<table className="practice-test-results table">

						<thead className="practice-test-results__head table__head">
							<tr className="practice-test-results__row practice-test-results__row--header table__row">
								<th className="practice-test-results__cell table__cell">Test Type</th>
								<th className="practice-test-results__cell table__cell">Last Known Score</th>
								<th className="practice-test-results__cell table__cell">Date Taken</th>
							</tr>
						</thead>

						<tbody className="practice-test-results__body table__body">

							{userTestHistory
								?.filter(test => test.testDesignation === false)
								.map((test) => (
									<tr key={test._id} className="practice-test-results__row table__row">

										<td className="practice-test-results__cell table__cell">
											{testTypeMap[test.testType]}
										</td>

										<td className="practice-test-results__cell table__cell">
											{test.score}
										</td>

										<td className="practice-test-results__cell table__cell">
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

export default PTPage
