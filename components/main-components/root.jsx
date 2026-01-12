//Note: root.jsx is still on the development phase to determine how it will respond to EJS rendering

import React from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import './maintestboard.css'
import App from './app'
import Navbar from './navbar'
import TipsnTricks from './tipsntricks'
import Login from './login'

const root = ReactDOM.createRoot(document.getElementById('root'));



function renderMainTestPage(a) {
    
   /* switch(a) {
        case '/Home':
            return (
                render(
                <React.StrictMode>
                    <Navbar />
                </React.StrictMode>
                )
            );
            break;
        case '/Login':
            return (
                render(
                    <React.StrictMode>
                        <Login />
                    </React.StrictMode>
                )
            )
            break;
        default:
            return(
                render(
                    <React.StrictMode>
                        <Login />
                    </React.StrictMode>
                )
            )
    } */

    a.render(
        <React.StrictMode>
            <Navbar/>
        </React.StrictMode>
    )
}

renderMainTestPage(root);
