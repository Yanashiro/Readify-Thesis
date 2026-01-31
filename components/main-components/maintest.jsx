import React, { useEffect, useState } from 'react';
import './maintest.css';
import axios from 'axios';

function TestDetails({show, isVisible, link, alreadyAnswered, answer, band, mainResults}) {
    
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
                        <li>{answer}/10 Correct Answer</li>
                        <li>Band Score: {band}</li>
                    </ul>
                </div>
                <div id="button-Test-Completed">
                    <div id="button-Design-Completed">
                        <p>Test Done <img width={"10px"} height={"10px"}></img></p>
                    </div>
                </div>
            </div>
            <div className="main-Test-Container">
                <div>
                    <p className="p-test-results">Current Main Test Results:</p>
                </div>
                <div>
                    {mainResults}
                </div>
            </div>
        </div>
        </>
    );
    }
}

function MTPage() {

    const [isVisible, setIsVisible] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [frontEndLink, setFrontEndLink] = useState("");
    const [isCorrectAnswers, setCorrectAnswers] = useState(0);
    const [isBandScore, setBandScore] = useState(0);
    let [isCompleted, setCompleted] = useState("");
    const [isMainResults, setMainResults] = useState(0);
    const [isAnswered, setItemAnswered] = useState(false);

    const handleButtonClick = (title, link, isAlreadyAnswered) =>
    {      
        setSelectedTitle(title);

        axios
            .post('/retrieveData', selectedTitle)
            .then((res) => {
                setCompleted(res.data.status)
                setCorrectAnswers(res.data.answers)
                setBandScore(res.data.band)
                setMainResults(res.data)
            })
            .catch((err) => console.error(err))
        
        setIsVisible(!isVisible);
        setFrontEndLink(link);
        active(isAlreadyAnswered)
    }

    const active = (isExamCompleted, answer, band, mainResults) => {

        isExamCompleted(isCompleted);
        isCorrectAnswers(answer);
        isBandScore(band);
        isMainResults(mainResults);
        return (
            setItemAnswered(isCompleted) //set isCompleted;
        )    
    }

    useEffect(() => {
        axios
            .get('/status') //get reading comprehension test score here
            .then((res) => {
                setCompleted(res.data.status)
                setCorrectAnswers(res.data.answers)
                setBandScore(res.data.band)
                setMainResults(res.data)
            })
            .catch((err) => {
                console.error(err)
            });
    }, []);

    return (
        <main className='maintest-main'>
            <section id="section1">
                <div>
                    <h1>Main Test</h1>
                </div>
                <div>
                    <div class='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Multiple Choice", "/maintest/multiplechoices", active("Multiple Choice"))} >
                            <p className="title multipleChoice">Multiple Choice</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div class='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Identifying Information", "/maintest/identifyinginformation", active("Identifying Information"))} >
                            <p className="title identifyingInfo">Identifying Information (True/False/NotGiven)</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div class='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Identifying Writer's Views", "/maintest/identifyingwritersviews", active("Identifying Writer's Views"))}>
                            <p className="title identifyingView">Identifying writer's views/claims (Yes/No/Not given)</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div class='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Information", "/maintest/matchinginformation", active("Matching Information"))}>
                            <p className="title matchingInfo">Matching Information</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div class='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Headings", "/maintest/matchingheadings", active("Matching Headings"))}>
                            <p className="title matchingHead">Matching Headings</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div class='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Features", "./root.jsx", active("Matching Features"))}>
                            <p className="title matchingFeat">Matching Features</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div class='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Matching Sentence Endings", "./root.jsx", active("Matching Sentence Endings"))}>
                            <p className="title matchingSent">Matching Sentence Endings</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div class='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Sentence Completion", "./root.jsx", active("Sentence Completion"))}>
                            <p className="title sentenceComp">Sentence Completion</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div class='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Summary/Note/table/Flow-chart Comparison", "./root.jsx", active("Summary/Note/table/Flow-chart Comparison"))}>
                            <p className="title summary">Summary/Note/table/Flow-chart Comparison</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div class='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Diagram Label Completion", "./root.jsx", active("Diagram Label Completion"))}>
                            <p className="title diagramLabel">Diagram Label Completion</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                    <div class='buttons'>
                        <button className="main-test-buttons" onMouseDown={() => handleButtonClick("Short-Answer Questions", "./root.jsx", active("Short-Answer Questions"))}>
                            <p className="title shortAnswer">Short-Answer Questions</p>
                            <p className='main-arrow'>〉</p>
                        </button>
                    </div>
                </div>
            </section>
            <section id="section2">
                <div>
                    <TestDetails show={selectedTitle} isVisible={isVisible} alreadyAnswered={isAnswered} link={frontEndLink} answer={isCorrectAnswers} band={isBandScore} mainResults={isMainResults}/>
                </div>
            </section>
        </main>
    )
}

export default MTPage
