import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./login.css";

function Login() {
    const [message, setMessage] = useState("");
    const [designation, setDesignation] = useState("")

    const navigate = useNavigate();
    // react state variable for remembering username and password
    const [formData, setFormData] = useState({
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
                identifier: formData.username,
                password: formData.password,
            }, {withCredentials: true});

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
                                    <label for="name">
                                        <p className="label-design">Username:</p>
                                    </label>
                                </div>
                                <div className="input-align">
                                    <input
                                        className="login-input"
                                        type="text"
                                        id="name"
                                        name="username"
                                        placeholder="Enter your Username"
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
                                        placeholder="Password"
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
