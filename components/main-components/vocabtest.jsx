import react from 'react';
import { useNavigate } from 'react-router-dom';
import './vocabtest.css';

function VocPage () {

    const navigate = useNavigate();

    const toVocTest = () => {
        navigate('/vocabularytest')
    }

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
                
                <button className="vocab-short-button" onClick={toVocTest}>
                Start Vocab Test
                </button>
            </div>
        </main>
    )
}

export default VocPage;
