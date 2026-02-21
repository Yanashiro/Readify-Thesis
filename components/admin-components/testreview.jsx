import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import './testreview.css'

function AccountList({ query, setPage, setSelectedAccount }) {
    const [accountList, setAccountList] = useState([]);

    useEffect(() => {
        axios.get('/UserManagement')
            .then((res) => {
                // Sorting A-Z by name immediately upon axios request
                const sortedData = [...res.data].sort((a, b) => a.name.localeCompare(b.name));
                setAccountList(sortedData);
            })
            .catch((err) => console.error("Error fetching accounts:", err));
    }, []);

    // Filter logic based on the Search Input
    const filteredList = [...accountList].filter((user) => {
        const searchTerm = query.toLowerCase();
        return (
            (user.name || '').toLowerCase().includes(searchTerm) ||
<<<<<<< Updated upstream
            (user.email || '').toLowerCase().includes(searchTerm) ||
            ((user.isAdmin || '') ? "Admin" : "Student").toLowerCase().includes(searchTerm)
=======
            (user.email || '').toLowerCase().includes(searchTerm)
>>>>>>> Stashed changes
        );
    }).sort((a, b) => (a.name || '').localeCompare(b.name));

    return (
        <div className="table-container">
            <table className='tbody-scroll'>
                <thead>
                    <tr className='manageusers-table-header'>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Account Type</th>
                        <th>Email</th>
                        <th>Date Created</th>
                        <th></th> {/* For the arrow button */}
                    </tr>
                </thead>
                <tbody>
                    {filteredList.map((fsl) => (
                        <tr key={fsl._id}> 
                            <td>{fsl.name}</td>
                            <td>{fsl.name}</td>
                            <td>{fsl.isAdmin ? "Admin" : "Student"}</td>
                            <td>{fsl.email}</td>
                            <td>{fsl.dateCreated}</td>
                            <td className="action-cell">
                                <button onClick={() => {
                                    setSelectedAccount(fsl); // Save this user in parent state
                                    setPage('Account');      // Move to AccountFunction (Level 2)
                                }}>
                                    〉
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Display message if search results are empty */}
            {filteredList.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>No accounts found.</p>
            )}
        </div>
    );
}

function AccountFunction({ account, setPage, setSelectedAttempt }) {
    
    if (!account) return <div className='testreview-innerbox'>Loading account details...</div>

    const [attemptExam, setAttemptExam] = useState([]);
    const [loading, setLoading] = useState(true);

    const queryParams = {
        userId: account._id
    }

    useEffect(() => {
        // We send the account ID so the backend knows whose attempts to fetch
        // at the moment, attempts aren't yet shown
        axios.get('/profile', { params: queryParams})
            .then((res) => {
                setAttemptExam([res.data]);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching attempts:", err);
                setLoading(false);
            });
    }, [account.id]); // Re-run if a different account is somehow selected

    return (
        <div className="account-detail-view">
            {/* Back Button */}
            <div className="back-nav">
                <button onClick={() => setPage('Account List')} className="back-button">
                    〈
                </button>
            </div>

            <div className='accountPage-flex'>
                <div className="info-column">
                    <div>
                        <p className="label">Name:</p>
                        <h1 className="display-name">{account.name}</h1>
                    </div>
                    <div>
                        <p><strong>Username:</strong> {account.name}</p>
                    </div>
                    <div>
                        <p><strong>Email:</strong> {account.email}</p>
                    </div>
                </div>
                <div className="info-column secondary-info">
                    <div>
                        <p><strong>Account Type:</strong> {account.isAdmin ? "Admin" : "Student"}</p>
                    </div>
                    <div>
                        <p><strong>Date Created:</strong> {account.dateCreated}</p>
                    </div>
                </div>
            </div>

            {/* Attempts Table */}
            <div className="attempts-section">
                <table>
                    <thead>
                        <tr className="table-header-gray">
                            <th>Attempt</th>
                            <th>Test</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* It displays after axios intercepted the /profile json call */}
                        {loading ? (
                            <tr><td colSpan="3">Loading attempts...</td></tr>
                        ) : (
                            attemptExam.map((EA) => (
                                <tr key={EA._id}>
                                    <td>{EA.attemptNumber || EA.attempt}</td>
                                    <td>{EA.testName || EA.test}</td>
                                    <td className="action-cell">
                                        <button onClick={() => {
                                            setSelectedAttempt(EA); // Save specific attempt info
                                            setPage('Attempt');     // Move to Attempt Function (level 3)
                                        }}>
                                            〉
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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
                setScoreDetails(res.data);
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

function TestReview() {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState('Account List');
    
    // Level 2 Selection: The specific student
    const [selectedAccount, setSelectedAccount] = useState(null);
    
    // Level 3 Selection: The specific test attempt
    const [selectedAttempt, setSelectedAttempt] = useState(null);

    const searchInputChange = (e) => {
        setQuery(e.target.value);
    };

    return (
        <main className='admin-test-review'>
            <div><h1>View Scores</h1></div>
            <div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type='text'
                        placeholder='⌕ Search'
                        value={query}
                        onChange={searchInputChange}
                        className='search-bar'
                    />
                </form>
            </div>
            
            <div className='testreview-box'>
                <div className='testreview-innerbox'>
                    {/* Level 1: Account List */}
                    {page === 'Account List' && (
                        <AccountList 
                            query={query} 
                            setPage={setPage} 
                            setSelectedAccount={setSelectedAccount} 
                        />
                    )}

                    {/* Level 2: Account Details & Attempts */}
                    {page === 'Account' && (
                        <AccountFunction 
                            account={selectedAccount} 
                            setPage={setPage} 
                            setSelectedAttempt={setSelectedAttempt}
                        />
                    )}

                    {/* Level 3: Specific Attempt Scores */}
                    {page === 'Attempt' && (
                        <AttemptFunction 
                            account={selectedAccount}
                            attempt={selectedAttempt} 
                            setPage={setPage} 
                        />
                    )}
                </div>
            </div>
        </main>
    );
}

export default TestReview;