import react from 'react';
import { useState } from 'react';
import axios from 'axios';
import './signup.css';

/*function AlreadyExist() {
    // add If this functionality is needed in the future
}*/

function Signup() {
    /*
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
    });

    const changeData = (e) => {
        setFormData({
            ...formData,
            // assigning inputs for formData
            [e.target.name]: e.target.value
        })
    }

    const submitData = (e) => {
        e.preventDefault();

        axios.post('/signup', formData)
        .then(res => console.log("Server received", res.data))
        .catch(err => console.error(err));
    }*/

    return (
        <>
        <main className="signup-main">
            <div className="signup-title">
                <h1 className='h1-readify'>Readify</h1>
                <h5 className='h5-signup'>Login</h5>
            </div>
            <div className='div-form'>
                <form className="signup-form" action='/signup' method='post'>
                    <div className='form-align'>  
                        <div className='form-group'>
                            <div className='label-align'>
                                <label for="email"><p className='label-design'>Email:</p></label>
                            </div>
                            <div className='input-align'>
                                <input className="signup-input" type='text' id="email" name='email' placeholder='Enter your Email' required />
                            </div>
                        </div>  
                        <div className='form-group'>
                            <div className='label-align'>
                                <label for="name"><p className='label-design'>Username:</p></label>
                            </div>
                            <div className='input-align'>
                                <input className="signup-input" type='text' id="name" name='username' placeholder='Enter your Username' required />
                            </div>
                        </div>
                        <div className='form-group'>
                            <div className='label-align'>
                                <label for='password'><p className='label-design'>Password:</p></label>
                            </div>
                            <div className='input-align'>
                                <input className="signup-input" type='password' name="password" id='password' placeholder='Password' required />
                            </div>
                        </div>
                    <p className='have-account'>Already have an account? <a href="/" className='login-href'>Login</a></p>
                    <button type="submit" className='submit-btn'><p className='signup-btn'>Sign Up</p></button>
                    </div>
                </form>
            </div>
        </main>
        </>
    );
};

export default Signup;
