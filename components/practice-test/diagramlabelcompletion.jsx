import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import SideTimer from '../main-components/timer';
import { useNavigate } from 'react-router-dom';
import './practicetestpage.css'

function DiagramLabelCompletion() {

    // remember, function uses parameters
    // useState uses initiators and temporarily stores values, thats why they need initiators and "..." to store its current local history
    const [showPopup, setShowPopup] = useState(false);
    const [userAnswers, setUserAnswers] = useState(() => {
        const saved = sessionStorage.getItem("Answer");
        return saved ? JSON.parse(saved) : {}});
    const [allQuestions, setAllQuestions] = useState(() => {
        const saved = sessionStorage.getItem("Questions History");
        return saved ? JSON.parse(saved) : []});
    const [currentPage, setCurrentPage] = useState(() => {
        const saved = sessionStorage.getItem("Page History");
        return saved ? JSON.parse(saved) : 0});
    const [passageHistory, setPassageHistory] = useState(() => {
        const saved = sessionStorage.getItem("Passage History");
        return saved ? JSON.parse(saved) : []});
    const [fontSize, setFontSize] = useState(() => {
        const saved = sessionStorage.getItem("Font Size");
        return saved ? JSON.parse(saved) : 20});
    const [time, setTime] = useState(() => {
        const saved = sessionStorage.getItem("Timer remain");
        return saved ? JSON.parse(saved) : 540})
    const [passageId, setPassageId] = useState(() => {
        const saved = sessionStorage.getItem("Passage ID");
        return saved ? JSON.parse(saved) : null;
    })
    
    // stores passage history when clicking the "back" button array of currentPage serves as an updator of the page, see line 84
    const currentPassage = passageHistory[currentPage];
    // used to index an array of questions putting the maximum capacity to 3 questions per page
    const questionsPerPage = 3;
    // used as a 'cutter' to 'indexOfFirstQuestion' 
    const indexOfLastQuestion = (currentPage + 1) * questionsPerPage;
    // used to index the very first question after a "Next Page" removing the last question from the equation 
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    // used to print out current questions from "allQuestions" hook (remember it was intercepted by setAllQuestions at Axios call line 31) Excluding those that have been "sliced"
    const currentQuestions = (allQuestions || []).slice(indexOfFirstQuestion, indexOfLastQuestion);
    const questionNumberStart = indexOfFirstQuestion;
    const questionNumberEnd = indexOfLastQuestion;

    // initial request of data from the backend
    useEffect(() => {
        if (passageHistory.length === 0) {

        const queryParams = {
            designation: 'false',
            type: 11
        }

        axios
            .get('/start-random-exam', {params: queryParams})
            .then((res) => {
                console.log("Backend response:", res.data)
                console.log("Number of question received", res.data.questions.length);
                console.log("Questions Array:", res.data.questions);
                // taking all questions from the randomizer (JSON)
                setAllQuestions(res.data.test.questions);
                // taking important details (JSON), set to passageHistory
                setPassageHistory(res.data.test);
                setPassageId(res.data.test.passageId);
            })
            .catch((err) => console.error(err));
        }
    }, [])

    // immediat3e sessionStorage collecting
    useEffect(() => {
        sessionStorage.setItem("Answer", JSON.stringify(userAnswers));
        sessionStorage.setItem("Font Size", fontSize);
        sessionStorage.setItem("Passage History", JSON.stringify(passageHistory));
        sessionStorage.setItem("Page History", JSON.stringify(currentPage));
        sessionStorage.setItem("Questions History", JSON.stringify(allQuestions));
        sessionStorage.setItem("Passage ID", JSON.stringify(passageId));
    }, [userAnswers, fontSize, currentPage, allQuestions, passageHistory, passageId]);

    useEffect(() => {
        sessionStorage.setItem("Timer remain", time)
    }, [time])

    const userWriteDown = (questionId, writeValue) => {
        // setUserAnswers is initiated as "prev" parameter that saves previously answered questions 
        // before adding new questions and new answers made by the user
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: writeValue
        }))
    }
    // increase font size of passage
    const increaseFontSize = () => {
        if (fontSize == 40) {
            return;
        }
        setFontSize(prevSize => prevSize + 2);
    }
    // return to default font size in passage
    const defaultFontSize = () => {
        setFontSize(20)
    }
    // decrease font size of passage
    const decreaseFontSize = () => {
        if (fontSize == 10) {
            return;
        }
        setFontSize(prevSize => prevSize - 2);
    }

    const handleNextPage = () => {
        // hard limit for questions
        const totalLimit = 6;

        if (passageHistory.length > currentPage + 1) {
            // if the length of passageHistory is still greater than the currentPage that adds by "Next Page"
            // then allow "Next Page" functionality and return 0, otherwise do skip this step;
            setCurrentPage(prev => prev + 1);
            return; // function stopper
        }

        if (allQuestions.length > totalLimit) { //apply >= if need exactly 10
            // if length of allQuestions array is greater than variable totalLimit, function returns nothing
            return; // stops the function
        }
        /*
        // requesting data from the backend every "Next Page" click
        axios
            .post('/practicetestroute/diagramlabelcompletion', {randomize: true})
            .then((res) => {
                setAllQuestions(prevQuestions => {
                    // setAllQuestions was initiated as prevQuestions parameter "..." means all previous following data, 
                    // it is made as an array because the next questions (by res.data.questions) are the newly randomized 
                    // by the server and needs to be added in the "combined" array that defines setAllQuestions 
                    const combined = [...prevQuestions, ...res.data.questions]
                    // condition: length of combined array must be greater than totalLimit, if yes: remove starting from index 0 to index 10, otherwise return combined array
                    return combined.length > totalLimit ? combined.slice(0, totalLimit) : combined;
                });
                // setCurrentPage is initiated as prevPage and returns itself + 1, the reason
                // you do this over "setCurrentPage + 1" is to save the history of previous pages
                // rather than completely disregarding it after a "Next Page"
                setCurrentPage(prevPage => prevPage + 1);
                // setPassageHistory is declared as prev to store previous history before logging it to passageHistory, then accepting data from the backend
                setPassageHistory(prev => [...prev, res.data]); 
                setPassageHistory(prev => [...prev, res.data.image]);
            })
            .catch((err) => console.error(err))
            */
    }

    const typeLabels = {
        1: "Multiple Choice",
        2: "Matching Features",
        3: "Matching Information",
        4: "Identifying Information",
        5: "Identifying Writer's Views",
        6: "Matching Sentence Endings",
        7: "Matching Headings",
        8: "Summary Completion",
        9: "Short Answer Questions",
        10: "Sentence Completion",
        11: "Diagram Label Completion",
    };

    if (!allQuestions || !passageHistory) return <h1>Loading...</h1>

    const sendUserAnswers = () => {
        
        const submissionData = {
            testType: "Practice",
            testCategory: "Diagram Label Completion",
            submittedAnswers: userAnswers,
            passageId: passageId,
            testDate: new Date()
        };
        
        axios
            .post('/submit-results', submissionData, { withCredentials: true })
            .then((res) => {
                if (res.status == 200) {
                    setShowPopup(true);
                    sessionStorage.removeItem("Answer")
                    sessionStorage.removeItem("Font Size")
                    sessionStorage.removeItem("Passage History")
                    sessionStorage.removeItem("Page History")
                    sessionStorage.removeItem("Questions History")
                    sessionStorage.removeItem("Timer remain")
                    sessionStorage.removeItem("Summary History")
                    sessionStorage.removeItem("Endings History")
                    sessionStorage.removeItem("Features History")
                }
            })
            .catch((err) => {
                alert("Submission failed. Please check your internet and try again.")
                console.error(err)});
    }

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate("/home")
    }

    return (
        <main className='main-maintest'>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Test Finished</h2>
                        <button className="popup-btn" onClick={handleGoBack}>
                            Go back to Main Test
                        </button>
                    </div>
                </div>
            )}
            <section className='sidebar'>
                <div>
                    <h1 className='name'>Readify</h1>
                </div>
                <div className='timer-component'>
                    {/* SideTimer is a component from another jsx file, acting as the standard timer for all tests */}
                    <h3 className='sidetimer-h2'><SideTimer time={time} setTime={setTime}/></h3>
                </div>
                <div className='warning-tab'>
                    <p className='warning-text'>Warning! Questions are Randomized. Multiple<br /> tab changes can result in exam <br />termination.</p>
                </div>
            </section>
            <div className='section-flex'>
                <section className='testing-flex'>
                    <div className='title-div'>
                        <h1 className='h1-title-div'>{typeLabels[currentPassage?.testType]}</h1>
                    </div>
                    <div className='view-size-buttons'>
                        <button className='font-size-btn' onClick={decreaseFontSize}>
                            Decr
                        </button>
                        <button className='font-size-btn' onClick={defaultFontSize}>
                            Default
                        </button>
                        <button className='font-size-btn' onClick={increaseFontSize}>
                            Incr
                        </button>
                    </div>
                </section>
                <div className='two-sections'>
                    <div className='passage-view'>
                        <div className='test-title'>
                            {/* the print out version of the exam passages, "?." is an optional chaining that access the previous history/pages of passages.
                                It also prevents white screen errors because it is accessing an array of previous stored passages. */}
                            <>{currentPassage?.passageTitle}</>
                        </div>
                        <div className='test-reference'>
                            <>{currentPassage?.passageSource}</>
                        </div>
                        <div className='test-image'>
                            <img src={currentPassage?.passageImage}></img>
                        </div>
                        <div className='test-passage'>
                            <p style={{fontSize: `${fontSize}px`}}>{currentPassage?.passage}</p>
                        </div>
                    </div>
                    <section className='questions-side'>
                        <div>
                            <div>
                                <b><p className='p-questionRange'>Questions {questionNumberStart + 1}{questionNumberEnd <= 6 ? `-${questionNumberEnd}` : ''}</p></b>
                                <p className='p-description'>Label the diagram below.</p>
                                <p className='p-description'>{currentPassage?.description}</p>      
                                <div className='question-container'>
                                    {/*  */}
                                    {currentQuestions.map((q, index) => (
                                        <div className='question-block-summary' key={q.questionNumber || index}>
                                            <p className='questions-summary'><strong>{indexOfFirstQuestion + index + 1}.</strong></p>
                                            <input 
                                                type='text'
                                                className='answer-input-summary'
                                                placeholder=''
                                                value={userAnswers[q.questionNumber] || ''}
                                                onChange={(e) => userWriteDown(q.questionNumber, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className='next-back-buttons'>
                                    {currentPage > 0 && (
                                    <React.Fragment>
                                        <button onClick={() => setCurrentPage(prev => prev - 1)} className='back-btn'>Back</button>
                                        <br/>
                                    </React.Fragment>
                                    )}
                                    {indexOfLastQuestion >= 10 ? (
                                        <button onClick={sendUserAnswers} className='submit-btn-test'>Submit Test</button>
                                    ) : (
                                        <button onClick={handleNextPage} className='next-page-btn'>Next Page</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default DiagramLabelCompletion;

