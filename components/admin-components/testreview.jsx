import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import "./testreview.css";

function ViewScoresNavigation({
    queryInput,
    currentPage,
    setPage,
    selectedAccount,
    setSelectedAccount,
    selectedAttempt,
    setSelectedAttempt,
}) {
    switch (currentPage) {
        case "Account List":
            return (
                <AccountList
                    query={queryInput}
                    setPage={setPage}
                    setSelectedAccount={setSelectedAccount}
                />
            );
        case "Account":
            return (
                <AccountFunction
                    setPage={setPage}
                    account={selectedAccount}
                    setSelectedAttempt={setSelectedAttempt}
                />
            );
        case "Attempt":
            return (
                <AttemptFunction setPage={setPage} attempt={selectedAttempt} />
            );
        default:
            return (
                <AccountList
                    query={queryInput}
                    setPage={setPage}
                    setSelectedAccount={setSelectedAccount}
                />
            );
    }
}

function AccountList({ query, setPage, setSelectedAccount }) {
    const [accountList, setAccountList] = useState([]);

    const filteredAndSortedList = accountList
        .filter((user) => {
            const searchTerm = query.toLowerCase();
            return (
                user.name.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm)
            );
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    useEffect(() => {
        axios
            .post("/accountlist")
            .then((res) => {
                const sortedData = res.data.sort((a, b) =>
                    a.name.localeCompare(b.name),
                );
                setAccountList(sortedData);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <table>
                <thead>
                    <tr className="manageusers-table-header">
                        <th>Name</th>
                        <th>Username</th>
                        <th>Account Type</th>
                        <th>Email</th>
                        <th>Date Created</th>
                        <th></th>
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
                            <td>
                                <button
                                    onClick={() => {
                                        setSelectedAccount(fsl);
                                        setPage("Account");
                                    }}
                                >
                                    〉
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function AccountFunction({ setPage, account, setSelectedAttempt }) {
    const [examAttempts, setExamAttempts] = useState([]);

    useEffect(() => {
        if (!account) return;
        axios
            .get("/accountAttempts", { params: { examinee: account.name } })
            .then((res) => setExamAttempts(res.data))
            .catch((err) => console.error(err));
    }, [account]);

    return (
        <>
            <div>
                <button onClick={() => setPage("Account List")}>〈 Back</button>
            </div>
            <div className="accountPage-flex">
                <div>
                    <div>
                        <p>Name: {account?.name}</p>
                    </div>
                    <div>
                        <p>Username: {account?.username}</p>
                    </div>
                    <div>
                        <p>Email: {account?.email}</p>
                    </div>
                </div>
                <div>
                    <div>
                        <p>Account Type: {account?.accountType}</p>
                    </div>
                    <div>
                        <p>Date Created: {account?.dateCreated}</p>
                    </div>
                </div>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Attempt</th>
                            <th>Test Category</th>
                            <th>Type</th>
                            <th>Score</th>
                            <th>Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {examAttempts.map((EA, index) => (
                            <tr key={EA._id || index}>
                                <td>{index + 1}</td>
                                <td>{EA.testCategory}</td>
                                <td>{EA.testType}</td>
                                <td>
                                    {EA.score}/{EA.totalQuestions}
                                </td>
                                <td>
                                    {new Date(EA.testDate).toLocaleDateString()}
                                </td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setSelectedAttempt(EA);
                                            setPage("Attempt");
                                        }}
                                    >
                                        〉
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function AttemptFunction({ setPage, attempt }) {
    return (
        <>
            <div>
                <button onClick={() => setPage("Account")}>〈 Back</button>
            </div>
            <div>
                <h3>
                    {attempt?.testCategory} ({attempt?.testType})
                </h3>
                <p>
                    Score: {attempt?.score}/{attempt?.totalQuestions}
                </p>
                <p>
                    Band:{" "}
                    {attempt?.totalQuestions > 0
                        ? Math.ceil(
                              (attempt.score / attempt.totalQuestions) * 9,
                          )
                        : 0}
                </p>
                <p>
                    Date:{" "}
                    {attempt?.testDate
                        ? new Date(attempt.testDate).toLocaleString()
                        : ""}
                </p>
            </div>
            <div>
                <h4>Submitted Answers</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Answer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attempt?.submittedAnswers &&
                            Object.entries(attempt.submittedAnswers).map(
                                ([qNum, answer]) => (
                                    <tr key={qNum}>
                                        <td>{qNum}</td>
                                        <td>{answer}</td>
                                    </tr>
                                ),
                            )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function TestReview() {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState("Account List");
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [selectedAttempt, setSelectedAttempt] = useState(null);

    const searchInputChange = (e) => {
        setQuery(e.target.value);
    };

    return (
        <main className="admin-test-review">
            <div>
                <h1>View Scores</h1>
            </div>
            <div>
                <form>
                    <input
                        type="text"
                        placeholder="⌕ Search"
                        value={query}
                        onChange={searchInputChange}
                        className="search-bar"
                    />
                </form>
            </div>
            <div>
                <ViewScoresNavigation
                    queryInput={query}
                    currentPage={page}
                    setPage={setPage}
                    selectedAccount={selectedAccount}
                    setSelectedAccount={setSelectedAccount}
                    selectedAttempt={selectedAttempt}
                    setSelectedAttempt={setSelectedAttempt}
                />
            </div>
        </main>
    );
}

export default TestReview;
