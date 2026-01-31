import React from 'react';

function ExamSubmitted() {
    return (
        <>
            <main className='exam-complete'>
                <div className='notification-box'>
                    <div>
                        <p>Congratulations for completing your exam!</p>
                    </div>
                    <div>
                        <p>There are also other exam pages you can try out for practice or for main test</p>
                    </div>
                    <div>
                        <p>We believe that by taking more test, you are honing your reading comprehension skills in english.</p>
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

export default ExamSubmitted;
