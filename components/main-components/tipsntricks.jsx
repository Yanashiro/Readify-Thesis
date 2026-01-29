import React from 'react';
import './tipsntricks.css'
import tab from '../../images/tab-tipsntricks.png';

function TipsnTricks() {
    return (
        <main className='tipsntricks'>
            <div>
                <h1>Tips & Tricks</h1>
            </div>
            <div>
                <p className='p-link'>© https://ielts.idp.com/uae/prepare/article-ielts-reading-tips & https://takeielts.britishcouncil.org/teach-ielts/teaching-resources/videos/reading</p>
            </div>
            <div>
                <div className='tip-block'>
                    <div className='tip-block2'>
                        <div>
                            <img src={tab} className='img-tab'></img>
                        </div>
                        <div className='reading-tips'>
                            <h1 className='reading'>IELTS Reading Tips</h1>
                        </div>
                    </div>
                    <div className='tip-block3'>
                        <p className='p-tip-block3'>Explore IELTS Reading tips and tricks to work your way through the test and achieve a good band score in the Academic tests.</p>
                    </div>
                </div>
            </div>
            <div>
                <div className='question-types-tips'>
                    <p><b>The question types used in the IELTS Reading test evaluate a variety of reading skills. These include:</b></p>
                    <ul className='ul-list'>
                        <li><b>Skimming</b> - means looking over an article or paragraph to identify the key themes or general ideas. This includes paying attention to titles, subtitles, keywords and topic sentences. This can be thought of as a bird’s eye view.</li>
                        <li><b>Scanning</b> - means looking for specific information, such as a number, name or date. For example, if a reader needs to know how much something costs, they can quickly run their eyes across an article looking for a currency indicator, such as pound or dollar sign. This can be thought of as a bird swooping down on a specific detail.</li>
                        <li><b>Reading for Detail</b> – reading to understand a logical argument, opinions, attitudes, and writer’s purpose.</li>
                    </ul>
                </div>
                <div className='div-when-taking'>
                    <p className='p-when-taking'>When taking the IELTS reading test, readers should first skim the article to quickly get a sense of the subject, paying attention to the title and any headings or diagrams. They should also read the first sentence of each paragraph to gain a sense of what’s covered. It’s important to read each question carefully so that individuals are clear on what to look for. They can then scan for those details before they embark on intensive reading.</p>
                </div>
                <div className='div-intensive'>
                    <p className='p-intensive'><b>Intensive reading</b></p>
                    <p className='p-intensive-2'>Intensive reading helps readers to understand the details in an article. Once skimming and scanning is complete, readers can analyse the questions, carefully circling keywords and thinking of synonyms which may appear in the article. Skimming and scanning help with homing in on the right paragraphs, but intensive reading is still needed to find the specific answer to each question. </p>
                </div>
                <div className='div-time-prac'>
                    <p className='p-time-prac'><b>Time, practice and persistence</b></p>
                    <p className='p-time-prac2'>The best way to improve reading skills – and the chance of achieving a high score – is with regular practice. Those taking the IELTS reading test should be encouraged to read as wide a variety of material in the English language as possible.</p>
                </div>
                <div className='div-dont-forget'>
                    <p className='p-dont-forget'><b>Don’t forget to:</b></p>
                    <ul className='ul-dont-forget'>
                        <li>Read the questions before you read the text</li>
                        <li>Skim through the passage</li>
                        <li>Pay attention to the introduction and conclusion</li>
                        <li>Identify key words</li>
                        <li>Answer every question</li>
                        <li>Check your answers</li>
                        <li>Practice makes perfect!</li>
                    </ul>
                </div>
                <div className='div-tips-for-match'>
                    <p className='p-tips-for-match'><b>Tips for matching headings</b></p>
                    <p className='p-tips-for-match2'>You can use two strategies when answering this question: read the questions first or read the text first. When choosing the appropriate heading for both techniques, try to use your time as efficiently as possible because this can take a lot of time. If you are unsure of the distinction between two or more headings, make a note of all the possible answers and move on to the following paragraph. As you read more of the passage, you may want to rule out potential answers. It is better to cross off the heading on the test booklet whenever you are certain that you have chosen the appropriate heading for the paragraph or have eliminated an option. As a result, you won’t be wasting time reading the headings that you’ve already used. The ability to skim is crucial for time-consuming question types like matching headings. Thanks to the ability to skim, you'll give yourself additional time to answer the questions in the other reading sections.</p>
                </div>
                <div className='div-tips-for-true'>
                    <p className='p-tips-for-true'><b>Tips for True, False, and Not given</b></p>
                    <p className='p-tips-for-true2'>Keep in mind that you must find and identify specific information in order to answer this type of question. The text will convey this information as facts. The information in the text appears in the same order as the questions, so you can find the information for the first statement before the information for the second statement. When you read the given statement, you then have to decide if the information in the text is:</p>
                    <ul className='ul-tips-for-true'>
                        <li>TRUE because the statement agrees with the information</li>
                        <li>FALSE because the statement contradicts the information</li>
                        <li>NOT GIVEN because there is no information on this</li>
                    </ul>
                </div>
            </div>
        </main>
    )
}

export default TipsnTricks;
