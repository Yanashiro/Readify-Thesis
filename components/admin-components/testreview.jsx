// still under construction

import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react';
import './testreview.css'

function ViewScoresNavigation({queryInput, currentPage, setPage, selectedAccount, setSelectedAccount}) {

    switch(currentPage) {
        case 'Account List':
            return <AccountList query={queryInput} setPage={setPage} setSelectedAccount={setSelectedAccount}/>
        case 'Account':
            return <AccountFunction setPage={setPage} account={selectedAccount}/>
        case 'Attempt':
            return <AttemptFunction setPage={setPage}/>
        default:
            return <AccountList query={queryInput} setPage={setPage}/>
        
    }
}

function AccountList({query, setPage}) {

    const [accountList, setAccountList] = useState([]);

    const filteredAndSortedList = accountList.filter((user) => {
        const searchTerm = query.toLowerCase();
        return (
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
    }).sort((a, b) => a.name.localeCompare(b.name));

    useEffect(() => {
        axios
            .post('/accountlist')
            .then((res) => {
                const sortedData = res.data.sort((a, b) => a.name.localeCompare(b.name));
                setAccountList(sortedData) ;
            })
            .catch((err) => console.error(err))
    }, [])

    return (
        <>
            <div>
                <table>
                    <thead>
                    <tr className='manageusers-table-header'>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Account Type</th>
                        <th>Email</th>
                        <th>Date Created</th>
                    </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedList.map((fsl) => (
                        <tr key={fsl.id}> 
                            <td>{fsl.name}</td>
                            <td>{fsl.username}</td>
                            <td>{fsl.accountType}</td>
                            <td>{fsl.email}</td>
                            <td>{fsl.dateCreated}</td>
                            <td><button onClick={() => {setSelectedAccount(fsl); setPage('Account');}}>〉</button></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={() => setPage('Account')}>〉</button>
            </div>
        </>
    )
}

function AccountFunction({setPage, account}) {

    const examAttempts = [
        
    ]

    return (
        <>
            <div>
                <button onClick={() => setPage('Account List')}>〈 </button>
            </div>

            <div className='accountPage-flex'>
                <div>
                    <div><p>Name:</p><h1>{account}</h1></div>
                    <div><p>Username:{account}</p></div>
                    <div><p>Email:{account}</p></div>
                </div>
                <div>
                    <div><p>Account Type:{account}</p></div>
                    <div><p>Date Created:{account}</p></div>
                </div>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Attempt</th>
                            <th>Test</th>
                        </tr>
                    </thead>
                    <tbody>
                    {examAttempts.map((EA) => (
                        <tr key={EA.id}>
                            <td>{EA.attempt}</td>
                            <td>{EA.test}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div>
                <button onClick={() => setPage('Attempt')}>〉</button>
            </div>
        </>
    )
}

function AttemptFunction({setPage}) {
    return (
        <>
            <div>
                <button onClick={() => setPage('Account')}>〈 </button>
            </div>
        </>
    )
}


function TestReview() {

    const [query, setQuery] = useState('');
    const [page, setPage] = useState('Account List')

    const searchInputChange = (e) => {
        setQuery(e.target.value)
    }

    return (
        <>
            <main className='admin-test-review'>
                <div>
                    <h1>View Scores</h1>
                </div>
                <div>
                    <form>
                        <input
                            type='text'
                            placeholder='⌕ Search'
                            value={query}
                            onChange={searchInputChange}
                            className='search-bar'
                        />
                    </form>
                </div>
                <div>
                    <ViewScoresNavigation queryInput={query} currentPage={page} setPage={setPage}/>
                </div>
            </main>
        </>
    )
}

export default TestReview;
