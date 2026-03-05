import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideTimer from '../main-components/timer';
import './maintestpage.css';

function IdentifyingWritersViews() {

    const [allPassages, setAllPassages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPassage, setCurrentPassage] = useState(null);

    // For popup
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    const testType = 5;
    const testDesignation = true;

    const [userAnswers, setUserAnswers] = useState({});
    const [fontSize, setFontSize] = useState(20);
    const [time, setTime] = useState(1080);
    const [showPopup, setShowPopup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ Added submissionCount state
    const [submissionCount, setSubmissionCount] = useState(0);

    const navigate = useNavigate();

    // Fetch TYPE 5
    useEffect(() => {
        fetch(`/start-random-exam?designation=true&type=${testType}`)
            .then(res => {
                if (!res.ok) throw new Error("Server error");
                return res.json();
            })
            .then(data => {
                if (data?.data?.length > 0) {
                    setAllPassages(data.data);
                    setCurrentPassage(data.data[0]);
                }
            })
            .catch(err => console.error("Fetch error:", err));
    }, []);

    useEffect(() => {
        if (allPassages.length > 0) {
            setCurrentPassage(allPassages[currentIndex]);
        }
    }, [currentIndex, allPassages]);

    const increaseFontSize = () => fontSize < 40 && setFontSize(prev => prev + 2);
    const decreaseFontSize = () => fontSize > 10 && setFontSize(prev => prev - 2);
    const defaultFontSize = () => setFontSize(20);

    const handleNextPassage = () => {
        if (currentIndex < allPassages.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePreviousPassage = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const handleAnswerSelect = (questionIndex, option) => {
        const passageId = currentPassage.passageId;

        setUserAnswers(prev => {
            const existing = prev[passageId] || [];
            const updated = [...existing];
            updated[questionIndex] = option;
            return { ...prev, [passageId]: updated };
        });
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const submissionData = allPassages.map(p => ({
                passageId: p.passageId,
                answers: userAnswers[p.passageId] || []
            }));

            const response = await fetch('/submit-results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissionData, testType, testDesignation }),
            });

            if (!response.ok) throw new Error(`Server ${response.status}`);

            const data = await response.json();

            if (data.status === 'success') {
                setTotalCorrect(data.totalCorrect);
                setTotalQuestions(data.totalQuestions);
                setShowPopup(true);
                setUserAnswers({});

            }

            setTimeout(() => {
                window.location.href = '/home';
            }, 3000);

        } catch (err) {
            console.error("Submission failed:", err);
            alert("Submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const typeLabels = {
        5: "Identifying Writer's Views"
    };

    if (!currentPassage) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h1>Loading...</h1>
                <button
                    onClick={() => navigate('/home')}
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                >
                    Back to Home
                </button>
            </div>
        );
    }
    return (
        <main className='main-maintest'>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Test Finished you got {totalCorrect} / {totalQuestions}</h2>
                        <h5>Returning to dashboard...</h5>
                        <button
                            onClick={() => navigate('/home')}
                            style={{
                                marginTop: "20px",
                                padding: "10px 20px",
                                fontSize: "16px",
                                cursor: "pointer"
                            }}
                        >
                            Click here if you aren't redirected.
                        </button>
                    </div>
                </div>
            )}

            <section className='sidebar'>
                <h1 className='name'>Readify</h1>
                <div className='timer-component'>
                    <SideTimer time={time} setTime={setTime} />
                </div>
                <div className='warning-tab'>
                    <p className='warning-text'>
                        Warning! Questions are randomized.
                    </p>
                </div>
            </section>

            <div className='section-main'>
                <h1 className='title'>
                    {typeLabels[currentPassage.testType]}
                </h1>

                <div className='passage'>
                    <div className='test-title'>{currentPassage.passageTitle}</div>
                    <div className='test-reference'>{currentPassage.passageSource}</div>
                    <div className='test-passage'>
                        <p style={{ fontSize: `${fontSize}px` }}>
                            {currentPassage.passage}
                        </p>
                    </div>
                </div>

                <section className='questions'>
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
                            <li className="instructions__item">Read the statements below and choose YES if the statement agrees with the information in the text, NO if it contradicts the text, and NOT GIVEN if there is no information on this.
                            </li>
                        </ul>
                    </div>
                    <b>
                        <p className='p-questionRange'>
                            Questions {currentIndex * 4 + 1}-
                            {currentIndex * 4 + currentPassage.questions.length}
                        </p>
                    </b>

                    <div className='question-container'>
                        {currentPassage.questions.map((q, idx) => {
                            const optionsArray = q.options || q.data?.options || [];
                            const passageId = currentPassage.passageId;
                            const selectedAnswer = (userAnswers[passageId] || [])[idx] || '';

                            return (
                                <div key={q.questionNumber || idx}>
                                    <p>
                                        <strong>{currentIndex * 4 + idx + 1}.</strong> {q.questionText}
                                    </p>

                                    {optionsArray.map((opt, optionIdx) => (
                                        <button
                                            key={`${q.questionNumber}-${optionIdx}`}
                                            className={selectedAnswer === opt ? 'active-opt' : 'opt-btn'}
                                            onClick={() => handleAnswerSelect(idx, opt)}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                    </div>

                    <div className='next-back-buttons'>
                        <button
                            onClick={handlePreviousPassage}
                            disabled={currentIndex === 0}
                        >
                            Back
                        </button>

                        <button
                            onClick={handleNextPassage}
                            disabled={isSubmitting}
                        >
                            {currentIndex === allPassages.length - 1 ? 'Submit Test' : 'Next Page'}
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default IdentifyingWritersViews;