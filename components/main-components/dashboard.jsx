// still needs revisions after the removal of the vocabulary test tab

import React from 'react';
import './dashboard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import vocTest from '../../images/vocabularytest.png';
import pracTest from '../../images/practicetest.png';
import mainTest from '../../images/maintest.png';
import locked from '../../images/locked.png';
import firstSteps from '../../images/first_steps.png'
import getAHang from '../../images/getting_the_hang_of_it.png'
import marathon from '../../images/marathon_reader.png'
import comprehensionStart from '../../images/comprehension_starter.png'

function Dashboard() {

    const [firstName, setFirstName] = useState("");
    const [unlocked, setUnlocked] = useState({
        firstSteps: false,
        getAHang: false,
        marathon: false,
        comprehensionStart: false,
    });

    useEffect(() => {
        axios
            .get('/api/firstName')
            .then((res) => {
                setFirstName(res.data.firstName);
            })
            .catch((err) => {
                console.error(err);
            });
        
        axios 
            .get('/api/achievements')
            .then((res) => {
                setUnlocked(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [])


    return (
        <main className='dashboard-main'>
            <div className='head-name'>
                <h1 className='name'>Welcome, {firstName || 'User'}!</h1>
            </div>
            <div className='top-three'>
                <div className='main-board'>
                    <a href="/maintest.jsx" style={{textDecoration: 'none', color: 'black'}}>
                        <div className='main-title'>
                            <h2>Main Test</h2>
                        </div>
                        <div className='main-pic'>
                            <img className='main-img' src={mainTest}></img>
                        </div>
                    </a>
                </div>
                <div className='practice-board'>
                    <a href="/maintest.jsx" style={{textDecoration: 'none', color: 'black'}}>
                        <div className='practice-title'>
                            <h2>Practice Test</h2>
                        </div>
                        <div className='practice-pic'>
                            <img className='main-img' src={pracTest}></img>
                        </div>
                    </a>
                </div>
                <div className='voc-board'>
                    <a href="/maintest.jsx" style={{textDecoration: 'none', color: 'black'}}>
                        <div className='voc-title'>
                            <h2>Vocabulary Test</h2>
                        </div>
                        <div className='voc-pic'>
                            <img className='main-img' src={vocTest}></img>
                        </div>
                    </a>
                </div>
            </div>
            <div className='bottom-two'>
                <div className='act-board'>
                    <div className='act-title'>
                        <h2>Activity</h2>
                    </div>
                    <div className='act-content'>

                    </div>  
                </div>
                <div className='achiev-board'>
                    <div className='achiev-title'>
                        <h2>Achievements</h2>
                    </div>
                    <div className='achiev-content'>
                        <div className='achievement first-steps'>
                            <div>
                                <img className='achiev-img' src={unlocked.firstSteps ? firstSteps : locked}></img>
                            </div>
                            <div>
                                <p className='achiev-p-title'>First Steps</p>
                                <p>Completed first reading test</p>
                            </div>
                        </div>
                        <div className='achievement get-a-hang'>
                            <div>
                                <img className='achiev-img' src={unlocked.getAHang ? getAHang : locked}></img>
                            </div>
                            <div>
                                <p className='achiev-p-title'>Getting the Hang of it</p>
                                <p>Completed 5 tests</p>
                            </div>
                        </div>
                        <div className='achievement mar-reader'>
                            <div>
                                <img className='achiev-img' src={unlocked.marathon ? marathon : locked}></img>
                            </div>
                            <div>
                                <p className='achiev-p-title'>Marathon Reader</p>
                                <p>Completed 10 tests</p>
                            </div>
                        </div>
                        <div className='achievement comp-starter'>
                            <div>
                                <img className='achiev-img' src={unlocked.comprehensionStart ? comprehensionStart : locked}></img>
                            </div>
                            <div>
                                <p className='achiev-p-title'>Comprehension Starter</p>
                                <p>Scored 50% or higher in a test</p>
                            </div>
                        </div>
                    </div>
                    <div className='achieve-bottom'>
                        <button className='see-more'><p>See more</p></button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Dashboard;
