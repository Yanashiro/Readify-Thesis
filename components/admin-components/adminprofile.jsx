import react from 'react' 
import { useState, useEffect } from 'react'
import axios from 'axios'
import './adminprofile.css'

function AdminProfile() {

    const [details, setDetails] = useState(null);

    useEffect(() => {

        axios   // change path name once the feature is added
            .get('/profile', { withCredentials: true })
            .then((res) => {
                setDetails(res.data)
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
                        <p>Date Created: {details.dateCreated}</p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AdminProfile;