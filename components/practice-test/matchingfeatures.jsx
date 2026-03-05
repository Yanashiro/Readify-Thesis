import React, { useState, useEffect } from 'react';
import SideTimer from '../main-components/timer';
import { useNavigate } from 'react-router-dom';
import './practicetestpage.css';

function MatchingFeatures() {

	const [currentPassage, setCurrentPassage] = useState(null);
	const [detailedResults, setDetailedResults] = useState([]);
	const [userAnswers, setUserAnswers] = useState({});
	const [fontSize, setFontSize] = useState(20);
	const [time, setTime] = useState(300);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const testType = 2;
	const testDesignation = false;

	const navigate = useNavigate();

	// ✅ FETCH PRACTICE TEST
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

	const increaseFontSize = () => fontSize < 40 && setFontSize(prev => prev + 2);
	const decreaseFontSize = () => fontSize > 10 && setFontSize(prev => prev - 2);
	const defaultFontSize = () => setFontSize(20);

	const handleAnswerSelect = (questionIndex, option) => {
		setUserAnswers(prev => ({
			...prev,
			[questionIndex]: option
		}));
	};

	// ✅ SUBMIT
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

	// 🔥 SHARED OPTIONS (same for all questions)
	const sharedOptions =
		currentPassage?.questions?.[0]?.data?.options || [];

	return (
		<main className='main-maintest'>

			{/* SIDEBAR */}
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
							<li className="instructions__item">Look at the following statements (1–4) and the list of features (A–E).
							</li>
							<li className="instructions__item">Match each statement with the correct feature.
							</li>
							<li className="instructions__item">Select the correct letter A–E.
							</li>


						</ul>
					</div>
					<b>
						<p className='p-questionRange'>
							Questions 1-{currentPassage.questions.length}
						</p>
					</b>

					{/* FEATURES BOX */}
					<div className='feature-box'>
						<h4>Features</h4>
						{sharedOptions.map((opt, idx) => (
							<div key={idx} className='feature-item'>
								{opt}
							</div>
						))}
					</div>

					{/* QUESTIONS */}
					<div className='question-container'>

						{!isSubmitted ? (

							currentPassage.questions.map((q, idx) => {

								const selectedAnswer = userAnswers[idx] || '';

								return (
									<div className='question-block' key={idx}>

										<p className='questions'>
											<strong>{q.questionNumber}.</strong> {q.questionText}
										</p>

										{/* LETTER BUTTONS ONLY */}
										<div className='letter-options'>
											{sharedOptions.map((opt, optionIdx) => {

												const letter = opt.split('.')[0];

												return (
													<button
														key={optionIdx}
														className={
															selectedAnswer === letter
																? 'letter-btn active-letter'
																: 'letter-btn'
														}
														onClick={() => handleAnswerSelect(idx, letter)}
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
		</main>
	);
}

export default MatchingFeatures;