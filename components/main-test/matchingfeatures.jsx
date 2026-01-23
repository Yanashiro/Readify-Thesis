import React from 'react';
import { useState, useEffect } from 'react';
import SideTimer from '../main-components/timer';
import axios from 'axios';
import './maintestpage.css'

function MatchingFeatures() {

    const [userAnswers, setUserAnswers] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [allQuestions, setAllQuestions] = useState([]);
    const [passageHistory, setPassageHistory] = useState([]);
    const [featuresHistory, setFeaturesHistory] = useState({});

    const questionsPerPage = 3;
    const indexOfLastQuestion = (currentPage + 1) * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage; 
    const currentQuestions = allQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    const currentPassage = passageHistory[currentPage];
    const currentFeatures = featuresHistory[currentPage];

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
                setFeaturesHistory([res.data.features]);
            })
            .catch((err) => console.error(err))
    }, [])

    const userWriteDown = (questionId, writeValue) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: writeValue,
        }))
    }

    const handleNextPage = () => {

        const totalLimit = 10;

        if(passageHistory.length > currentPage +  1) {
            setCurrentPage(prev => prev + 1)
            return;
        }
        if(allQuestions.length >= totalLimit) {
            return;
        }
        axios
            .post('/maintestroute/hello')
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
                setFeaturesHistory(prev => [...prev, res.data.features]);
            })
            .catch((err) => console.error(err));
    }

    return (
        <>
        <main className='main-maintest'>
            <section className='sidebar'>
                <div>
                    <h1 className='name'>Readify</h1>
                </div>
                <div className='timer-component'>
                    {/* SideTimer is a component from another jsx file, acting as the standard timer for all tests */}
                    <h3 className='sidetimer-h2'><SideTimer /></h3>
                </div>
                <div className='warning-tab'>
                    <p className='warning-text'>Warning! Multiple<br /> tab changes can result in exam <br />termination</p>
                </div>
            </section>
            <div className='section-flex'>
                <section className='testing-flex'>
                    <div className='title-div'>
                        <h1 className='h1-title-div'>{currentPassage?.testTitle}</h1>
                    </div>
                </section>
                <div className='two-sections'>
                    <div className='passage-view'>
                        <div className='test-title'>
                            <>{currentPassage?.title}</>
                        </div>
                        <div className='test-reference'>
                            <>{currentPassage?.linkReference}</>
                        </div>
                        <div className='test-passage'>
                            <>{currentPassage?.passage}</>
                        </div>
                    </div>
                    <section className='questions-side'>
                        <div>
                            <div>
                                <b><p className='p-questionRange'>{currentPassage?.questionNoRange}</p></b>
                                <p className='p-description'>{currentPassage?.description}</p>
                                <div className='feature-block'>
                                    <p className='features-font'>Features</p>
                                    {currentFeatures?.map((feature, index) => (
                                        <div className='features-item' key={index}>
                                            <p className='currentFeatures-font'>{String.fromCharCode(65 + index)}. {feature}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className='question-container'>
                                    {currentQuestions.map((q, index) => (
                                        <div className='question-block' key={q.id || index}>
                                            <p className='questions'><strong>{indexOfFirstQuestion + index + 1}.</strong> {q.text || q.questionText}</p>
                                            <input 
                                                type='text'
                                                className='answer-input'
                                                placeholder=''
                                                value={userAnswers[q.id || q.questionNumber] || ''}
                                                onChange={(e) => userWriteDown(q.id || q.questionNumber, e.target.value)}
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
                                        <button onClick={() => console.log("Final Answers:", userAnswers)} className='submit-btn-test'>Submit Test</button>
                                    ) : (
                                        <button onClick={handleNextPage}>Next Page</button>
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

export default MatchingFeatures;
