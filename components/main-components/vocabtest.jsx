import react from 'react';
import { Link } from 'react-router-dom';
import './vocabtest.css';

function VocPage () {
    return (
        <main className='vocabulary-test'>
            <div>
                <h1>Vocabulary Test</h1>
            </div>
            <div className="vocab-container">
                <div className="vocab-header">
                    <div className="vocab-blue-bar"></div>
                    <h2 className="vocab-title">Mini Vocabulary Quiz</h2>
                </div>
                        
                <p className="vocab-text">Here are a few</p>
                
                <Link to={"hello"}>
                <button className="vocab-short-button" onClick={(e) => { 
                e.preventDefault(); 
                }}>
                Start Vocab Test
                </button>
                </Link>
            </div>
        </main>
    )
}

export default VocPage;