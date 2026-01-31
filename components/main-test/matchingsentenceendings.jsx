import React from 'react';
import { useState, useEffect } from 'react';
import SideTimer from './timer';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import './maintestpage.css'

function MatchingSentenceEndings() {

    const [cookies] = useCookies(['examinee-cookie'])
    const [userAnswers, setUserAnswers] = useState(() => {
        const saved = sessionStorage.getItem("Answer");
        return saved ? JSON.parse(saved) : {}});
    const [currentPage, setCurrentPage] = useState(() => {
        const saved = sessionStorage.getItem("Page History");
        return saved ? JSON.parse(saved) : 0});
    const [allQuestions, setAllQuestions] = useState(() => {
        const saved = sessionStorage.getItem("Questions History");
        return saved ? JSON.parse(saved) : []});
    const [passageHistory, setPassageHistory] = useState(() => {
        const saved = sessionStorage.getItem("Passage History");
        return saved ? JSON.parse(saved) : []});
    const [endingsHistory, setEndingsHistory] = useState(() => {
        const saved = sessionStorage.getItem("Endings History")
        return saved ? JSON.parse(saved) : {}});
    const [fontSize, setFontSize] = useState(() => {
        const saved = sessionStorage.getItem("Font Size");
        return saved ? JSON.parse(saved) : 20});;
    const [time, setTime] = useState(() => {
        const saved = sessionStorage.getItem("Timer remain");
        return saved ? JSON.parse(saved) : 900})

    const questionsPerPage = 4;
    const indexOfLastQuestion = (currentPage + 1) * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage; 
    const currentQuestions = allQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    const currentPassage = passageHistory[currentPage];
    const currentEndings = endingsHistory[currentPage];
    const questionNumberStart = indexOfFirstQuestion;
    const questionNumberEnd = indexOfLastQuestion;

    useEffect(() => {
        if (passageHistory.length === 0) {
        axios
            .post('/maintestroute/matchingsentenceendings')
            .then((res) => {
                console.log("Number of question received", res.data.questions.length);
                console.log("Questions Array:", res.data.questions);
                // taking all questions from the randomizer (JSON)
                setAllQuestions(res.data.questions);
                // taking important details (JSON), set to passageHistory
                setPassageHistory([res.data]);
                setEndingsHistory([res.data.endings]);
            })
            .catch((err) => console.error(err))
        }
    }, [])

    // immediat3e sessionStorage collecting
    useEffect(() => {
        sessionStorage.setItem("Answer", JSON.stringify(userAnswers));
        sessionStorage.setItem("Font Size", fontSize);
        sessionStorage.setItem("Passage History", JSON.stringify(passageHistory));
        sessionStorage.setItem("Endings History", JSON.stringify(endingsHistory));
        sessionStorage.setItem("Page History", JSON.stringify(currentPage));
        sessionStorage.setItem("Questions History", JSON.stringify(allQuestions));
        sessionStorage.setItem("Timer remain", time)
    }, [userAnswers, fontSize, currentPage, allQuestions, passageHistory, time, endingsHistory]);

    const userChoiceClick = (questionId, choiceValue) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: choiceValue,
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

        const totalLimit = 10;

        if(passageHistory.length > currentPage +  1) {
            setCurrentPage(prev => prev + 1)
            return;
        }
        if(allQuestions.length >= totalLimit) {
            return;
        }
        axios
            .post('/maintestroute/matchingsentenceendings')
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
                setEndingsHistory(prev => [...prev, res.data.endings]);
            })
            .catch((err) => console.error(err));
    }

    const sendUserAnswers = () => {
        
        const submissionData = {
            examinee: cookies['examinee-cookie'],
            answers: userAnswers,
            data: new Date()
        };
        
        axios
            .post('/maintestroute/matchingsentenceendings', submissionData)
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
        <>
        <main className='main-maintest'>
            <section className='sidebar'>
                <div>
                    <h1 className='name'>Readify</h1>
                </div>
                <div className='timer-component'>
                    {/* SideTimer is a component from another jsx file, acting as the standard timer for all tests */}
                    <h3 className='sidetimer-h2'><SideTimer time={time} setTime={setTime}/></h3>
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
                            <>{currentPassage?.title}</>
                        </div>
                        <div className='test-reference'>
                            <>{currentPassage?.linkReference}</>
                        </div>
                        <div className='test-passage'>
                            <p style={{fontSize: `${fontSize}px`}}>{currentPassage?.passage}</p>
                        </div>
                    </div>
                    <section className='questions-side'>
                        <div>
                            <div>
                                <b><p className='p-questionRange'>Questions {questionNumberStart + 1}{questionNumberEnd <= 10 ? `-${questionNumberEnd}` : ''}</p></b>
                                <p className='p-description'>{currentPassage?.description}</p>
                                <div className='feature-block'>
                                    <p className='features-font'>Endings</p>
                                    {currentEndings?.map((endings, index) => (
                                        <div className='features-item' key={index}>
                                            <p className='currentFeatures-font'> {endings.label}. {endings.name}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className='question-container'>
                                    {currentQuestions.map((q, index) => (
                                        <div className='question-block' key={q.id || index}>
                                            <p className='questions'><strong>{indexOfFirstQuestion + index + 1}.</strong> {q.text || q.questionText}</p>
                                            <div className='options-list display-flex'>
                                                {(q.options || q.data).map((opt, index2) => (
                                                    <React.Fragment key={opt}>
                                                        <button
                                                            className={`${userAnswers[q.id || q.questionNumber] === opt ? 'active-opt-letters': 'opt-btn-letters'}`}
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
        </>
    )
}

export default MatchingSentenceEndings;
