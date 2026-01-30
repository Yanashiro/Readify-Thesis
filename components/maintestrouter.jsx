import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MatchingInformation from './main-test/matchinginformation';
import MatchingFeatures from './main-test/matchingfeatures';
import IdentifyingInformation from './main-test/identifyinginformation';
import IdentifyingWritersViews from './main-test/identifyingwritersviews';
import MultipleChoices from './main-test/multiplechoices';
import MatchingSentenceEndings from './main-test/matchingsentenceendings';
import MatchingHeadings from './main-test/matchingheadings';
import SummaryCompletion from './main-test/summarycompletion';
import ShortAnswerQuestions from './main-test/shortanswerquestions';
import SentenceCompletion from './main-test/sentencecompletion';
import DiagramLabelCompletion from './main-test/diagramlabelcompletion';
import TimerIsDown from './timerdown';
import ExamSubmitted from './examsubmitted';

export default function MainTestRoute() {
    return (
        <Routes>
            <Route path='multiplechoices' element={<MultipleChoices/>}/>
            <Route path='matchingfeatures' element={<MatchingFeatures/>}/>
            <Route path='matchinginformation' element={<MatchingInformation/>}/>
            <Route path='identifyinginformation' element={<IdentifyingInformation/>}/>
            <Route path='identifyingwritersviews' element={<IdentifyingWritersViews/>}/>
            <Route path='matchingsentenceendings' element={<MatchingSentenceEndings/>}/>
            <Route path='matchingheadings' element={<MatchingHeadings/>}/>
            <Route path='summarycompletion' element={<SummaryCompletion/>}/>
            <Route path='shortanswerquestions' element={<ShortAnswerQuestions/>}/>
            <Route path='sentencecompletion' element={<SentenceCompletion/>}/>
            <Route path='diagramlabelcompletion' element={<DiagramLabelCompletion/>}/>
            <Route path='timerisdown' element={<TimerIsDown/>}/>
            <Route path='examsubmitted' element={<ExamSubmitted/>}/>
        </Routes>
    )
}
