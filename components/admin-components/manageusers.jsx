// still under construction

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './manageusers.css'

function PopupMessage({ type, onClose, userData }) {

	const [showPopup, setShowPopup] = useState(true);


	const [selectedType, setSelectedType] = useState('');
	const [addMessage, setAddMessage] = useState('');
	const [editMessage, setEditMessage] = useState('');
	const [deleteMessage, setDeleteMessage] = useState('');
	const [addData, setAddData] = useState({
		name: '',
		password: '',
		email: '',
		isAdmin: null
	});
	const [editData, setEditData] = useState({
		name: '',
		password: '',
		email: '',
		isAdmin: null
	});

	const addChange = (e) => {
		setAddData({
			...addData,
			[e.target.name]: e.target.value,
		});
	};

	const addSubmit = (e) => {
		e.preventDefault();

		axios
			.post('/UserManagement/create', addData)
			.then((res) => {
				const serverMessage = res.data
				setAddMessage(serverMessage)
			})
			.catch((err) => console.error(err))
	}

	const editChange = (e) => {
		setEditData({
			...editData,
			[e.target.name]: e.target.value,
		});
	};

	const editSubmit = (e) => {
		e.preventDefault();

		if (!userData?._id) return;

		axios
			.post(`/UserManagement/update/${userData._id}`, editData)
			.then((res) => {
				const serverMessage = res.data
				setEditMessage(serverMessage)
			})
			.catch((err) => console.error(err))
	}

	useEffect(() => {
		if (type === 'edit' && userData) {
			setEditData({
				name: userData.name,
				username: userData.username,
				email: userData.email
			});
			setSelectedType(userData.isAdmin);
		}
	}, [type, userData])

	const deleteUser = (e) => {
		axios
			.get(`/UserManagement/delete/${userData._id}`)
			.then((res) => {
				const serverMessage = res.data
				setDeleteMessage(serverMessage)
			})
			.catch((err) => console.error(err));
	}

	if (!type) return null;

	return (



		<div className='addUser-space'>
			<div className='addUser-notification-box'>
				{type === 'add' && (
					<div>
						<div>
							<div className='addUser-title'>
								<h2>Add User</h2>
							</div>
							<div className='addUser-form'>
								<form className='addUser-form-class' onSubmit={addSubmit}>
									<div>
										<label>Username</label>
										<div>
											<input className='addUser-input-design' name="username" type='text' onChange={addChange}></input>
										</div>
									</div>
									<div>
										<label>Password</label>
										<div>
											<input className='addUser-input-design' name="password" type='text' onChange={addChange}></input>
										</div>
									</div>
									<div>
										<label>Account Type</label>
										<div>
											<select
												className='addUser-select-design'
												id="accountType"
												value={selectedType}
												onChange={(e) => setSelectedType(e.target.value)}
											>
												<option value="false">Student</option>
												<option value="true">Admin</option>
											</select>
										</div>
									</div>
									<div>
										<label>Email</label>
										<div>
											<input className='addUser-input-design' name="email" type='text' onChange={addChange}></input>
										</div>
									</div>
								</form>
								{addMessage}
								<div className='addUser-options-btn'>
									<div>
										<button className="addUser-cancel-btn" onClick={onClose}>Cancel</button>
									</div>
									<div>
										<button className='addUser-submit-btn' onClick={addSubmit}>Add User</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				{type === 'edit' && (
					<div>
						<div className='editUser-title'>
							<h2>Edit User {editData.name}</h2>
						</div>
						<div className='editUser-form'>
							<form className='editUser-form-class' onSubmit={editSubmit}>
								<div>
									<label>Username</label>
									<div>
										<input className='editUser-input-design' type='text' name='name' value={editData.name} onChange={editChange}></input>
									</div>
								</div>
								<div>
									<label>Password</label>
									<div>
										<input className='editUser-input-design' type='text' name='password' value={editData.password} onChange={editChange}></input>
									</div>
								</div>
								<div>
									<label>Account Type</label>
									<div>
										<select
											className='editUser-select-design'
											id="accountType"
											value={editData.isAdmin}
											onChange={(e) => setSelectedType(e.target.value)}
										>
											<option value="false">Student</option>
											<option value="true">Admin</option>
										</select>
									</div>
								</div>
								<div>
									<label>Email</label>
									<div>
										<input className='editUser-input-design' type='text' name='email' value={editData.email} onChange={editChange}></input>
									</div>
								</div>
							</form>
							{editMessage}
							<div className='editUser-options-btn'>
								<div>
									<button className="editUser-cancel-btn" onClick={onClose}>Cancel</button>
								</div>
								<div>
									<button className='editUser-submit-btn' onClick={editSubmit}>Edit User</button>
								</div>
							</div>
						</div>
					</div>
				)}
				{type === 'delete' && (
					<>
						<div>
							<div className='deleteUser-title'>
								<h2>Delete User {userData?.name}?</h2>
							</div>
							<div className='deleteUser-message'>
								<p>Are you sure you want to delete user {userData?.name}?</p>
							</div>
							<div className='deleteUser-buttons'>
								<div>
									<button className='deleteuser-cancel' onClick={onClose}>Cancel</button>
								</div>
								<div>
									<button className='deleteuser-button' onClick={deleteUser}>Delete User</button>
								</div>
							</div>
							{deleteMessage}
						</div>
					</>
				)}
			</div>
		</div>
	)
}


function ManageUsers() {
  const [activityUser, setActivityUser] = useState(null);
  const [showActivityPopup, setShowActivityPopup] = useState(false);

  const [query, setQuery] = useState("");
  const [accountList, setAccountList] = useState([]);

  const [popupType, setPopupType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // ------------------ FILTER ------------------
  const filteredAndSortedList = [...accountList]
    .filter((user) => {
      const search = query.toLowerCase();

      return (
        (user.name || "").toLowerCase().includes(search) ||
        (user.email || "").toLowerCase().includes(search) ||
        (user.isAdmin ? "admin" : "student").includes(search)
      );
    })
    .sort((a, b) => (a.name || "").localeCompare(b.name));

  // ------------------ FETCH USERS ------------------
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/UserManagement");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        const sortedData = data.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setAccountList(sortedData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <>
      {/* ================= ACTIVITY POPUP ================= */}
      {showActivityPopup && activityUser && (
        <div className="popup-overlay">
          <div className="popup-content large-popup">
            <h3>User Activity: {activityUser.name}</h3>

            {(() => {
              const mainTests = activityUser.testHistory.filter(
                (t) => t.testDesignation === true
              );

              const practiceTests = activityUser.testHistory.filter(
                (t) => t.testDesignation === false
              );

              return (
                <>
                  {/* -------- MAIN TEST -------- */}
                  <h4>Main Test</h4>
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Attempt</th>
                        <th>Test Type</th>
                        <th>Score</th>
                        <th>Date</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mainTests.length === 0 ? (
                        <tr>
                          <td colSpan="5">No attempts</td>
                        </tr>
                      ) : (
                        mainTests.map((test, index) => (
                          <tr key={test._id}>
                            <td>{index + 1}</td>
                            <td>{test.testType}</td>
                            <td>
                              {test.score}/{test.totalQuestions}
                            </td>
                            <td>
                              {new Date(test.takenAt).toLocaleString()}
                            </td>
                            <td>
                              <button
                                style={{ color: "red" }}
                                onClick={async () => {
                                  if (!window.confirm("Delete this attempt?"))
                                    return;

                                  try {
                                    const response = await fetch("/attempt", {
                                      method: "DELETE",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        userId: activityUser._id,
                                        attemptId: test._id,
                                      }),
                                    });

                                    const data = await response.json();

                                    if (data.status === "success") {
                                      setActivityUser((prev) => ({
                                        ...prev,
                                        testHistory:
                                          prev.testHistory.filter(
                                            (t) => t._id !== test._id
                                          ),
                                      }));
                                    }
                                  } catch (err) {
                                    console.error("Delete failed:", err);
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* -------- PRACTICE TEST -------- */}
                  <h4 style={{ marginTop: "30px" }}>Practice Test</h4>
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Attempt</th>
                        <th>Test Type</th>
                        <th>Score</th>
                        <th>Date</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {practiceTests.length === 0 ? (
                        <tr>
                          <td colSpan="5">No attempts</td>
                        </tr>
                      ) : (
                        practiceTests.map((test, index) => (
                          <tr key={test._id}>
                            <td>{index + 1}</td>
                            <td>{test.testType}</td>
                            <td>
                              {test.score}/{test.totalQuestions}
                            </td>
                            <td>
                              {new Date(test.takenAt).toLocaleString()}
                            </td>
                            <td>
                              <button
                                style={{ color: "red" }}
                                onClick={async () => {
                                  if (!window.confirm("Delete this attempt?"))
                                    return;

                                  try {
                                    const response = await fetch("/attempt", {
                                      method: "DELETE",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        userId: activityUser._id,
                                        attemptId: test._id,
                                      }),
                                    });

                                    const data = await response.json();

                                    if (data.status === "success") {
                                      setActivityUser((prev) => ({
                                        ...prev,
                                        testHistory:
                                          prev.testHistory.filter(
                                            (t) => t._id !== test._id
                                          ),
                                      }));
                                    }
                                  } catch (err) {
                                    console.error("Delete failed:", err);
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </>
              );
            })()}

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button onClick={() => setShowActivityPopup(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN PAGE ================= */}
      <main className="manage-users-main">
        <div className="manage-users-header">
          <div className="manage-users-title">
            <h2>Manage Users</h2>
          </div>

          <div className="manage-users-adduser">
            <button onClick={() => setPopupType("add")}>Add User</button>
          </div>
        </div>

        <div className="div-centralize">
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="⌕ Search by name, username, or email"
              value={query}
              onChange={handleInputChange}
              className="search-bar"
            />
          </form>
        </div>

        <div className="div-centralize">
          <div className="manageusers-table-setter">
            <table>
              <thead className="mu-table-head">
                <tr className="manageusers-table-header">
                  <th>Name</th>
                  <th>Username</th>
                  <th>Account Type</th>
                  <th>Email</th>
                  <th>Date Created</th>
                  <th></th>
                </tr>
              </thead>

              <tbody className="mu-table-body">
                {filteredAndSortedList.map((fsl) => (
                  <tr key={fsl._id}>
                    <td>{fsl.name}</td>
                    <td>{fsl.name}</td>
                    <td>{fsl.isAdmin ? "Admin" : "Student"}</td>
                    <td>{fsl.email}</td>
                    <td>{fsl.dateCreated}</td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedUser(fsl);
                          setPopupType("edit");
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setSelectedUser(fsl);
                          setPopupType("delete");
                        }}
                      >
                        Delete
                      </button>

                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(
                              `/user?userId=${fsl._id}`
                            );
                            const data = await response.json();

                            if (data.status === "success") {
                              setActivityUser(data.data);
                              setShowActivityPopup(true);
                            }
                          } catch (err) {
                            console.error(
                              "Error fetching activity:",
                              err
                            );
                          }
                        }}
                      >
                        Activity
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <PopupMessage
          type={popupType}
          onClose={() => {
            setSelectedUser(null);
            setPopupType(null);
          }}
          userData={selectedUser}
        />
      </main>
    </>
  );
}

export default ManageUsers;


