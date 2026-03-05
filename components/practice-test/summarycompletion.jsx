import React, { useState, useEffect } from 'react';
import SideTimer from '../main-components/timer';
import { useNavigate } from 'react-router-dom';
import './practicetestpage.css';

function SummaryCompletion() {

    const [currentPassage, setCurrentPassage] = useState(null);
    const [detailedResults, setDetailedResults] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [fontSize, setFontSize] = useState(20);
    const [time, setTime] = useState(300);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const testType = 8;
    const testDesignation = false;

    const navigate = useNavigate();

    // ✅ FETCH PRACTICE TYPE 8
    useEffect(() => {
        fetch(`/start-random-exam?designation=${testDesignation}&type=${testType}`)
            .then(res => res.json())
            .then(data => {
                if (data.data && data.data.length > 0) {
                    setCurrentPassage(data.data[0]);
                }
            })
            .catch(err => console.error("Fetch error:", err));
    }, []);

    // Font controls
    const increaseFontSize = () => fontSize < 40 && setFontSize(prev => prev + 2);
    const decreaseFontSize = () => fontSize > 10 && setFontSize(prev => prev - 2);
    const defaultFontSize = () => setFontSize(20);

    // Handle typing
    const handleInputChange = (questionIndex, value) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
    };

    // ✅ SUBMIT PRACTICE
    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {

            const submissionData = [{
                passageId: currentPassage.passageId,
                answers: currentPassage.questions.map((_, idx) =>
                    (userAnswers[idx] || "").trim()
                )
            }];

            const response = await fetch('/submit-results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionData,
                    testType,
                    testDesignation
                }),
            });

            if (!response.ok)
                throw new Error(`Server returned ${response.status}`);

            const data = await response.json();

            if (data.status === 'success') {

                const results = currentPassage.questions.map((q, idx) => ({
                    questionNumber: q.questionNumber,
                    questionText: q.questionText,
                    selectedAnswer: userAnswers[idx] || "",
                    correctAnswer: q.correctAnswer || q.data?.correctAnswer,
                    explanation: q.answerExplanation || q.data?.answerExplanation
                }));

                setDetailedResults(results);
                setIsSubmitted(true);
            }

        } catch (err) {
            console.error("Submission failed:", err);
            alert("Submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentPassage) return <h1>Loading...</h1>;

    return (
        <main className='main-maintest'>

            {/* SIDEBAR */}
            <section className='sidebar'>
                <h1 className='name'>Readify</h1>

                <div className='timer-component'>
                    <SideTimer time={time} setTime={setTime} />
                </div>

                <div className='warning-tab'>
                    <p className='warning-text'>
                        Practice Mode
                    </p>
                </div>
            </section>

            <div className='section-flex'>

                {/* LEFT SIDE */}
                <div className='passage-view'>
                    <h2 className='test-title'>{currentPassage.passageTitle}</h2>
                    <p className='test-reference'>{currentPassage.passageSource}</p>

                    <div className='test-passage'>
                        <p style={{ fontSize: `${fontSize}px` }}>
                            {currentPassage.passage}
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <section className='questions-side'>
                    <div className='view-size-buttons'>
                        <center>
                            <p>Font Size Controls</p>
                            <button onClick={decreaseFontSize}>-</button>
                            <button onClick={defaultFontSize}> o </button>
                            <button onClick={increaseFontSize}>+</button>
                        </center>
                    </div>
                    <div className="instructions">
                        <h3 className='instructions__heading'>Instructions:</h3>
                        <ul className="instructions__list">
                            <li className="instructions__item">Complete the summary below.
                            </li>
                            <li className="instructions__item">Choose NO MORE THAN TWO WORDS from the passage for each answer.
                            </li>
                            <li className="instructions__item">Type your answers in boxes 1–4.
                            </li>

                        </ul>
                    </div>
                    <b>
                        <p className='p-questionRange'>
                            Questions 1-{currentPassage.questions.length}
                        </p>
                    </b>

                    {/* Summary Text */}
                    <div className='summary-block'>
                        <p className='summary-font'>
                            {currentPassage.questions[0].questionText}
                        </p>
                    </div>

                    <div className='question-container'>

                        {!isSubmitted ? (

                            currentPassage.questions.map((q, idx) => {

                                const typedAnswer = userAnswers[idx] || '';

                                return (
                                    <div className='question-block-summary' key={idx}>

                                        <p className='questions-summary'>
                                            <strong>{q.questionNumber}.</strong>
                                        </p>

                                        <input
                                            type="text"
                                            className='answer-input-summary'
                                            value={typedAnswer}
                                            onChange={(e) =>
                                                handleInputChange(idx, e.target.value)
                                            }
                                        />

                                    </div>
                                );
                            })

                        ) : (

                            detailedResults.map((result, idx) => (
                                <div className='question-block-summary' key={idx}>

                                    <p className='questions-summary'>
                                        <strong>{result.questionNumber}.</strong>
                                    </p>

                                    <p><b>Your Answer:</b> {result.selectedAnswer || "No answer"}</p>
                                    <p><b>Correct Answer:</b> {result.correctAnswer}</p>
                                    <p><b>Explanation:</b> {result.explanation}</p>

                                    <hr />
                                </div>
                            ))

                        )}

                    </div>

                    <div className='next-back-buttons'>

                        {!isSubmitted ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className='submit-btn-test'
                            >
                                Submit Test
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/home')}
                                className='submit-btn-test'
                            >
                                Return to Dashboard
                            </button>
                        )}

                    </div>

                </section>
            </div>
        </main>
    );
}

export default SummaryCompletion;