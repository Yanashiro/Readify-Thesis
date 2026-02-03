import React, { useEffect } from 'react';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';
/*function Wrongcredentials(wrongcredentials, isVisible) {
    
    if (!isVisible) return null;

    if (wrongcredentials === true) {
        return(
            <>
                <p className='wrongcredentials'>Incorrect Username or Password</p>
            </>
        )
    } 
}*/

function Login() {

    const [account, setAccount] = useCookies(['examinee-cookie'])
    const [message, setMessage] = useState('')

    // react state variable for remembering username and password
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    //const [link, setLink] = useState('')

    //const [message, setMessage] = useState(false)
    // function for the react state interacting with <input>
    const handleChange = (e) => {
        setFormData({
            ...formData,
            // assigning inputs for formData
            [e.target.name]: e.target.value
        })
    }

    /*const active = (e) => {
        setLink(e)
    }*/
    // function to create cookies and perform submit to remove credentials on the input field
    const handleSubmit = () => {
        setAccount('examinee-cookie', formData.username, {path: '/'})
    }

    useEffect(() => {
        axios
            .post('/login')
            .then((res) => {
                setMessage([res.body])
            })
            .catch((err) => console.error(err));
    }, [message])
    
    return (
        <>
        <main className="login-main">
            <div className="login-title">
                <h1 className='h1-readify'>Readify</h1>
                <h5 className='h5-login'>Login</h5>
            </div>
            <div className='div-form'>
                <form className="login-form" action='/login' method="post" onSubmit={handleSubmit}>
                    <div className='form-align'>    
                        <div className='form-group'>
                            <div className='label-align'>
                                <label for="name"><p className='label-design'>Name:</p></label>
                            </div>
                            <div className='input-align'>
                                <input className="login-input" type='text' id="name" name='username' placeholder='Enter your Username' onChange={handleChange} required autoComplete='off' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <div className='label-align'>
                                <label for='password'><p className='label-design'>Password:</p></label>
                            </div>
                            <div className='input-align'>
                                <input className="login-input" type='password' name="password" id='password' placeholder='Password' onChange={handleChange} required />
                            </div>
                        </div>
                    <p className='dont-have-account'>Don't have an account? <a href="/signup" className='signup-href'>Signup</a></p>
                    <button type="submit" className='submit-btn' onClick={handleSubmit}><p className='login-btn'>Login</p></button>
                    </div>
                </form>
                <p>{message}</p>
            </div>
        </main>
        </>
    )
}

export default Login;
