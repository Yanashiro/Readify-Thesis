// still under construction
import React from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'

import manageUser from '../../images/manageusers.jpg'
import viewScores from '../../images/viewscores.jpg'
import addPassages from '../../images/addpassages.jpg'
 
import './adminhome.css'

function AdminHome({setPage}) {
    const [cookie] = useCookies(['admin-cookie'])

    const dashboardLinks = [
        {id: 1, title: "Manage Users", img: manageUser, imgAlt: "Manage Users", clickMe: () => setPage('Manage Users')},
        {id: 2, title: "View Scores", img: viewScores, imgAlt: "View Scores", clickMe: () => setPage('Test Review')},
        {id: 3, title: "Add Passages", img: addPassages, imgAlt: "Add Passages", clickMe: () => setPage('Passage Creation')}
    ]


    return (
        <>
            <main className='adminhome'>
                <div>
                    <h2>Welcome, {cookie['admin-cookie'] || User}!</h2>
                </div>
                <div className='admin-board-flex'>
                    {dashboardLinks.map((dlink) => (
                        <div className='key-link' key={dlink.id}>
                            <div className='admin-board'>
                                <button className='admin-board-btn' onClick={dlink.clickMe}>
                                    <div className='dlink-title'>
                                        <h2 className='admin-title-img'>{dlink.title}</h2>
                                    </div>
                                    <div className='dlink-img'>
                                        <img className='admin-board-img' src={dlink.img} alt={dlink.imgAlt}></img>
                                    </div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    )
}

export default AdminHome;
