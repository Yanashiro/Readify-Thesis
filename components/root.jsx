import React from 'react'
import ReactDOM from 'react-dom/client'
import Navbar from './main-components/navbar'
import Login from './main-components/login'
import Signup from './main-components/signup'
import './maintestboard.css'
import MainTestRoute from './maintestrouter'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Navbar />} />

                <Route path="/maintest/*" element={<MainTestRoute />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
