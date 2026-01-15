import React from 'react'
import ReactDOM from 'react-dom/client'
import Navbar from './navbar'
import Login from './login'
import Signup from './signup'
import './maintestboard.css'

const container = document.getElementById('root');

if (container) {
    const root = ReactDOM.createRoot(container);

    const path = window.location.pathname;

    if (path === '/' || path === '/login') {
        root.render(
            <React.StrictMode>
                <Login />
            </React.StrictMode>
        );
    } else if (path === '/home') {
        root.render(
            <React.StrictMode>
                <Navbar />
            </React.StrictMode>
        );
    } else if (path === '/signup') {
        root.render(
            <React.StrictMode>
                <Signup />
            </React.StrictMode>
        )
    }
}
