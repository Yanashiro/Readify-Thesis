import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MatchingInformation from './practice-test/matchinginformation';
import MatchingFeatures from './practice-test/matchingfeatures';
import IdentifyingInformation from './practice-test/identifyinginformation';
import IdentifyingWritersViews from './practice-test/identifyingwritersviews';
import MultipleChoices from './practice-test/multiplechoices';
import MatchingSentenceEndings from './practice-test/matchingsentenceendings';
import MatchingHeadings from './practice-test/matchingheadings';
import SummaryCompletion from './practice-test/summarycompletion';
import ShortAnswerQuestions from './practice-test/shortanswerquestions';
import SentenceCompletion from './practice-test/sentencecompletion';
import DiagramLabelCompletion from './practice-test/diagramlabelcompletion';
import TimerIsDown from './timerdown';
import ExamSubmitted from './examsubmitted';

export default function PracticeTestRoute() {
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
