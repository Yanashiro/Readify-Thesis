import React, { useEffect, useState } from 'react';
import './dashboard.css';
import axios from 'axios';

import pracTest from '../../images/practicetest.jpg';
import mainTest from '../../images/maintest.jpg';
import vocTest from '../../images/vocabularytest.jpg';
import tipsPic from '../../images/tipsntricks.jpg';

import locked from '../../images/locked.png';
import firstSteps from '../../images/first_steps.png';
import getAHang from '../../images/getting_the_hang_of_it.png';
import marathon from '../../images/marathon_reader.png';
import comprehensionStart from '../../images/comprehension_starter.png';

function Dashboard({ setPage, name }) {

    const [unlocked, setUnlocked] = useState({});

    const achievementList = [
        { name: 'First Steps', desc: 'Completed first reading test', img: firstSteps },
        { name: 'Getting the Hang of it', desc: 'Completed 5 tests', img: getAHang },
        { name: 'Marathon Reader', desc: 'Completed 10 tests', img: marathon },
        { name: 'Comprehension Starter', desc: 'Scored 50% or higher in a test', img: comprehensionStart }
    ];

    useEffect(() => {

        axios.get('/achievements', { withCredentials: true })
            .then(res => {

                const unlockedMap = {}

                res.data.data.forEach(a => {
                    unlockedMap[a.title] = true
                })

                setUnlocked(unlockedMap)

            })
            .catch(() => setUnlocked({}));

    }, []);

    return (
        <main className='dashboard-main'>

            <div className='head-name'>
                <h1 className='name-dashboard'>Welcome, {name || 'User'}!</h1>
            </div>

            <div className='top-three'>

                <div className='main-board'>
                    <button className="button-dashboard" onClick={() => setPage("Main Test")}>
                        <div className='main-title'><h2>Main Test</h2></div>
                        <div className='main-pic'><img className='main-img' src={mainTest} /></div>
                    </button>
                </div>

                <div className='practice-board'>
                    <button className="button-dashboard" onClick={() => setPage("Practice Test")}>
                        <div className='practice-title'><h2>Practice Test</h2></div>
                        <div className='practice-pic'><img className='main-img' src={pracTest} /></div>
                    </button>
                </div>

            </div>

            <div className='bottom-two'>

                <div className='vocabularytest'>
                    <button className="button-dashboard" onClick={() => setPage("Practice Test")}>
                        <div className='lower-title'><h2>Vocabulary Test</h2></div>
                        <div className='vocabulary-pic'><img className="lower-img" src={vocTest} /></div>
                    </button>
                </div>

                <div className='tipsntricks'>
                    <button className="button-dashboard" onClick={() => setPage("Tips & Tricks")}>
                        <div className='lower-title'><h2>Tips & Tricks</h2></div>
                        <div className='tipsandtricks-pic'><img className="lower-img" src={tipsPic} /></div>
                    </button>
                </div>

                <div className='achiev-board'>

                    <div className='achiev-title'>
                        <h2>Achievements</h2>
                    </div>

                    <div className='achiev-content'>

                        {achievementList.map(ach => (

                            <div className='achievement' key={ach.name}>

                                <img
                                    className='achiev-img'
                                    src={unlocked[ach.name] ? ach.img : locked}
                                    alt={ach.name}
                                />

                                <div>
                                    <p className='achiev-p-title'>{ach.name}</p>
                                    <p>{ach.desc}</p>
                                </div>

                            </div>

                        ))}

                    </div>

                    <div className='achieve-bottom'>
                        <button className='see-more' onClick={() => setPage("Achievements")}>
                            <p>See more</p>
                        </button>
                    </div>

                </div>

            </div>

        </main>
    );
}

export default Dashboard;