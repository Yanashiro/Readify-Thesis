import React from 'react'
import { useState, useEffect } from 'react'
import lockedImage from '../../images/locked.png'
import firstSteps from '../../images/first_steps.png'
import getAHang from '../../images/getting_the_hang_of_it.png'
import marathon from '../../images/marathon_reader.png'
import comprehensionStart from '../../images/comprehension_starter.png'
import sharpRead from '../../images/sharp_reader_2.png'
import ieltsStar from '../../images/IELTS_star.png'
import perfectScore from '../../images/perfect_score.png'
import elite from '../../images/elite_achiever.png'
import './achievements.css'
import axios from 'axios'

function Achievements() { 

    const [unlocked, setUnlocked] = useState([]);

    const achievementList = [
        {id: 'firstSteps', name: 'First Steps', desc: 'Completed first reading test', img: firstSteps},
        {id: 'getAHang', name: 'Getting the Hang of it', desc: 'Completed 5 tests', img: getAHang},
        {id: 'marathon', name: 'Marathon Reader', desc: 'Completed 10 tests', img: marathon},
        {id: 'comprehensionStart', name: 'Comprehension Starter', desc: 'Scored 50% or higher in a test', img: comprehensionStart},
        {id: 'sharpRead', name: 'Sharp Reader', desc: 'Scored 75% or higher in a test', img: sharpRead },
        {id: 'ieltsStar', name: 'IELTS Star', desc: 'Scored 90% or higher in a test', img: ieltsStar},
        {id: 'perfectScore', name: 'Perfect Score', desc: 'Scored 100% in one test', img: perfectScore},
        {id: 'elite', name: 'Elite Achiever', desc: 'Unlocked all achievements', img: elite}
    ]

    useEffect(() => {
        axios
            .post('/achievements')
            .then((res) => {
                setUnlocked(res.data)
            })
            .catch((err) => console.error(err))
    },[]) 

    /*
    const handleUnlock = (key) => {
        setUnlocked(prev => ({
            ...prev,
            [key]: true
        }));
    };
    */


    return (
        <>
            <div className='achievements-title'>
                <h1>Achievements</h1>
            </div>
            <div>
                {achievementList.map((ach) => (
                <div className="container" key={ach.id}>
                    <img src={unlocked[ach.id] ? ach.img : lockedImage} width={"80px"} height={"80px"} alt={ach.name}></img>
                    <div className='achievements-name-center'>
                        <p className="p-b"><b>{ach.name}</b></p>
                        <p className="p-a">{ach.desc}</p>
                    </div>
                </div>
                ))}
            </div>
        </>
    );
}

export default Achievements;
