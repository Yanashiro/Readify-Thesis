import React from 'react'
import Navbar from './main-components/navbar'
import Login from './main-components/login'
import Signup from './main-components/signup'
import './main-components/maintestboard.css'
import MainTestRoute from './maintestrouter'
import PracticeTestRoute from './practicetestrouter'
import PassageCreationRoute from './passagecreationrouter'
import { Routes, Route } from 'react-router-dom'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>         
            <Route path="/home" element={<Navbar/>}/>

            <Route path='/maintest/*' element={<MainTestRoute/>}/>
            <Route path='/practicetest/*' element={<PracticeTestRoute/>}/>

            <Route path='/passageroute/*' element={<PassageCreationRoute/>}/>
        </Routes>
    )
}

export default App;