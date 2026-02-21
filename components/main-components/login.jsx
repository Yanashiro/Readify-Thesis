import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./login.css";
<<<<<<< Updated upstream
<<<<<<< Updated upstream

// ================================================= 
/*

    Message: User session status is managed on Navbar.jsx
    which is the primary page for navigating by both student
    and admin, it is where it also have the logic to change
    viewing components based on the account status as 
    
            isAdmin ? true : false

*/
// ================================================= 


=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

function Login() {
    const [message, setMessage] = useState("");
    const [designation, setDesignation] = useState("")

    const navigate = useNavigate();
    // react state variable for remembering username and password
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
    });
    //const [link, setLink] = useState('')

    //const [message, setMessage] = useState(false)
    // function for the react state interacting with <input>
    const handleChange = (e) => {
        setFormData({
            ...formData,
            // assigning inputs for formData
            [e.target.name]: e.target.value,
        });
    };

    // function to create cookies and perform submit to remove credentials on the input field
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await axios.post("/Login", {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                identifier: formData.email,
                password: formData.password,
            }, {withCredentials: true});
=======
                identifier: formData.username,
                password: formData.password,
            });
>>>>>>> Stashed changes
=======
                identifier: formData.username,
                password: formData.password,
            });
>>>>>>> Stashed changes

            if (res.data.success) {
                navigate('/home');
            } else {
                setMessage(res.data.message || "Invalid credentials");
            }
        } catch (err) {
                console.error(err);
                setMessage("Login failed. Please try again")
        }
    };

    return (
            <main className="login-main">
                <div className="login-title">
                    <h1 className="h1-readify">Readify</h1>
                    <h5 className="h5-login">Login</h5>
                </div>
                <div className="div-form">
                    <form
                        className="login-form"
                        method="post"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-align">
                            <div className="form-group">
                                <div className="label-align">
<<<<<<< Updated upstream
                                    <label htmlFor="name">
                                        <p className="label-design">Email:</p>
=======
                                    <label for="name">
                                        <p className="label-design">Username:</p>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                                    </label>
                                </div>
                                <div className="input-align">
                                    <input
                                        className="login-input"
                                        type="text"
                                        id="name"
                                        name="email"
                                        placeholder="Enter your Email"
                                        onChange={handleChange}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="label-align">
                                    <label for="password">
                                        <p className="label-design">
                                            Password:
                                        </p>
                                    </label>
                                </div>
                                <div className="input-align">
                                    <input
                                        className="login-input"
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder=""
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <p className="dont-have-account">
                                Don't have an account?{" "}
                                <Link to="/signup" className="signup-href">
                                    Signup
                                </Link>
                            </p>
                            <button
                                type="submit"
                                className="submit-btn"
                            >
                                <p className="login-btn">Login</p>
                            </button>
                        </div>
                    </form>
                    <p>{message}</p>
                </div>
            </main>
    );
}

export default Login;

