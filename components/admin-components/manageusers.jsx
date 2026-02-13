// still under construction

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './manageusers.css'

function PopupMessage({type, onClose, userData}) {

    const [selectedType, setSelectedType] = useState('');
    const [addMessage, setAddMessage] = useState('');
    const [editMessage, setEditMessage] = useState('');
    const [addData, setAddData] = useState({
        name: '',
        username: '',
        email: ''   
    });
    const [editData, setEditData] = useState({
        name: '',
        username: '',
        email: ''
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
            .post('/addSubmit', addData)
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

        if (!userData?.id) return; 

        axios
            .put(`/editSubmit/${userData.id}`, editData)
            .then((res) => {
                const serverMessage = res.data
                setEditMessage(serverMessage)
            })
            .catch((err) => console.error(err))
    }

    const deleteUser = (e) => {

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
                                    <label>Name</label>
                                    <div>
                                        <input className='addUser-input-design' name="name" type='text' onChange={addChange}></input>
                                    </div>
                                </div>
                                <div>
                                    <label>Username</label>
                                    <div>
                                        <input className='addUser-input-design' name="username" type='text' onChange={addChange}></input>
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
                                            <option value="student">Student</option>
                                            <option value="admin">Admin</option>
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
                            <h2>Edit User</h2>
                        </div>
                        <div className='editUser-form'>
                            <form className='editUser-form-class' onSubmit={editSubmit}>
                                <div>
                                    <label>Name</label>
                                    <div>
                                        <input className='editUser-input-design' type='text' onChange={editChange}></input>
                                    </div>
                                </div>
                                <div>
                                    <label>Username</label>
                                    <div>
                                        <input className='editUser-input-design' type='text' onChange={editChange}></input>
                                    </div>
                                </div>
                                <div>
                                    <label>Account Type</label>
                                    <div>
                                        <select
                                            className='editUser-select-design'
                                            id="accountType"
                                            value={editData.name}
                                            onChange={(e) => setSelectedType(e.target.value)}
                                        >
                                            <option value="student">Student</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label>Email</label>
                                    <div>
                                        <input className='editUser-input-design' type='text' onChange={editChange}></input>
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
                                <h2>Delete User</h2>
                            </div>
                            <div className='deleteUser-message'>
                                <p>Are you sure you want to delete user {userData}</p>
                            </div>
                            <div className='deleteUser-buttons'>
                                <div>
                                    <button>Cancel</button>
                                </div>
                                <div>
                                    <button onClick={deleteUser}>Delete User</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}


function ManageUsers() {

    const [query, setQuery] = useState('');
    const [accountList, setAccountList] = useState([]);

    const [popupType, setPopupType] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    }

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
            <main className='manage-users-main'>
                <div className='manage-users-header'>
                    <div className='manage-users-title'>
                        <h2>Manage Users</h2>
                    </div>
                    <div className='manage-users-adduser'>
                        <button onClick={() => setPopupType('add')}>
                            Add User
                        </button>
                    </div>
                </div>
                <div className='div-centralize'>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input 
                            type='text'
                            placeholder='⌕ Search'
                            value={query}
                            onChange={handleInputChange}
                            className='search-bar'
                        /> 
                    </form>
                </div>
                <div className='div-centralize'>
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
                            <td><button onClick={() => {setSelectedUser(fsl); setPopupType('edit')}}>Edit</button><button onClick={() => {setSelectedUser(fsl); setPopupType('delete')}}>Delete</button></td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <PopupMessage type={popupType} onClose={() => {setSelectedUser(null); setPopupType(null)}} userData={selectedUser}/>
            </main>
        </>
    )
}

export default ManageUsers
