import React from 'react'
import ReactDOM from 'react-dom/client'
import Navbar from './main-components/navbar'
import Login from './main-components/login'
import Signup from './main-components/signup'
import './main-components/maintestboard.css'
import MainTestRoute from './maintestrouter'
import PracticeTestRoute from './practicetestrouter'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <CookiesProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/home" element={<Navbar />} />

                    <Route path="/maintest/*" element={<MainTestRoute />} />
                    <Route path="/practicetest/*" element={<PracticeTestRoute/>} />
                </Routes>
            </CookiesProvider>
        </BrowserRouter>
    </React.StrictMode>
);
