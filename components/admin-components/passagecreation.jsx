// still under construction

import react from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './passagecreation.css';

function PassageCreation() {

    const viewPassages = [
        {id: 1, title: "Multiple Choice", link: '/passageroute/multiplechoices'},
        {id: 2, title: "Identifying Information (True/False/Not Given)", link: '/passageroute/identifyinginformation'},
        {id: 3, title: "Identifying writer's view/claims (Yes/No/Not given)", link: '/passageroute/identifyingwritersviews'},
        {id: 4, title: "Matching Information", link: '/passageroute/matchinginformation'},
        {id: 5, title: "Matching Headings", link: '/passageroute/matchingheadings'},
        {id: 6, title: "Matching Features", link: '/passageroute/matchingfeatures'},
        {id: 7, title: "Matching Sentence Endings", link: '/passageroute/matchingsentenceendings'},
        {id: 8, title: "Sentence Completion", link: '/passageroute/sentencecompletion'},
        {id: 9, title: "Summary Completion", link: '/passageroute/summarycompletion'},
        {id: 10, title: "Diagram Label Completion", link: '/passageroute/diagramlabelcompletion'},
        {id: 11, title: "Short-Answer Questions", link: '/passageroute/shortanswerquestions'},
    ]

    return (
        <>
            <main className='passagecreation'>
                <div>
                    <h1 className='h1-passagecreation'>Add Passages</h1>
                </div>
                {viewPassages.map((passage) => (
                <div className='buttons' key={passage.id}>
                    <Link to={passage.link} style={{textDecoration:'none'}}>
                    <button className="passage-buttons">
                        <p className="title">{passage.title}</p>
                        <p className='main-arrow'>〉</p>
                    </button>
                    </Link>
                </div>
                ))}
            </main>
        </>
    )
}

export default PassageCreation;
