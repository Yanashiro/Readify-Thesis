import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './vocabulary-test.css'
import axios from 'axios'

function VocabularyTest() {

	const navigate = useNavigate()

	const [vocab, setVocab] = useState(null)
	const [selectedAnswer, setSelectedAnswer] = useState("")
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [isCorrect, setIsCorrect] = useState(false)
	const [showPopup, setShowPopup] = useState(false)

	const [fontSize, setFontSize] = useState(20)

	/* ===============================
	   FETCH RANDOM VOCAB
	=============================== */

	const fetchVocab = () => {

		// reset states first
		setVocab(null)
		setSelectedAnswer("")
		setIsSubmitted(false)
		setShowPopup(false)

		axios
			.get('/start-vocabulary-exam')
			.then(res => {

				console.log("Fetched vocab:", res.data.data)

				setVocab(res.data.data)

			})
			.catch(err => console.error(err))

	}

	useEffect(() => {
		fetchVocab()
	}, [])

	/* ===============================
	   FONT SIZE
	=============================== */

	const increaseFontSize = () => fontSize < 40 && setFontSize(prev => prev + 2)
	const decreaseFontSize = () => fontSize > 10 && setFontSize(prev => prev - 2)
	const defaultFontSize = () => setFontSize(20)

	/* ===============================
	   SUBMIT ANSWER
	=============================== */

	const handleSubmit = () => {

		const correct = selectedAnswer === vocab.correctAnswer

		setIsCorrect(correct)
		setIsSubmitted(true)
		setShowPopup(true)

	}

	/* ===============================
	   LOADING STATE
	=============================== */

	if (!vocab) {
		return (
			<div className="loading-screen">
				<h2>Loading Vocabulary...</h2>
			</div>
		)
	}

	return (

		<main className='main-maintest'>

			{/* POPUP */}

			{showPopup && (

				<div className="popup-overlay">

					<div className="popup-content">

						<h2>{isCorrect ? "Correct!" : "Incorrect"}</h2>

						<p><b>Correct Answer:</b> {vocab.correctAnswer}</p>

						<button
							className="popup-btn"
							onClick={() => navigate('/home')}
						>
							Return to Dashboard
						</button>

						<button
							className="popup-btn"
							onClick={fetchVocab}
						>
							Take Another Vocabulary Test
						</button>

					</div>

				</div>

			)}

			<div className='section-flex'>

				<section className='testing-flex'>

					<div className='title-div'>
						<h1 className='h1-title-div'>
							Vocabulary Test
						</h1>
					</div>

					<div className='view-size-buttons'>
						<center>
							<p>Font Size Controls</p>
							<button onClick={decreaseFontSize}>-</button>
							<button onClick={defaultFontSize}>o</button>
							<button onClick={increaseFontSize}>+</button>
						</center>
					</div>

				</section>

				<section className='questions-side'>

					<div className='question-container'>

						<p className='questions'>
							<strong>What does "{vocab.wordEntry}" mean?</strong>
						</p>

						<div className='options-list'>

							{vocab.wordDescriptors.map((opt, idx) => (

								<button
									key={idx}
									className={selectedAnswer === opt ? 'active-opt' : 'opt-btn'}
									onClick={() => setSelectedAnswer(opt)}
								>
									{String.fromCharCode(65 + idx)}. {opt}
								</button>

							))}

						</div>

					</div>

					{/* SUBMIT BUTTON */}

					{!isSubmitted && (

						<div className='next-back-buttons'>

							<button
								onClick={handleSubmit}
								className='submit-btn-test'
								disabled={!selectedAnswer}
							>
								Submit Answer
							</button>

						</div>

					)}

				</section>

			</div>

		</main>

	)

}

export default VocabularyTest