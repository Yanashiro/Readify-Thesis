import React from 'react'

function TimerIsDown() {
    return (
        <>
            <main className='timer-is-down'>
                <div className='notification-box'>
                    <div>
                        <p>Sorry, the clockdown timer has reached its limit!</p>
                    </div>
                    <div>
                        <p>You have 15 minutes to answer the exam and your answers are discarded if the timer stops</p>
                    </div>
                    <div>
                        <p>We believe that a timer can make it more educational for examinees, you can still try again</p>
                    </div>
                    <div>
                        <button>
                            Go back to Home
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
}

export default TimerIsDown;
