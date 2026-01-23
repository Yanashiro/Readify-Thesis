import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import SideTimer from './timer';
import './maintestpage.css';

function IdentifyingWritersViews() {

    const [userAnswers, setUserAnswers] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [allQuestions, setAllQuestions] = useState([]);
    const [passageHistory, setPassageHistory] = useState([]);

    // stores passage history when clicking the "back" button array of currentPage serves as an updator of the page, see line 84
    const currentPassage = passageHistory[currentPage];
    // used to index an array of questions putting the maximum capacity to 3 questions per page
    const questionsPerPage = 3;
    // used as a 'cutter' to 'indexOfFirstQuestion' 
    const indexOfLastQuestion = (currentPage + 1) * questionsPerPage;
    // used to index the very first question after a "Next Page" removing the last question from the equation 
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    // used to print out current questions from "allQuestions" hook (remember it was intercepted by setAllQuestions at Axios call line 31) Excluding those that have been "sliced"
    const currentQuestions = allQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    // initial request of data from the backend
    useEffect(() => {
        axios
            .post('/maintestroute/hello')
            .then((res) => {
                console.log("Number of question received", res.data.questions.length);
                console.log("Questions Array:", res.data.questions);
                // taking all questions from the randomizer (JSON)
                setAllQuestions(res.data.questions);
                // taking important details (JSON), set to passageHistory
                setPassageHistory([res.data]);
            })
            .catch((err) => console.error(err));
    }, [])

    const userChoiceClick = (questionId, choiceValue) => {
        // used to save user choices (answers) even if the page is moved
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: choiceValue
        }))
    }

    const handleNextPage = () => {

        const totalLimit = 10;

        if (passageHistory.length > currentPage + 1) {
            // if the length of passageHistory is still greater than the currentPage that adds by "Next Page"
            // then allow "Next Page" functionality and return 0, otherwise do skip this step;
            setCurrentPage(prev => prev + 1);
            return; // function stopper
        }

        if (allQuestions.length >= totalLimit) { //apply >= if need exactly 10
            // if length of allQuestions array is greater than variable totalLimit, function returns nothing
            return; // stops the function
        }
            axios.post('/maintestroute/hello')
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

    return (
        <>
        <main className='main-maintest'>
            {/* This is the sidebar, where the timer resides */}
            <section className='sidebar'>
                <div>
                    <h1 className='name'>Readify</h1>
                </div>
                <div className='timer-component'>
                    <h3 className='sidetimer-h2'><SideTimer /></h3>
                </div>
                <div className='warning-tab'>
                    <p className='warning-text'>Warning! Multiple<br /> tab changes can result in exam <br />termination</p>
                </div>
            </section>
            <div className='section-flex'>
                <section className='testing-flex'>
                    <div className='title-div'>
                        {/* This is the exam category*/}
                        <h1 className='h1-title-div'>{currentPassage?.testTitle}</h1>
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
                            <>{currentPassage?.passage}</>
                        </div>
                    </div>
                    <section className='questions-side'>
                        <div>
                            <div>
                                <b><p className='p-questionRange'>{currentPassage?.questionNoRange}</p></b>
                                <p className='p-description'>{currentPassage?.description}</p>
                                <div className='question-container'>
                                    {/* map loops over the array of question to determine how many questions does the current page have */}
                                    {currentQuestions.map((q, index) => (
                                        // the question container - keys make the array of questions individually unique based on the "id" from the backend
                                        <div className='question-block' key={q.id || index}>
                                            {/*  */} 
                                            <p className='questions'><strong>{indexOfFirstQuestion + index + 1}.</strong> {q.text || q.questionText}</p>
                                            <div className='options-list'>
                                                {(q.options || q.data).map((opt) => (
                                                    <React.Fragment key={opt}>
                                                        <button
                                                            className={`${userAnswers[q.id || q.questionNumber] === opt ? 'active-opt': 'opt-btn'}`}
                                                            onClick={() => userChoiceClick(q.id || q.questionNumber, opt)}
                                                        >
                                                            {opt}
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
                                        <button onClick={() => console.log("Final Answers:", userAnswers)} className='submit-btn-test'>Submit Test</button>
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
        </>
    )
}

export default IdentifyingWritersViews;
