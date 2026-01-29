import React from 'react';
import { useState, useEffect } from 'react';

function SideTimer({time, setTime}) {

    useEffect(() => {
        let timer = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime === 0) {
                    clearInterval(timer);
                    window.location.replace('/maintest/timerisdown');
                    sessionStorage.removeItem("Answer")
                    sessionStorage.removeItem("Font Size")
                    sessionStorage.removeItem("Passage History")
                    sessionStorage.removeItem("Page History")
                    sessionStorage.removeItem("Questions History")
                    sessionStorage.removeItem("Timer remain")
                    return 0;
                } else { 
                    return prevTime - 1};
            });
        }, 1000);

        return () => clearInterval(timer);
    },[setTime]);

    useEffect(() => {
        if (time !== undefined) {
            sessionStorage.setItem("Timer remain", JSON.stringify(time));
        }
    }, [time]);

    return (
        <div className="Timer">
            <p>
                Timer: {`${Math.floor(time / 60)}`.padStart(2, 0)}: 
                {`${time % 60}`.padStart(2, 0)}
            </p>
        </div>
    );
}

export default SideTimer;
