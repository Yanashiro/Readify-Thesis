import React from 'react';
import { useState, useEffect } from 'react';

function TimerStart() {
    const [time, setTime] = useState(900);

    useEffect(() => {
        let timer = setInterval(() => {
            setTime((time) => {
                if (time === 0) {
                    clearInterval(timer);
                    return 0;
                } else return time - 1;
            });
        }, 1000)
    },[]);

    return (
        <div className="Timer">
            <p>
                Time left: {`${Math.floor(time / 60)}`.padStart(2, 0)}: 
                {`${time % 60}`.padStart(2.0)}
            </p>
        </div>
    );
}

function SideTimer() {
    return (
        <TimerStart />
    );
}

export default SideTimer;
