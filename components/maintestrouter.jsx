import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MatchingInformation from './matchinginformation';
import MatchingFeatures from './matchingfeatures';
import IdentifyingInformation from './identifyinginformation';
import IdentifyingWritersViews from './identifyingwritersviews';
import MultipleChoices from './multiplechoices';
import MatchingSentenceEndings from './matchingsentenceendings';
import MatchingHeadings from './matchingheadings';
import SummaryCompletion from './summarycompletion';
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
            <Route path='timerisdown' element={<TimerIsDown/>}/>
            <Route path='examsubmitted' element={<ExamSubmitted/>}/>
        </Routes>
    )
}
