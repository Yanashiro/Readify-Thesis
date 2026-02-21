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
        {title: 'firstSteps', name: 'First Steps', desc: 'Completed first reading test', img: firstSteps},
        {title: 'getAHang', name: 'Getting the Hang of it', desc: 'Completed 5 tests', img: getAHang},
        {title: 'marathon', name: 'Marathon Reader', desc: 'Completed 10 tests', img: marathon},
        {title: 'comprehensionStart', name: 'Comprehension Starter', desc: 'Scored 50% or higher in a test', img: comprehensionStart},
        {title: 'sharpRead', name: 'Sharp Reader', desc: 'Scored 75% or higher in a test', img: sharpRead },
        {title: 'ieltsStar', name: 'IELTS Star', desc: 'Scored 90% or higher in a test', img: ieltsStar},
        {title: 'perfectScore', name: 'Perfect Score', desc: 'Scored 100% in one test', img: perfectScore},
        {title: 'elite', name: 'Elite Achiever', desc: 'Unlocked all achievements', img: elite}
    ]

    useEffect(() => {
        axios
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            .get('/achievements', { withCredentials: true })
=======
            .get('/achievements')
>>>>>>> Stashed changes
=======
            .get('/achievements')
>>>>>>> Stashed changes
            .then((res) => {
                setUnlocked(res.data)
            })
            .catch((err) => console.error(err))
    },[]) 

    return (
        <>
            <main className='achievements-main'>
            <div className='achievements-title'>
                <h1>Achievements</h1>
            </div>
            <div>
                {achievementList.map((ach) => (
                <div className="container" key={ach.title}>
                    <img src={unlocked[ach.title] ? ach.img : lockedImage} width={"80px"} height={"80px"} alt={ach.name}></img>
                    <div className='achievements-name-center'>
                        <p className="p-b"><b>{ach.name}</b></p>
                        <p className="p-a">{ach.desc}</p>
                    </div>
                </div>
                ))}
            </div>
            </main>
        </>
    );
}

export default Achievements;

