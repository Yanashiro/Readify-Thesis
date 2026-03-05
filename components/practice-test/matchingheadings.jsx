import React, { useState, useEffect } from 'react';
import SideTimer from '../main-components/timer';
import { useNavigate } from 'react-router-dom';
import './practicetestpage.css';

function MatchingHeadings() {

	const [currentPassage, setCurrentPassage] = useState(null);
	const [detailedResults, setDetailedResults] = useState([]);
	const [userAnswers, setUserAnswers] = useState({});
	const [fontSize, setFontSize] = useState(20);
	const [time, setTime] = useState(300);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const testType = 7;
	const testDesignation = false;

	const navigate = useNavigate();

	// ✅ FETCH PRACTICE
	useEffect(() => {
		fetch(`/start-random-exam?designation=${testDesignation}&type=${testType}`)
			.then(res => res.json())
			.then(data => {

				if (data && data.questions) {
					setCurrentPassage(data);
				}
				else if (data.data && data.data.length > 0) {
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

	// ✅ SUBMIT PRACTICE
	const handleSubmit = async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);

		try {

			const submissionData = [{
				passageId: currentPassage.passageId,
				answers: currentPassage.questions.map((_, idx) => {
					const answer = userAnswers[idx];
					if (!answer) return "";
					return answer.split(".")[0].trim(); // return roman only
				})
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

			if (!response.ok)
				throw new Error("Submission failed");

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

	// 🔥 Shared Headings (ONLY FROM FIRST QUESTION)
	const sharedOptions =
		currentPassage?.questions?.[0]?.data?.options || [];

	return (
		<main className='main-maintest'>

			{/* SIDEBAR */}
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
							Questions 1-{currentPassage.questions.length}
						</p>
					</b>

					{/* ✅ HEADINGS BOX AT TOP */}
					<div className='feature-box'>
						<h4>Headings</h4>
						{sharedOptions.map((opt, idx) => (
							<div key={idx} className='feature-item'>
								{opt}
							</div>
						))}
					</div>

					<div className='question-container'>

						{!isSubmitted ? (

							currentPassage.questions.map((q, idx) => {

								const selectedAnswer = userAnswers[idx] || '';

								return (
									<div className='question-block' key={idx}>

										<p className='questions'>
											<strong>{q.questionNumber}.</strong> {q.questionText}
										</p>

										<div className='letter-options'>
											{sharedOptions.map((opt, optionIdx) => {

												const roman = opt.split('.')[0];

												return (
													<button
														key={optionIdx}
														className={
															selectedAnswer === opt
																? 'letter-btn active-letter'
																: 'letter-btn'
														}
														onClick={() => handleAnswerSelect(idx, opt)}
													>
														{roman}
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

export default MatchingHeadings;