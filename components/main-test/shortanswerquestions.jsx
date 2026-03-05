import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideTimer from '../main-components/timer';
import './maintestpage.css';

function ShortAnswerQuestions() {
  const testType = 9;

  const [allPassages, setAllPassages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPassage, setCurrentPassage] = useState(null);
  // For popup
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [userAnswers, setUserAnswers] = useState({});
  const [fontSize, setFontSize] = useState(20);
  const [time, setTime] = useState(1080);
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // ✅ FETCH TYPE 9
  useEffect(() => {
    fetch('/start-random-exam?designation=true&type=9')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data?.length > 0) {
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

  const handleInputChange = (questionIndex, value) => {
    const passageId = currentPassage.passageId;

    setUserAnswers(prev => {
      const existing = prev[passageId] || [];
      const updated = [...existing];
      updated[questionIndex] = value;
      return { ...prev, [passageId]: updated };
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const submissionData = allPassages.map(p => ({

        passageId: p.passageId,
        answers: (userAnswers[p.passageId] || []).map(answer => {
          if (!answer) return "";

          // Extract only the first letter before the dot
          return `"${answer.trim()}"`
        })
      }));

      console.log(submissionData);


      const response = await fetch('/submit-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionData, testType, testDesignation: true, })
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
      console.error("Submission failed:", err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeLabels = {
    9: "Short Answer Questions"
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

      <div className='section-flex'>

        <section className='testing-flex'>
          <div className='title-div'>
            <h1 className='h1-title-div'>
              {typeLabels[currentPassage.testType]}
            </h1>
          </div>
        </section>

        <div className='two-sections'>

          {/* LEFT SIDE */}
          <div className='passage-view'>
            <div className='test-title'>
              {currentPassage.passageTitle}
            </div>

            <div className='test-reference'>
              {currentPassage.passageSource}
            </div>

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
              <li className="instructions__item">Answer the questions below by writing inside the box.
</li>
            </ul>
          </div>
            <b>
              <p className='p-questionRange'>
                Questions 1-{currentPassage.questions?.length}
              </p>
            </b>

            <div className='question-container'>
              {currentPassage.questions?.map((q, idx) => {

                const passageId = currentPassage.passageId;
                const typedAnswer =
                  (userAnswers[passageId] || [])[idx] || '';

                return (
                  <div className='question-block' key={q.questionNumber}>
                    <p className='questions'>
                      <strong>{q.questionNumber}.</strong>
                      {q.questionText}
                    </p>

                    <input
                      type="text"
                      className='answer-input'
                      value={typedAnswer}
                      onChange={(e) =>
                        handleInputChange(idx, e.target.value)
                      }
                    />
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
      </div>
    </main>
  );
}

export default ShortAnswerQuestions;