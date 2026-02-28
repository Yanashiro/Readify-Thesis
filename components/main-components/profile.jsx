import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import './profile.css'

// ======================================
/*
				Still under construction
*/
// ======================================



function AccountFunction({ setPage, setSelectedAttempt }) {

	const [attemptExam, setAttemptExam] = useState([]);
	const [achievements, setAchievements] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// We send the account ID so the backend knows whose attempts to fetch
		// at the moment, attempts aren't yet shown
		axios.get('/profile', { withCredentials: true })
			.then((res) => {
				// setAttemptExam(res.data.data.testHistory);
				setAchievements(res.data.data.achievements)
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching attempts:", err);
				setLoading(false);
			});
	}, []); // Re-run if a different account is somehow selected

	return (
		<div className="account-detail-view">

			{/* Attempts Table */}
			<div className="attempts-section">
				{/* Achievements */}
				<h2>Achievements</h2>
				<table>
					<thead>
						<tr className="table-header-gray">
							<th>Title</th>
							<th>Description</th>
							<th>Date</th>
							<th>Icon</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr><td colSpan="5">Loading results...</td></tr>
						) : (
							achievements.map((a, index) => (
								<tr key={index}>
									<td>{a.title}</td>
									<td>{a.description}</td>
									<td>{new Date(a.earnedAt).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric"
									})}</td>
									{/* These columns usually only have data for the first row or summary row */}
									<td><img className='achievement-icon' src={a.icon} alt="achivement icon" /></td>
								</tr>
							))
						)}
					</tbody>
				</table>

				{/* <h2>Test Results</h2>
				{/* Test Results */}
			
			</div>
		</div>
	);
}

function AttemptFunction({ account, attempt, setPage }) {
	const [scoreDetails, setScoreDetails] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetching the breakdown for this specific attempt ID

		// change this path when there is an established path for viewing
		// exam attempts with a designated userId
		axios.post('/attemptdetails', { attemptId: attempt._id })
			.then((res) => {
				setScoreDetails([res.data]);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching score details:", err);
				setLoading(false);
			});
	}, [attempt.id]);

	return (
		<div className="attempt-detail-view">
			{/* Back Button - Returns to the Account Profile (Level 2) */}
			<div className="back-nav">
				<button onClick={() => setPage('Account')} className="back-button">
					〈
				</button>
			</div>

			{/* Dynamic Header based on the selected attempt */}
			<div className="attempt-header">
				<h1 className="display-name">
					Attempt {attempt.attemptNumber || attempt.attempt} - {attempt.testName || attempt.test}
				</h1>
			</div>

			{/* Detailed Scores Table */}
			<div className="scores-section">
				<table>
					<thead>
						<tr className="table-header-gray">
							<th>Test Section</th>
							<th>Score</th>
							<th>Band Score</th>
							<th>Final Score</th>
							<th>Final Band Score</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr><td colSpan="5">Loading results...</td></tr>
						) : (
							scoreDetails.map((detail, index) => (
								<tr key={index}>
									<td>{detail.sectionName}</td>
									<td>{detail.score}</td>
									<td>{detail.bandScore}</td>
									{/* These columns usually only have data for the first row or summary row */}
									<td>{detail.finalScore || ''}</td>
									<td>{detail.finalBandScore || ''}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}




function Profile() {

	const [details, setDetails] = useState(null);
	const [selectedAttempt, setSelectedAttempt] = useState([]);
	const [page, setPage] = useState('Account');
	//const mainTestAttempts = [...attempts];

	useEffect(() => {

		axios   // change path name once the feature is added
			.get('/profile', { withCredentials: true })
			.then((res) => {
				console.log(res.data.data)
				setDetails(res.data.data)
			})
			.catch((err) => console.error(err))
	}, [])

	if (!details) {
		return <div className='profile-examinee'><h1>Loading Profile...</h1></div>;
	}

	return (
		<main className='profile-examinee'>
			<div className='profile-examinee-page'>
				<div className='flexbox-profile'>
					<div className=''>
						<p>Name: {details.name}</p>
						<p>Username: {details.name}</p>
						<p>Email: {details.email}</p>
					</div>
					<div className=''>
						<p>Account Type: {details.isAdmin ? "Admin" : "Student"}</p>
					</div>
				</div>
				<div>
					{page === 'Account' && (
						<AccountFunction
							setPage={setPage}
							setSelectedAttempt={setSelectedAttempt}
						/>
					)}

					{/* Level 2: Specific Attempt Scores */}
					{page === 'Attempt' && (
						<AttemptFunction
							attempt={selectedAttempt}
							setPage={setPage}
						/>
					)}
				</div>
			</div>
		</main>
	)
}

export default Profile;
