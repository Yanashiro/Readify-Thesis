import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <CookiesProvider>
                <App />
            </CookiesProvider>
        </BrowserRouter>
    </React.StrictMode>
);
