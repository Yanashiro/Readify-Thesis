import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideTimer from '../main-components/timer';
import './maintestpage.css';

function MultipleChoices() {
  const [allPassages, setAllPassages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPassage, setCurrentPassage] = useState(null);

  const testType = 1;
  const testDesignation = true;

  // For popup
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // userAnswers maps passageId -> array of answers (state only)
  const [userAnswers, setUserAnswers] = useState({});
  const [fontSize, setFontSize] = useState(20);
  const [time, setTime] = useState(1080);
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Fetch passages on mount
  useEffect(() => {
    fetch(`/start-random-exam?designation=true&type=${testType}`)
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          // console.log(data.data)
          setAllPassages(data.data);
          setCurrentPassage(data.data[0]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Update current passage when index changes
  useEffect(() => {
    if (allPassages.length > 0) {
      setCurrentPassage(allPassages[currentIndex]);
    }
  }, [currentIndex, allPassages]);

  // Font size controls
  const increaseFontSize = () => fontSize < 40 && setFontSize(prev => prev + 2);
  const decreaseFontSize = () => fontSize > 10 && setFontSize(prev => prev - 2);
  const defaultFontSize = () => setFontSize(20);

  // Navigate passages
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

  // Handle selecting an answer
  const handleAnswerSelect = (questionIndex, option) => {
    const passageId = currentPassage.passageId;
    setUserAnswers(prev => {
      const existing = prev[passageId] || [];
      const updated = [...existing];
      updated[questionIndex] = option;
      return { ...prev, [passageId]: updated };
    });
  };

  // Submit answers to backend
  const [submissionCount, setSubmissionCount] = useState(0);

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

      if (!response.ok) throw new Error(`Server returned ${response.status}`);

      const data = await response.json();

      if (data.status === 'success') {
        setTotalCorrect(data.totalCorrect);
        setTotalQuestions(data.totalQuestions);
        setShowPopup(true);
        setUserAnswers({}); // clear answers
      } else {
        alert('Submission failed on server.');
      }

      setTimeout(() => {
        window.location.href = '/home';
      }, 3000);

    } catch (err) {
      console.error('Submission failed:', err);
      alert('Submission failed. Please check your internet and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h3 className='sidetimer-h2'>
            <SideTimer time={time} setTime={setTime} />
          </h3>
        </div>
        <div className='warning-tab'>
          <p className='warning-text'>
            Warning! Multiple<br />tab changes can result in exam <br />termination.
          </p>
        </div>
      </section>

      <div className='section-flex'>
        <section className='testing-flex'>
          <div className='title-div'>
            <h1 className='h1-title-div'>{typeLabels[currentPassage.passageTitle]}</h1>
          </div>
        </section>

        <div className='two-sections'>
          {/* Passage */}
          <div className='passage-view'>
            <div className='test-title'>{currentPassage.passageTitle}</div>
            <div className='test-reference'>{currentPassage.passageSource}</div>
            <div className='test-passage'>
              <p style={{ fontSize: `${fontSize}px` }}>{currentPassage.passage}</p>
            </div>
          </div>

          {/* Questions */}
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
                <li className="instructions__item">Choose the correct letter, A, B, C, or D.
                </li>
              </ul>
            </div>
            <b>
              <p className='p-questionRange'>
                Questions {currentIndex * 4 + 1}-{currentIndex * 4 + currentPassage.questions.length}
              </p>
            </b>
            <p className='p-description'>{currentPassage.description}</p>

            <div className='question-container'>
              {currentPassage.questions.map((q, idx) => {
                const optionsArray = q.data?.options || [];
                const passageId = currentPassage.passageId;
                const selectedAnswer = (userAnswers[passageId] || [])[idx] || '';
                return (
                  <div className='question-block' key={q.questionNumber || idx}>
                    <p className='questions'><strong>{q.questionNumber}.</strong> {q.questionText}</p>
                    <div className='options-list'>
                      {optionsArray.map((opt, optionIdx) => (
                        <button
                          key={`${q.questionNumber}-${optionIdx}`}
                          type="button"
                          className={selectedAnswer === opt ? 'active-opt' : 'opt-btn'}
                          onClick={() => handleAnswerSelect(idx, opt)}
                        >
                          {String.fromCharCode(65 + optionIdx)}. {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className='next-back-buttons'>
              <button
                onClick={handlePreviousPassage}
                disabled={currentIndex === 0}
                className='back-btn'
              >
                Back
              </button>

              <button
                onClick={handleNextPassage}
                disabled={isSubmitting}
                className='next-page-btn'
              >
                {currentIndex === allPassages.length - 1 ? 'Submit Test' : 'Next Page'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default MultipleChoices;