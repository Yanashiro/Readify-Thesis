import react from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css';

/*function AlreadyExist() {
    // add If this functionality is needed in the future
}*/

function Signup() {
    
    const navigate = useNavigate()
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

        axios.post('/signup', formData)
        .then(res => {
            console.log("Server received", res.data)
        })
        .catch(err => console.error(err));

        navigate('/login')
    }

    return (
        <>
        <main className="signup-main">
            <div className="signup-title">
                <h1 className='h1-readify'>Readify</h1>
                <h5 className='h5-signup'>Login</h5>
            </div>
            <div className='div-form'>
                <form className="signup-form" onSubmit={submitData} method='post'>
                    <div className='form-align'>  
                        <div className='form-group'>
                            <div className='label-align'>
                                <label htmlFor="email"><p className='label-design'>Email:</p></label>
                            </div>
                            <div className='input-align'>
                                <input className="signup-input" type='text' id="email" name='email' onChange={changeData} placeholder='Enter your Email' required />
                            </div>
                        </div>  
                        <div className='form-group'>
                            <div className='label-align'>
                                <label htmlFor="name"><p className='label-design'>Username:</p></label>
                            </div>
                            <div className='input-align'>
                                <input className="signup-input" type='text' id="name" name='username' onChange={changeData} placeholder='Enter your Username' required />
                            </div>
                        </div>
                        <div className='form-group'>
                            <div className='label-align'>
                                <label htmlFor='password'><p className='label-design'>Password:</p></label>
                            </div>
                            <div className='input-align'>
                                <input className="signup-input" type='password' name="password" id='password' onChange={changeData} placeholder='Password' required />
                            </div>
                        </div>
                    <p className='have-account'>Already have an account? <Link to="/" className='login-href'>Login</Link></p>
                    <button type="submit" className='submit-btn' onSubmit={submitData}><p className='signup-btn'>Sign Up</p></button>
                    </div>
                </form>
            </div>
        </main>
        </>
    );
};

export default Signup;
