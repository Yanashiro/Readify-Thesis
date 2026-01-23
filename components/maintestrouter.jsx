import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MatchingInformation from './main-test/matchinginformation';
import MatchingFeatures from './main-test/matchingfeatures';
import IdentifyingInformation from './main-test/identifyinginformation';
import IdentifyingWritersViews from './main-test/identifyingwritersviews';
import MultipleChoices from './main-test/multiplechoices';


export default function MainTestRoute() {
    return (
        <Routes>
            <Route path='multiplechoices' element={<MultipleChoices/>}/>
            <Route path='matchingfeatures' element={<MatchingFeatures/>}/>
            <Route path='matchinginformation' element={<MatchingInformation/>}/>
            <Route path='identifyinginformation' element={<IdentifyingInformation/>}/>
            <Route path='identifyingwritersviews' element={<IdentifyingWritersViews/>}/>
        </Routes>
    )
}
