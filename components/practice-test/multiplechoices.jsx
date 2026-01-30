import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import SideTimer from './timer'
import { useCookies } from 'react-cookie'
import './maintestpage.css'

function MultipleChoices() {

    // used to store and take questions and passages from the backend using Axios HTTP client
    const [cookies] = useCookies(['examinee-cookie'])
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
        return saved ? JSON.parse(saved) : 900})

    // stores passage history when clicking the "back" button array of currentPage serves as an updator of the page
    const currentPassage = passageHistory[currentPage];
    // used to index an array of questions putting the maximum capacity to 4 questions per page
    const questionsPerPage = 4;
    // used as a 'cutter' to 'indexOfFirstQuestion' 
    const indexOfLastQuestion = (currentPage + 1) * questionsPerPage;
    // used to index the very first question after a "Next Page" removing the last question from the equation 
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    // used to print out current questions from "allQuestions" hook (remember it was intercepted by setAllQuestions at Axios call line 31) Excluding those that have been "sliced"
    const currentQuestions = allQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    const questionNumberStart = indexOfFirstQuestion;
    const questionNumberEnd = indexOfLastQuestion;
    // immediate test collecting
    useEffect(() => {
        if (passageHistory.length === 0) {
        axios
            // to intercept calls from '/hello' path
            .post('/practicetestroute/multiplechoices')
            .then((res) => {
                // console.log for debugging what questions has been received
                console.log("Number of question received", res.data.questions.length);
                console.log("Questions Array:", res.data.questions);
                // also to intercept data (the passages)
                // to take and store questions received from the backend/database
                setAllQuestions(res.data.questions);
                setPassageHistory([res.data]);
            })
            .catch((err) => {console.error(err)})
        }
    }, []) 

    // immediat3e sessionStorage collecting
    useEffect(() => {
        sessionStorage.setItem("Answer", JSON.stringify(userAnswers));
        sessionStorage.setItem("Font Size", fontSize);
        sessionStorage.setItem("Passage History", JSON.stringify(passageHistory));
        sessionStorage.setItem("Page History", JSON.stringify(currentPage));
        sessionStorage.setItem("Questions History", JSON.stringify(allQuestions));
        sessionStorage.setItem("Timer remain", time)
    }, [userAnswers, fontSize, currentPage, allQuestions, passageHistory, time]);

    const userChoiceClick = (questionId, choiceValue) => {
        // used to save user choices (answers) even if the page is moved
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: choiceValue
        }))

    }

    const increaseFontSize = () => {
        if (fontSize == 40) {
            return;
        }
        setFontSize(prevSize => prevSize + 2);
    }

    const defaultFontSize = () => {
        setFontSize(20)
    }

    const decreaseFontSize = () => {
        if (fontSize == 10) {
            return;
        }
        setFontSize(prevSize => prevSize - 2);
    }

    const handleNextPage = () => {

        const totalLimit = 10;

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
            axios.post('/practicetestroute/multiplechoices')
                .then((res) => {
                    setAllQuestions(prevQuestions => {
                        const combined = [...prevQuestions, ...res.data.questions]
                        return combined.length > totalLimit ? combined.slice(0, totalLimit) : combined;
                    });

                    setPassageHistory(prev => [...prev, res.data]); 
                    setCurrentPage(prevPage => prevPage + 1);
                })
                .catch((err) => console.error(err));
    }

    if (allQuestions.length === 0) return <h1>Loading...</h1>

    const sendUserAnswers = () => {
        
        const submissionData = {
            examinee: cookies['examinee-cookie'],
            answers: userAnswers,
            data: new Date()
        };
        
        axios
            .post('/practicetestroute/multiplechoices', submissionData)
            .then((res) => {
                if (res.status == 200) {
                    window.location.replace('/maintest/examsubmitted');
                    sessionStorage.removeItem("Answer")
                    sessionStorage.removeItem("Font Size")
                    sessionStorage.removeItem("Passage History")
                    sessionStorage.removeItem("Page History")
                    sessionStorage.removeItem("Questions History")
                    sessionStorage.removeItem("Timer remain")
                }
            })
            .catch((err) => {
                alert("Submission failed. Please check your internet and try again.")
                console.error(err)});
    }

    return (
        <main className='main-maintest'>
            {/* This is the sidebar, where the timer resides */}
            <section className='sidebar'>
                <div>
                    <h1 className='name'>Readify</h1>
                </div>
                <div className='timer-component'>
                    <h3 className='sidetimer-h2'><SideTimer time={time} setTime={setTime}/></h3>
                </div>
                <div className='warning-tab'>
                    <p className='warning-text'>Warning! Questions are Randomized. Multiple<br /> tab changes can result in exam <br />termination. </p>
                </div>
            </section>
            <div className='section-flex'>
                <section className='testing-flex'>
                    <div className='title-div'>
                        {/* This is the exam category*/}
                        <h1 className='h1-title-div'>{currentPassage?.testTitle}</h1>
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
                        {/* This is the passage title */}
                        <div className='test-title'>
                            <>{currentPassage?.title}</>
                        </div>
                        {/* This is the passage link */}
                        <div className='test-reference'>
                            <>{currentPassage?.linkReference}</>
                        </div>
                        {/* This is the passage text/content */}
                        <div className='test-passage'>
                            <p style={{fontSize: `${fontSize}px`}}>{currentPassage?.passage}</p>
                        </div>
                    </div>
                    <section className='questions-side'>
                        <div>
                            <div>
                                <b><p className='p-questionRange'>Questions {questionNumberStart + 1}{questionNumberEnd <= 10 ? `-${questionNumberEnd}` : ''}</p></b>
                                <p className='p-description'>{currentPassage?.description}</p>
                                <div className='question-container'>
                                    {/* map loops over the array of question to determine how many questions does the current page have */}
                                    {currentQuestions.map((q, index) => (
                                        // the question container - keys make the array of questions individually unique based on the "id" from the backend
                                        <div className='question-block' key={q.id || index}>
                                            {/*  */} 
                                            <p className='questions'><strong>{indexOfFirstQuestion + index + 1}.</strong> {q.text || q.questionText}</p>
                                            <div className='options-list'>
                                                {(q.options || q.data).map((opt, index2) => (
                                                    <React.Fragment key={opt}>
                                                        <button
                                                            className={`${userAnswers[q.id || q.questionNumber] === opt ? 'active-opt': 'opt-btn'}`}
                                                            onClick={() => userChoiceClick(q.id || q.questionNumber, opt)}
                                                        >
                                                            {String.fromCharCode(65 + index2)}. {opt}
                                                        </button>
                                                        <br/>
                                                    </React.Fragment>
                                                ))}
                                            </div>
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

export default MultipleChoices;
