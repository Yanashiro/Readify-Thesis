import React from 'react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import SideTimer from '../main-components/timer'
import { useNavigate } from 'react-router-dom'
import './maintestpage.css';

function MultipleChoices() {

  // used to store and take questions and passages from the backend using Axios HTTP client
  const [showPopup, setShowPopup] = useState(false);
  const [userAnswers, setUserAnswers] = useState(() => {
    const saved = sessionStorage.getItem("Answer");
    return saved ? JSON.parse(saved) : {}
  });
  const [allQuestions, setAllQuestions] = useState(() => {
    const saved = sessionStorage.getItem("Questions History");
    return saved ? JSON.parse(saved) : []
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = sessionStorage.getItem("Page History");
    return saved ? JSON.parse(saved) : 0
  });
  const [passageHistory, setPassageHistory] = useState(() => {
    const saved = sessionStorage.getItem("Passage History");
    return saved ? JSON.parse(saved) : []
  });
  const [fontSize, setFontSize] = useState(() => {
    const saved = sessionStorage.getItem("Font Size");
    return saved ? JSON.parse(saved) : 20
  });
  const [time, setTime] = useState(() => {
    const saved = sessionStorage.getItem("Timer remain");
    return saved ? JSON.parse(saved) : 1080
  })
  const [passageId, setPassageId] = useState(() => {
    const saved = sessionStorage.getItem("Passage ID");
    return saved ? JSON.parse(saved) : null;
  })

  // stores passage history when clicking the "back" button array of currentPage serves as an updator of the page
  const currentPassage = passageHistory;
  // used to index an array of questions putting the maximum capacity to 4 questions per page
  const questionsPerPage = 4;
  // used as a 'cutter' to 'indexOfFirstQuestion' 
  const indexOfLastQuestion = (currentPage + 1) * questionsPerPage;
  // used to index the very first question after a "Next Page" removing the last question from the equation 
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  // used to print out current questions from "allQuestions" hook (remember it was intercepted by setAllQuestions at Axios call line 31) Excluding those that have been "sliced"
  const currentQuestions = (allQuestions || []).slice(indexOfFirstQuestion, indexOfLastQuestion);
  const questionNumberStart = indexOfFirstQuestion;
  const questionNumberEnd = indexOfLastQuestion;
  // immediate test collecting                
  // console.log('hellooo')

  const hasFetched = useRef(false);
  const queryString = new URLSearchParams({
    designation: 'true',
    type: 1,
    previousPassageId: passageId
  }).toString();

  useEffect(() => {

    if (passageHistory.length === 0) {

      if (hasFetched.current) return; // prevent second run
      hasFetched.current = true;


      getRandomPassage(queryString)
    }
  }, [])

  function getRandomPassage(queryString) {
    fetch(`/start-random-exam?${queryString}`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            alert("No passages detected");
            window.location.href = "/home"; // returns to home
            return;
          }
          throw new Error("Server error");
        }
        // console.log(response)
        return response.json();
      })
      .then((data) => {
        if (!data) return;
        setAllQuestions(data.data.questions);
        setPassageHistory(data.data);
        setPassageId(data.data.passageId);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }

  // immediat3e sessionStorage collecting
  useEffect(() => {
    sessionStorage.setItem("Answer", JSON.stringify(userAnswers));
    sessionStorage.setItem("Font Size", fontSize);
    sessionStorage.setItem("Passage History", JSON.stringify(passageHistory));
    sessionStorage.setItem("Page History", JSON.stringify(currentPage));
    sessionStorage.setItem("Questions History", JSON.stringify(allQuestions));
    sessionStorage.setItem("Passage ID", JSON.stringify(passageId))
  }, [userAnswers, fontSize, currentPage, allQuestions, passageHistory, passageId]);

  useEffect(() => {
    sessionStorage.setItem("Timer remain", time)
  }, [time])

  const userChoiceClick = (questionId, choiceValue) => {
    // used to save user choices (answers) even if the page is moved
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: choiceValue
    }))

  }

  const increaseFontSize = () => {
    if (fontSize == 40) {
      return;
    }
    setFontSize(prevSize => prevSize + 2);
  }

  const defaultFontSize = () => {
    setFontSize(20)
  }

  const decreaseFontSize = () => {
    if (fontSize == 10) {
      return;
    }
    setFontSize(prevSize => prevSize - 2);
  }

  const handleNextPage = () => {

    const totalLimit = 12;

    // console.log(typeof passageHistory)

    // passasgeHistory is an object, not an array hence .length can't work
    // if (passageHistory.length > currentPage + 1) {
    // if the length of passageHistory is still greater than the currentPage that adds by "Next Page"
    // then allow "Next Page" functionality and return 0, otherwise do skip this step;

    if (allQuestions.length >= totalLimit) { //apply >= if need exactly 10
      console.log('reached 12 answers')
      // if length of allQuestions array is greater than variable totalLimit, function returns nothing
      return; // stops the function
    }


    setCurrentPage(prev => prev + 1);
    return getRandomPassage(queryString); // function stopper
    // }


    /*
        axios.get('/testUI')
            .then((res) => {
                setAllQuestions(prevQuestions => {
                    const combined = [...prevQuestions, ...res.data.questions]
                    return combined.length > totalLimit ? combined.slice(0, totalLimit) : combined;
                });

                setPassageHistory(prev => [...prev, res.data]); 
                setCurrentPage(prevPage => prevPage + 1);
            })
            .catch((err) => console.error(err)); */
  }

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

  if (!allQuestions || !passageHistory) return <h1>Loading...</h1>

  const sendUserAnswers = () => {

    const submissionData = {
      testType: 'Main',
      testCategory: 'Multiple Choices',
      userAnswers: userAnswers,
      passageId: passageId,
      data: new Date()
    };

    axios
      .post('/submit-results', submissionData, { withCredentials: true })
      .then((res) => {
        if (res.status == 200) {
          setShowPopup(true);
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
        console.error(err)
      });
  }

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/home")
  }

  return (
    <main className='main-maintest'>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Test Finished</h2>
            <button className="popup-btn" onClick={handleGoBack}>
              Go back to Main Test
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
            Warning! Multiple<br />
            tab changes can result in exam <br />
            termination.
          </p>
        </div>
      </section>

      <div className='section-flex'>

        <section className='testing-flex'>
          <div className='title-div'>
            <h1 className='h1-title-div'>
              {typeLabels[currentPassage?.testType]}
            </h1>
          </div>

          <div className='view-size-buttons'>
            <button className='font-size-btn' onClick={decreaseFontSize}>Decr</button>
            <button className='font-size-btn' onClick={defaultFontSize}>Default</button>
            <button className='font-size-btn' onClick={increaseFontSize}>Incr</button>
          </div>
        </section>

        <div className='two-sections'>

          {/* Passage */}
          <div className='passage-view'>
            <div className='test-title'>
              {currentPassage?.passageTitle}
            </div>

            <div className='test-reference'>
              {currentPassage?.passageSource}
            </div>

            <div className='test-passage'>
              <p style={{ fontSize: `${fontSize}px` }}>
                {currentPassage?.passage}
              </p>
            </div>
          </div>

          {/* Questions */}
          <section className='questions-side'>
            <b>
              <p className='p-questionRange'>
                Questions {questionNumberStart + 1}
                {questionNumberEnd <= 12 ? `-${questionNumberEnd}` : ''}
              </p>
            </b>

            <p className='p-description'>
              {currentPassage?.description}
            </p>

            <div className='question-container'>
              {currentQuestions.map((q, index) => {

                // ✅ FIXED HERE
                const optionsArray = Array.isArray(q.data.options)
                  ? q.data.options
                  : [];
                return (
                  <div
                    className='question-block'
                    key={q.questionNumber || index}
                  >
                    <p className='questions'>
                      <strong>
                        {indexOfFirstQuestion + index + 1}.
                      </strong>{" "}
                      {q.questionText}
                    </p>

                    <div className='options-list'>
                      {optionsArray.map((opt, index2) => {
                        return (
                          <button
                            key={`${q.questionNumber}-${index2}`}
                            type="button"
                            className={
                              userAnswers[q.questionNumber] === opt
                                ? 'active-opt'
                                : 'opt-btn'
                            }
                            onClick={() =>
                              userChoiceClick(q.questionNumber, opt)
                            }
                          >
                            {String.fromCharCode(65 + index2)}. {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className='next-back-buttons'>
              {currentPage > 0 && (
                <button
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className='back-btn'
                >
                  Back
                </button>
              )}

              {indexOfLastQuestion >= 10 ? (
                <button
                  onClick={sendUserAnswers}
                  className='submit-btn-test'
                >
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={handleNextPage}
                  className='next-page-btn'
                >
                  Next Page
                </button>
              )}
            </div>

          </section>
        </div>
      </div>
    </main>
  );
}

export default MultipleChoices;
