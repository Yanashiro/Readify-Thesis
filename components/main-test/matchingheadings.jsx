import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideTimer from '../main-components/timer';
import './maintestpage.css';

function MatchingHeadings() {
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
  const [submissionCount, setSubmissionCount] = useState(0);

  const navigate = useNavigate();

  // FETCH (backend returns object directly, not data.test)
  useEffect(() => {
    console.log('before feching');
    fetch('/start-random-exam?designation=true&type=7')
      .then(res => res.json())
      .then(data => {
        console.log('Current Passage: ', data);

        // Backend returns passage directly
        if (data && data.questions) {

          setAllPassages([data]);
          setCurrentPassage(data);
        }

        // Or if wrapped inside data.data[]
        else if (data.data && data.data.length > 0) {
          setAllPassages(data.data);
          setCurrentPassage(data.data[0]);
        }

      })
      .catch(err => console.error(err));
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
        answers: (userAnswers[p.passageId] || []).map(answer => {
          if (!answer) return "";

          const roman = answer.split(".")[0].trim();

          return `"${roman}"`;   // 👈 adds quotes
        })
      }));

      console.log(submissionData)

      const response = await fetch('/submit-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 7,
          submissionData,
          testDesignation: true,
        }),
      });

      /*
CastError: Cast to Number failed for value "Main" (type string) at path "testType" for model "users"
    at SchemaNumber.cast (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\schema\number.js:401:11)
    at SchemaType.applySetters (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\schemaType.js:1288:12)
    at SchemaNumber.castForQuery (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\schema\number.js:470:16)
    at cast (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\cast.js:390:32)
    at cast (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\cast.js:334:17)
    at Query.cast (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\query.js:5060:12)
    at Query._castConditions (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\query.js:2374:10)
    at model.Query._updateThunk (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\query.js:4043:8)
    at model.Query._updateOne (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\query.js:4150:23)
    at model.Query.exec (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\query.js:4627:80) {
  stringValue: '"Main"',
  messageFormat: undefined,
  kind: 'Number',
  value: 'Main',
  path: 'testType',
  reason: AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

    assert.ok(!isNaN(val))

      at castNumber (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\cast\number.js:27:10)
      at SchemaNumber.cast (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\schema\number.js:399:12)
      at SchemaType.applySetters (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\schemaType.js:1288:12)
      at SchemaNumber.castForQuery (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\schema\number.js:470:16)
      at cast (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\cast.js:390:32)
      at cast (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\cast.js:334:17)
      at Query.cast (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\query.js:5060:12)
      at Query._castConditions (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\query.js:2374:10)
      at model.Query._updateThunk (C:\Users\Ryan\Desktop\Github\Readify-Thesis\Thesis\node_modules\mongoose\lib\query.js:4043:8)
      at model.Query._updateOne (C:\Users\Ryan\Desktop\Github\Readify-Thesis\node_modules\mongoose\lib\query.js:4150:23) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '=='
  },
  valueType: 'string'
}

      */

      if (!response.ok)
        throw new Error(`Server returned ${response.status}`);

      const data = await response.json();

      if (data.status === 'success') {
        setTotalCorrect(data.totalCorrect);
        setTotalQuestions(data.totalQuestions);
        setShowPopup(true);
        setUserAnswers({});
      } else {
        alert('Submission failed.');
      }

      setTimeout(() => {
        window.location.href = '/home';
      }, 3000);

    } catch (err) {
      alert('Submission failed. Please check your internet.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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
  // 🔥 THIS IS THE CORRECT EXTRACTION
  const sharedOptions =
    currentPassage?.questions?.[0]?.data?.options || [];

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
            Warning! Multiple tab changes can result in exam termination.
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
              <li className="instructions__item">Reading Passage has four sections, A–D.
              </li>
              <li className="instructions__item">Choose the correct heading for each section from the list of headings below.
              </li>
              <li className="instructions__item">Select the correct number, i–vi.
              </li>
            </ul>
          </div>
          <b>
            <p className='p-questionRange'>
              Questions {currentIndex * 4 + 1}-
              {currentIndex * 4 + currentPassage.questions.length}
            </p>
          </b>

          <p className='p-description'>{currentPassage.description}</p>

          {/* HEADINGS BOX */}
          <div className='feature-box'>
            <h4>Headings</h4>
            {sharedOptions.map((opt, idx) => (
              <div key={idx} className='feature-item'>
                {opt}
              </div>
            ))}
          </div>

          {/* QUESTIONS */}
          <div className='question-container'>
            {currentPassage.questions.map((q, idx) => {
              const passageId = currentPassage.passageId;
              const selectedAnswer =
                (userAnswers[passageId] || [])[idx] || '';

              return (
                <div className='question-block' key={idx}>
                  <p className='questions'>
                    <strong>{q.questionNumber}.</strong> {q.questionText}
                  </p>

                  <div className='letter-options'>
                    {sharedOptions.map((opt, optionIdx) => (
                      <button
                        key={optionIdx}
                        className={
                          selectedAnswer === opt
                            ? 'letter-btn active-letter'
                            : 'letter-btn'
                        }
                        onClick={() => handleAnswerSelect(idx, opt)}
                      >
                        {opt.split('.')[0]} {/* shows i, ii, iii... */}
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

export default MatchingHeadings;