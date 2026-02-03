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

    const [unlocked, setUnlocked] = useState({
        firstSteps: false,
        getAHang: false,
        marathon: false,
        comprehensionStart: false,
        sharpRead: false,
        ieltsStar: false,
        perfectScore: false,
        elite: false 
    });
    // I'm not sure how fetch works
    useEffect(() => {
        axios
            .post('/achievements')
            .then((res) => {
                setUnlocked(res.data)
            })
            .catch((err) => console.error(err))
    },[unlocked]) 


    const handleUnlock = (key) => {
        setUnlocked(prev => ({
            ...prev,
            [key]: true
        }));
    };

    return (
        <>
            <div className='achievements-title'>
                <h1>Achievements</h1>
            </div>
            <div>
                <div className="container" onClick={() => handleUnlock('firstSteps')}>
                    <img src={unlocked.firstSteps ? firstSteps : lockedImage} width={"80px"} height={"80px"}></img>
                    <div className='achievements-name-center'>
                        <p className="p-b"><b>First Steps</b></p>
                        <p className="p-a">Completed first reading test</p>
                    </div>
                </div>
                <div className="container" onClick={() => handleUnlock('getAHang')}>
                    <img src={unlocked.getAHang ? getAHang : lockedImage} width={"80px"} height={"80px"}></img>
                    <div className='achievements-name-center'>
                        <p className="p-b"><b>Getting the Hang of it</b></p>
                        <p className="p-a">Completed 5 tests</p>
                    </div>
                </div>
                <div className="container" onClick={() => handleUnlock('marathon')}>
                    <img src={unlocked.marathon ? marathon : lockedImage} width={"80px"} height={"80px"}></img>
                    <div className='achievements-name-center'>
                        <p className="p-b"><b>Marathon Reader</b></p>
                        <p className="p-a">Completed 10 tests</p>
                    </div>
                </div>
                <div className="container" onClick={() => handleUnlock('comprehensionStart')}>
                    <img src={unlocked.comprehensionStart ? comprehensionStart : lockedImage} width={"80px"} height={"80px"}></img>
                    <div className='achievements-name-center'>
                        <p className="p-b"><b>Comprehension Starter</b></p>
                        <p className="p-a">Scored 50% or higher in a test</p>
                    </div>
                </div>
                <div className="container" onClick={() => handleUnlock('sharpRead')}>
                    <img src={unlocked.sharpRead ? sharpRead : lockedImage} width={"80px"} height={"80px"}></img>
                    <div className='achievements-name-center'>
                        <p className="p-b"><b>Sharp Reader</b></p>
                        <p className="p-a">Scored 75% or higher on any test</p>
                    </div>
                </div>
                <div className="container" onClick={() => handleUnlock('ieltsStar')}>
                    <img src={unlocked.ieltsStar ? ieltsStar : lockedImage} width={"80px"} height={"80px"}></img>
                    <div className='achievements-name-center'>
                        <p className="p-b"><b>IELTS Star</b></p>
                        <p className="p-a">Scored 90% or higher on any test</p>
                    </div>
                </div>
                <div className="container" onClick={() => handleUnlock('perfectScore')}>
                    <img src={unlocked.perfectScore ? perfectScore : lockedImage} width={"80px"} height={"80px"}></img>
                    <div className='achievements-name-center'>
                        <p className="p-b"><b>Perfect Score</b></p>
                        <p className="p-a">Scored 100% in one test</p>
                    </div>
                </div>
                <div className="container" onClick={() => handleUnlock('elite')}>
                    <img src={unlocked.elite ? elite : lockedImage} width={"80px"} height={"80px"}></img>
                    <div className='achievements-name-center'>
                        <p className="p-b"><b>Elite Achiever</b></p>
                        <p className="p-a">Unlocked all achievements</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Achievements;
