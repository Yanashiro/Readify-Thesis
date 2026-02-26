import React, { useEffect, useState } from 'react';
import './maintest.css';
import axios from 'axios';
import lockTest from '../../images/locktest.png'
import { Link } from 'react-router-dom';

function TestDetails({show, isVisible, link, alreadyAnswered, score, totalQuestions, band /*mainResults*/}) {
    
    if (!isVisible || !show) return null;
    
    if (alreadyAnswered === false) {
    return (
        <> 
            <div className="test-details-container">
                <div className="test-Title-Div">
                    <h3 className="test-Title">{show}:</h3>
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
                        <Link to={link} id="start-Test"><p id="just-style">Start Test</p></Link>
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
                        <p>Test Done <img src={lockTest} width={"10px"} height={"10px"}></img></p>
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
    return;
}

function MTPage() {

    const [isVisible, setIsVisible] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [frontEndLink, setFrontEndLink] = useState("");
    const [isTestDetails, setTestDetails] = useState(0);
    const [isBandScore, setBandScore] = useState(0);
    //let [isCompleted, setCompleted] = useState("");
    //const [isMainResults, setMainResults] = useState({});
    const [isAnswered, setItemAnswered] = useState(false);

    // This function now handles everything when a button is clicked
    const handleButtonClick = (title, link) => {

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
        axios
            // change this post route if needed
            .get('/test-selection', {params: queryParams, withCredentials: true})
            .then((res) => {
                // Update all states with the response from the backend
                //setCompleted(res.data.status);
                setTestDetails(res.data);
                setBandScore(res.data.band);
                //setMainResults(res.data.calculations);
                
                // update the status that TestDetails uses to switch views (IF/Else statement)
                setItemAnswered(res.data.status); 
            })
            .catch((err) => console.error("Error retrieving data:", err));
    };

    // Keep the initial load status check
    useEffect(() => {

        axios
            // change t his get route if needed
            .get('/test-selection', { withCredentials: true })
            .then((res) => {
                //setCompleted(res.data.status);
                setTestDetails(res.data);
                setBandScore(res.data.band);
                //setMainResults(res.data);
                setItemAnswered(res.data.status);
            })
            .catch((err) => console.error(err));
    }, [])


    return (
        <main className='maintest-main'>
            <section id="section1">
                <div className='maintest-title'>
                    <h1 className='main-test-h1'>Main Test</h1>
                </div>
                <div>
                    <div className='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Multiple Choice", "/maintest/multiplechoices")} >
                            <p className="title multipleChoice">Multiple Choice</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Identifying Information", "/maintest/identifyinginformation")} >
                            <p className="title identifyingInfo">Identifying Information (True/False/NotGiven)</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Identifying Writer's Views", "/maintest/identifyingwritersviews")}>
                            <p className="title identifyingView">Identifying writer's views/claims (Yes/No/Not given)</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Information", "/maintest/matchinginformation")}>
                            <p className="title matchingInfo">Matching Information</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Headings", "/maintest/matchingheadings")}>
                            <p className="title matchingHead">Matching Headings</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Features", "/maintest/matchingfeatures")}>
                            <p className="title matchingFeat">Matching Features</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Sentence Endings", "/maintest/matchingsentenceendings")}>
                            <p className="title matchingSent">Matching Sentence Endings</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Sentence Completion", "/maintest/sentencecompletion")}>
                            <p className="title sentenceComp">Sentence Completion</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Summary Completion", "/maintest/summarycompletion")}>
                            <p className="title summary">Summary Completion</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Diagram Label Completion", "/maintest/diagramlabelcompletion")}>
                            <p className="title diagramLabel">Diagram Label Completion</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div className='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Short-Answer Questions", "/maintest/shortanswerquestions")}>
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

export default MTPage
