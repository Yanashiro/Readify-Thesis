import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideTimer from '../main-components/timer';
import './maintestpage.css';

function MatchingSentenceEndings() {

	const [allPassages, setAllPassages] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [currentPassage, setCurrentPassage] = useState(null);

	const testType = 6;
	const testDesignation = true;

	const [totalCorrect, setTotalCorrect] = useState(0);
	const [totalQuestions, setTotalQuestions] = useState(0);

	const [userAnswers, setUserAnswers] = useState({});
	const [fontSize, setFontSize] = useState(20);
	const [time, setTime] = useState(1080);
	const [showPopup, setShowPopup] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigate = useNavigate();

	// FETCH passages
	useEffect(() => {

		fetch(`/start-random-exam?designation=true&type=${testType}`)
			.then(res => res.json())
			.then(data => {

				if (data && data.questions) {
					setAllPassages([data]);
					setCurrentPassage(data);
				}

				else if (data.data && data.data.length > 0) {
					setAllPassages(data.data);
					setCurrentPassage(data.data[0]);
				}

			})
			.catch(err => console.error(err));

	}, []);

	// update passage when index changes
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
		}
		else {
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
					return answer.split(".")[0].trim();
				})
			}));

			const response = await fetch('/submit-results', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					testType,
					testDesignation,
					testCategory: "Matching Sentence Endings",
					submissionData
				}),
			});

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

		}

		catch (err) {

			console.error(err);
			alert('Submission failed.');

		}

		finally {

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

	const sharedOptions = currentPassage?.questions?.[0]?.data?.options || [];

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

				<div className='passage-view'>

					<h2 className='test-title'>{currentPassage.passageTitle}</h2>
					<p className='test-reference'>{currentPassage.passageSource}</p>

					<div className='test-passage'>
						<p style={{ fontSize: `${fontSize}px` }}>
							{currentPassage.passage}
						</p>
					</div>

				</div>


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
							<li className="instructions__item">Complete each sentence with the correct ending, A-F, below. Select the correct letter.
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

					{/* Endings Box */}
					<div className='feature-box'>
						<h4>Endings</h4>

						{sharedOptions.map((opt, idx) => (
							<div key={idx} className='feature-item'>
								{opt}
							</div>
						))}
					</div>

					{/* Questions */}
					<div className='question-container'>

						{currentPassage.questions.map((q, idx) => {

							const passageId = currentPassage.passageId;
							const selectedAnswer = (userAnswers[passageId] || [])[idx] || '';

							return (

								<div className='question-block' key={idx}>

									<p className='questions'>
										<strong>{q.questionNumber}.</strong> {q.questionText}
									</p>

									<div className='letter-options'>

										{sharedOptions.map((opt, optionIdx) => {

											const letter = opt.split('.')[0];

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

export default MatchingSentenceEndings;