import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideTimer from '../main-components/timer';
import './maintestpage.css';

function MatchingInformation() {

  const [allPassages, setAllPassages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPassage, setCurrentPassage] = useState(null);

  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [userAnswers, setUserAnswers] = useState({});
  const [fontSize, setFontSize] = useState(20);
  const [time, setTime] = useState(1080);
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const testType = 3;

  // ✅ Fetch passages safely
  useEffect(() => {
    const fetchPassages = async () => {
      try {
        const res = await fetch('/start-random-exam?designation=true&type=3');
        const data = await res.json();

        if (data.status === 'success' && data.data?.length > 0) {
          setAllPassages(data.data);
          setCurrentPassage(data.data[0]);
        } else {
          console.error("Unexpected response:", data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPassages();
  }, []);

  // Update passage when index changes
  useEffect(() => {
    if (allPassages.length > 0) {
      setCurrentPassage(allPassages[currentIndex]);
    }
  }, [currentIndex, allPassages]);

  // Font controls
  const increaseFontSize = () => fontSize < 40 && setFontSize(prev => prev + 2);
  const decreaseFontSize = () => fontSize > 10 && setFontSize(prev => prev - 2);
  const defaultFontSize = () => setFontSize(20);

  // ✅ Safe paragraph parser (only start-of-line letters)
  const parseParagraphs = (text) => {
    const regex = /^([A-Z])\.\s([\s\S]*?)(?=^[A-Z]\.\s|$)/gm;
    const results = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      results.push({
        letter: match[1],
        text: match[2].trim()
      });
    }

    return results;
  };

  // Navigation
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

  // Submit
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
        body: JSON.stringify({
          submissionData,
          testType,
          testDesignation: true
        }),
      });

      if (!response.ok)
        throw new Error(`Server returned ${response.status}`);

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
      console.error('Submission failed:', err);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeLabels = {
    3: "Matching Information"
  };

  // ✅ BLOCK RENDER UNTIL READY
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
  if (!currentPassage) {
    return (
      <main className="main-maintest">
        <h2 style={{ textAlign: "center", marginTop: "200px" }}>
          No Test Available
        </h2>
      </main>
    );
  }

  const parsedParagraphs = currentPassage?.passage
    ? parseParagraphs(currentPassage.passage)
    : [];

  return (
    <main className='main-maintest'>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Test Finished: {totalCorrect} / {totalQuestions}</h2>
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
            Warning! Multiple tab changes can result in exam termination.
          </p>
        </div>
      </section>

      <div className='section-main'>

        <h1 className='title'>
          {typeLabels[currentPassage?.testType]}
        </h1>


        {/* Passage */}
        <div className='passage'>
          <div className='test-title'>{currentPassage.passageTitle}</div>
          <div className='test-reference'>{currentPassage.passageSource}</div>

          <div className='test-passage'>
            {parsedParagraphs.map(p => (
              <div key={p.letter} className="paragraph-block">
                <strong>{p.letter}.</strong> {p.text}
                <br /><br />
              </div>
            ))}
          </div>
        </div>

        {/* Questions */}
        <section className='questions'>

          <div className='view-size-buttons'>
            <center>
              <p>Font Size Controls</p>
              <button onClick={decreaseFontSize}>-</button>
              <button onClick={defaultFontSize}>o</button>
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
          <b>
            <p className='p-questionRange'>
              Questions {currentIndex * 4 + 1} -
              {currentIndex * 4 + currentPassage.questions.length}
            </p>
          </b>

          <div className='question-container'>
            {currentPassage.questions.map((q, idx) => {

              const passageId = currentPassage.passageId;
              const selectedAnswer =
                (userAnswers[passageId] || [])[idx] || '';

              return (
                <div className='question-block' key={q.questionNumber || idx}>

                  <p className='questions'>
                    <strong>{q.questionNumber}.</strong> {q.questionText}
                  </p>

                  <div className='options'>
                    {parsedParagraphs.map(p => {
                      const letter = p.letter;

                      return (
                        <button
                          key={`${q.questionNumber}-${letter}`}
                          type="button"
                          className={
                            selectedAnswer === letter
                              ? 'options__letter--active'
                              : 'options__letter'
                          }
                          onClick={() => {
                            setUserAnswers(prev => {
                              const existing = prev[passageId] || [];
                              const updated = [...existing];
                              updated[idx] = letter;
                              return { ...prev, [passageId]: updated };
                            });
                          }}
                        >
                          {letter}
                        </button>
                      );
                    })}
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
              {currentIndex === allPassages.length - 1
                ? 'Submit Test'
                : 'Next Page'}
            </button>
          </div>

        </section>
      </div>
    </main>
  );
}

export default MatchingInformation;