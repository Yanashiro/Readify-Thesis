import React, { useState, useEffect } from 'react';
import SideTimer from '../main-components/timer';
import { useNavigate } from 'react-router-dom';
import './practicetestpage.css';

function MatchingInformation() {

    const [currentPassage, setCurrentPassage] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [detailedResults, setDetailedResults] = useState([]);
    const [fontSize, setFontSize] = useState(20);
    const [time, setTime] = useState(300);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const testType = 3;
    const testDesignation = false;

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/start-random-exam?designation=${testDesignation}&type=${testType}`)
            .then(res => res.json())
            .then(data => {
                if (data.data && data.data.length > 0) {
                    setCurrentPassage(data.data[0]);
                }
            })
            .catch(err => console.error(err));
    }, []);

    // ✅ FONT CONTROLS
    const increaseFontSize = () => fontSize < 40 && setFontSize(prev => prev + 2);
    const decreaseFontSize = () => fontSize > 10 && setFontSize(prev => prev - 2);
    const defaultFontSize = () => setFontSize(20);

    // ✅ Parse Paragraphs A–Z
    const parseParagraphs = (passageText) => {
        const regex = /([A-Z])\.\s([\s\S]*?)(?=\n\n[A-Z]\.|$)/g;
        const matches = [];
        let match;

        while ((match = regex.exec(passageText)) !== null) {
            matches.push({
                letter: match[1],
                text: match[2].trim()
            });
        }

        return matches;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const submissionData = [{
                passageId: currentPassage.passageId,
                answers: currentPassage.questions.map((_, idx) => userAnswers[idx] || "")
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

            if (!response.ok) throw new Error("Submission failed");

            const data = await response.json();

            if (data.status === 'success') {

                const results = currentPassage.questions.map((q, idx) => ({
                    questionNumber: q.questionNumber,
                    questionText: q.questionText,
                    selectedAnswer: userAnswers[idx] || "",
                    correctAnswer: q.correctAnswer,
                    explanation: q.answerExplanation
                }));

                setDetailedResults(results);
                setIsSubmitted(true);
            }

        } catch (err) {
            console.error(err);
            alert("Submission failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentPassage) return <h1>Loading...</h1>;

    const parsedParagraphs = parseParagraphs(currentPassage.passage);

    return (
        <main className='main-maintest'>

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

                <section className='testing-flex'>
                    <div className='title-div'>
                        <h1 className='h1-title-div'>
                            Matching Information
                        </h1>
                    </div>
                </section>

                <div className='two-sections'>

                    {/* PASSAGE */}
                    <div className='passage-view'>
                        <div className='test-title'>
                            {currentPassage.passageTitle}
                        </div>

                        <div className='test-reference'>
                            {currentPassage.passageSource}
                        </div>

                        <div className='test-passage'>
                            {parsedParagraphs.map(p => (
                                <div
                                    key={p.letter}
                                    className="paragraph-block"
                                    style={{ fontSize: `${fontSize}px` }}
                                >
                                    <strong>{p.letter}.</strong> {p.text}
                                    <br /><br />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* QUESTIONS */}
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
                                <li className="instructions__item">In which paragraph (A–E) is the following information found?
                                </li>
                                <li className="instructions__item">Letters may be used more than once.
                                </li>
                            </ul>
                        </div>
                        <div className='question-container'>

                            {!isSubmitted ? (

                                currentPassage.questions.map((q, idx) => {

                                    const selectedAnswer = userAnswers[idx] || '';

                                    return (
                                        <div className='question-block' key={q.questionNumber || idx}>

                                            <p
                                                className='questions'
                                                style={{ fontSize: `${fontSize}px` }}
                                            >
                                                <strong>{q.questionNumber}.</strong> {q.questionText}
                                            </p>

                                            <div className='options-list'>
                                                {parsedParagraphs.map(p => {

                                                    const letter = p.letter;

                                                    return (
                                                        <button
                                                            key={`${q.questionNumber}-${letter}`}
                                                            className={
                                                                selectedAnswer === letter
                                                                    ? 'active-opt'
                                                                    : 'opt-btn'
                                                            }
                                                            onClick={() =>
                                                                setUserAnswers(prev => ({
                                                                    ...prev,
                                                                    [idx]: letter
                                                                }))
                                                            }
                                                        >
                                                            {letter}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })

                            ) : (

                                detailedResults.map((result, idx) => (
                                    <div className='question-block' key={idx}>

                                        <p
                                            className='questions'
                                            style={{ fontSize: `${fontSize}px` }}
                                        >
                                            <strong>{result.questionNumber}.</strong> {result.questionText}
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
            </div>
        </main>
    );
}

export default MatchingInformation;