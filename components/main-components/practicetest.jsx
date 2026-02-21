import React, { useEffect, useState } from 'react';
import './maintest.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function TestDetails({show, isVisible, link, alreadyAnswered, score, totalQuestions, band /*mainResults*/}) {
    
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

    const [isVisible, setIsVisible] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [frontEndLink, setFrontEndLink] = useState("");
    const [isTestDetails, setTestDetails] = useState(0);
    const [isBandScore, setBandScore] = useState(0);
    //let [isCompleted, setCompleted] = useState("");
    //const [isMainResults, setMainResults] = useState({});
    const [isAnswered, setItemAnswered] = useState(false);

    // This function now handles everything when a button is clicked
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    const handleButtonClick = (title, link) => {
=======
    const handleButtonClick = (title, link) => { 
>>>>>>> Stashed changes
=======
    const handleButtonClick = (title, link) => { 
>>>>>>> Stashed changes

        // If same title, close it. If new title, open it.
        if (selectedTitle === title && isVisible) {
            setIsVisible(false);
            return;
        }

        setSelectedTitle(title);
        setIsVisible(true);
        setFrontEndLink(link);

<<<<<<< Updated upstream
<<<<<<< Updated upstream
        const queryParams = {
            title: title,
            designation: 'true'
        }

        // Fetch the data for this specific test
        axios
            // change this post route if needed
            .get('/test-scoring', {params: queryParams, withCredentials: true})
            .then((res) => {
                // Update all states with the response from the backend
                //setCompleted(res.data.status);
                setTestDetails(res.data);
                setBandScore(res.data.band);
                //setMainResults(res.data.calculations);
=======
        // Fetch the data for this specific test
        axios
            // change this post route if needed
            .get('/maintestScoring', {params: {title}, withCredentials: true})
            .then((res) => {
                // Update all states with the response from the backend
=======
        // Fetch the data for this specific test
        axios
            // change this post route if needed
            .get('/maintestScoring', {params: {title}, withCredentials: true})
            .then((res) => {
                // Update all states with the response from the backend
>>>>>>> Stashed changes
                setCompleted(res.data.status);
                setCorrectAnswers(res.data.answers);
                setBandScore(res.data.band);
                setMainResults(res.data.calculations);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                
                // update the status that TestDetails uses to switch views (IF/Else statement)
                setItemAnswered(res.data.status); 
            })
            .catch((err) => console.error("Error retrieving data:", err));
    };

    // Keep the initial load status check
    useEffect(() => {

        axios
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            // change t his get route if needed
            .get('/test-scoring', { withCredentials: true })
            .then((res) => {
                //setCompleted(res.data.status);
                setTestDetails(res.data);
                //setBandScore(res.data.band);
                //setMainResults(res.data);
=======
=======
>>>>>>> Stashed changes
            // change this get route if needed
            .get('/maintestScoring', {withCredentials: true})
            .then((res) => {
                setCompleted(res.data.status);
                setCorrectAnswers(res.data.answers);
                setBandScore(res.data.band);
                setMainResults(res.data);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                setItemAnswered(res.data.status);
            })
            .catch((err) => console.error(err));
    }, [])


    return (
        <main className='maintest-main'>
            <section id="section1">
                <div className='maintest-title'>
                    <h1 className='main-test-h1'>Practice Test</h1>
                </div>
                <div>
                    <div className='buttons'>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Multiple Choice", "/practicetest/multiplechoices")} >
=======
=======
>>>>>>> Stashed changes
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Multiple Choice", "/practicetest/multiplechoices", active("Multiple Choice"))} >
>>>>>>> Stashed changes
                            <p className="title multipleChoice">Multiple Choice</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Identifying Information", "/practicetest/identifyinginformation")} >
=======
=======
>>>>>>> Stashed changes
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Identifying Information", "/practicetest/identifyinginformation", active("Identifying Information"))} >
>>>>>>> Stashed changes
                            <p className="title identifyingInfo">Identifying Information (True/False/NotGiven)</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Identifying Writer's Views", "/practicetest/identifyingwritersviews")}>
=======
=======
>>>>>>> Stashed changes
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Identifying Writer's Views", "/practicetest/identifyingwritersviews", active("Identifying Writer's Views"))}>
>>>>>>> Stashed changes
                            <p className="title identifyingView">Identifying writer's views/claims (Yes/No/Not given)</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Information", "/practicetest/matchinginformation")}>
=======
=======
>>>>>>> Stashed changes
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Information", "/practicetest/matchinginformation", active("Matching Information"))}>
>>>>>>> Stashed changes
                            <p className="title matchingInfo">Matching Information</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Headings", "/practicetest/matchingheadings")}>
=======
=======
>>>>>>> Stashed changes
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Headings", "/practicetest/matchingheadings", active("Matching Headings"))}>
>>>>>>> Stashed changes
                            <p className="title matchingHead">Matching Headings</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Features", "/practicetest/matchingfeatures")}>
=======
=======
>>>>>>> Stashed changes
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Features", "/practicetest/matchingfeatures", active("Matching Features"))}>
>>>>>>> Stashed changes
                            <p className="title matchingFeat">Matching Features</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Sentence Endings", "/practicetest/matchingsentenceendings")}>
=======
=======
>>>>>>> Stashed changes
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Sentence Endings", "/practicetest/matchingsentenceendings", active("Matching Sentence Endings"))}>
>>>>>>> Stashed changes
                            <p className="title matchingSent">Matching Sentence Endings</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Sentence Completion", "/practicetest/sentencecompletion")}>
=======
=======
>>>>>>> Stashed changes
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Sentence Completion", "/practicetest/sentencecompletion", active("Sentence Completion"))}>
>>>>>>> Stashed changes
                            <p className="title sentenceComp">Sentence Completion</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Summary Completion", "/practicetest/summarycompletion")}>
=======
=======
>>>>>>> Stashed changes
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Summary Completion", "/practicetest/summarycompletion", active("Summary/Note/table/Flow-chart Comparison"))}>
>>>>>>> Stashed changes
                            <p className="title summary">Summary Completion</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Diagram Label Completion", "/practicetest/diagramlabelcompletion")}>
=======
=======
>>>>>>> Stashed changes
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Diagram Label Completion", "/practicetest/diagramlabelcompletion", active("Diagram Label Completion"))}>
>>>>>>> Stashed changes
                            <p className="title diagramLabel">Diagram Label Completion</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Short-Answer Questions", "/practicetest/shortanswerquestions")}>
=======
=======
>>>>>>> Stashed changes
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Short-Answer Questions", "/practicetest/shortanswerquestions", active("Short-Answer Questions"))}>
>>>>>>> Stashed changes
                            <p className="title shortAnswer">Short-Answer Questions</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                </div>
            </section>
            <section id="section2">
                <div>
                    <TestDetails show={selectedTitle} isVisible={isVisible} alreadyAnswered={isAnswered} link={frontEndLink} score={isTestDetails.score} totalQuestions={isTestDetails.totalQuestions} band={isBandScore} /*mainResults={isMainResults}*//>
                </div>
            </section>
        </main>
    )
}

export default PTPage
