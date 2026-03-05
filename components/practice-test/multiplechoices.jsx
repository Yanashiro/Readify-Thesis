import React, { useState, useEffect } from 'react';
import SideTimer from '../main-components/timer';
import { useNavigate } from 'react-router-dom';
import './practicetestpage.css';

function MultipleChoices() {

	const [currentPassage, setCurrentPassage] = useState(null);
	const [detailedResults, setDetailedResults] = useState([]);
	const [userAnswers, setUserAnswers] = useState({});
	const [fontSize, setFontSize] = useState(20);
	const [time, setTime] = useState(300);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const testType = 1;
	const testDesignation = false;

	const navigate = useNavigate();

	// ✅ REAL BACKEND FETCH
	useEffect(() => {
		fetch(`/start-random-exam?designation=${testDesignation}&type=${testType}`)
			.then(res => res.json())
			.then(data => {
				if (data.data && data.data.length > 0) {
					setCurrentPassage(data.data[0]); // Only first passage
				}
			})
			.catch(err => console.error(err));
	}, []);

	const increaseFontSize = () => fontSize < 40 && setFontSize(prev => prev + 2);
	const decreaseFontSize = () => fontSize > 10 && setFontSize(prev => prev - 2);
	const defaultFontSize = () => setFontSize(20);

	const handleAnswerSelect = (questionIndex, option) => {
		setUserAnswers(prev => {
			const updated = { ...prev };
			updated[questionIndex] = option;
			return updated;
		});
	};

	// ✅ REAL BACKEND SUBMIT
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

				// Prepare explanation display
				const results = currentPassage.questions.map((q, idx) => {
					const selectedAnswer = userAnswers[idx] || "";
					return {
						questionNumber: q.questionNumber,
						questionText: q.questionText,
						selectedAnswer,
						correctAnswer: q.correctAnswer,
						explanation: q.answerExplanation
					};
				});

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

	return (
		<main className='main-maintest'>

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
							Multiple Choice
						</h1><br />
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
							<p style={{ fontSize: `${fontSize}px` }}>
								{currentPassage.passage}
							</p>
						</div>
					</div>


					{/* Right Side */}
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
							<li className="instructions__item">Choose the correct letter, A, B, C, or D.
</li>
						</ul>
					</div>
						<p className='p-description'>
							Choose the correct answer for each question.
						</p>
						<div className='question-container'>

							{!isSubmitted ? (

								currentPassage.questions.map((q, idx) => {
									const optionsArray = q.data?.options || [];
									const selectedAnswer = userAnswers[idx] || '';

									return (
										<div className='question-block' key={q.questionNumber || idx}>
											<p className='questions'>
												<strong>{q.questionNumber}.</strong> {q.questionText}
											</p>

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
								})

							) : (

								// ✅ AFTER SUBMIT → SHOW EXPLANATIONS
								detailedResults.map((result, idx) => (
									<div className='question-block' key={idx}>
										<p className='questions'>
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

						{/* BUTTON AREA */}
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

export default MultipleChoices;