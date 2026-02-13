import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import { useCookies } from 'react-cookie';
import './profile.css'

function Profile() {

    const [cookie] = useCookies(['examinee-cookie'])

    const [details, setDetails] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const mainTestAttempts = [...attempts];

    useEffect(() => {

        const extractData = {
            examinee: cookie['examinee-cookie']
        }

        axios
            .get('/maintestAttempts', { params: extractData })
            .then((res) => {
                setAttempts(res.data.history || [])
                setDetails(res.data.user || res.data)
            })
            .catch((err) => console.error(err))
    }, [cookie])


    if (!details) {
    return <div className='profile-examinee'><h1>Loading Profile...</h1></div>;
    }

    return (
        <main className='profile-examinee'>
            <div className='profile-examinee-page'>
                <div className='flexbox-profile'>
                    <div className=''>
                        <p>Name: {details.name}</p>
                        <p>Username: {details.username}</p>
                        <p>Email: {details.email}</p>
                    </div>
                    <div className=''>
                        <p>Account Type: {details.accountType}</p>
                        <p>Date Created: {details.dateCreated}</p>
                    </div>
                </div>
                <div>
                    <table className="examinee-profile-table">
                        <thead className='ep-table-header'>
                            <tr>
                                <th>Attempt</th>
                                <th>Test</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mainTestAttempts.map((MTA, index) => (
                                <tr className='ep-table-body' key={MTA._id || index}>
                                    <td>{MTA.attempts || index + 1}</td>
                                    <td>{MTA.testType}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}

export default Profile;
