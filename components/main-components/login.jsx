import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import './login.css';

function Login() {
    // react state variable for remembering username and password
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    // function for the react state interacting with <input>
    const handleChange = (e) => {
        setFormData({
            ...formData,
            // assigning inputs for formData
            [e.target.name]: e.target.value
        })
    }
    // function for sending state variable data to /login backend
    const handleSubmit = (e) => {
        //preventDefault() prevents the browser from refreshing every submission
        e.preventDefault();
        //axios is a promise-based HTTP-client for Node.js on the browser
        axios.post('/api/login', formData)
            .then(res => console.log("Server received", res.data))
            .catch(err => console.error(err));
    }
    
    return (
        <main className="login-main">
            <div className="login-title">
                <h1 className='h1-readify'>Readify</h1>
                <h5 className='h5-login'>Login</h5>
            </div>
            <div className='div-form'>
                <form className="login-form" onSubmit={handleSubmit} method='post'>
                    <div className='form-align'>    
                        <div className='form-group'>
                            <div className='label-align'>
                                <label for="name"><p className='label-design'>Name:</p></label>
                            </div>
                            <div className='input-align'>
                                <input className="login-input" type='text' id="name" name='username' value={formData.username} onChange={handleChange} placeholder='Enter your Username' required autoComplete='off' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <div className='label-align'>
                                <label for='password'><p className='label-design'>Password</p></label>
                            </div>
                            <div className='input-align'>
                                <input className="login-input" type='password' name="password" value={formData.password} onChange={handleChange} id='password' placeholder='Password' required />
                            </div>
                        </div>
                    <p className='dont-have-account'>Don't have an account? <a href="/signup.jsx" className='signup-href'>Signup</a></p>
                    <button type="submit" className='submit-btn' onClick={handleSubmit}><p className='login-btn'>Login</p></button>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default Login;
