import React from 'react';
import './aboutus.css';
import picture from '../../images/picture_aboutus.png';
import micah from '../../images/ROCERO_ID_Picture.JPG';
import patrick from '../../images/patrick-photo.png'
import marjorie from '../../images/CINCO_ID_PICTURE.jpg';
import ryan from '../../images/Ryan.jpg'

function AboutUs() {
    return (
        <main className="aboutUsMain">
            <div className='about-us-header'>
                <h1>About Us</h1>
                <p>Readify is an online reading comprehension platform created to help senior high school students improve their reading skills and prepare for college-level academic demands. Based on the IELTS reading framework, Readify provides automated assessments, diverse question types, instant feedback, and progress tracking to support both students and teachers. Our goal is to make reading assessment accessible, promote better reading habits, and help students build strong comprehension skills for academic and real-world success.</p>
            </div>
            <div>
                <div className='meet-the-team'>
                    <h1>Meet the Team</h1>
                </div>
                <div className="containerAboutUs">
                    <img className="picture" src={micah} width={"250px"} height={"250px"}></img>
                    <div className='team-name'>
                        <h2>Micah Rocero</h2>
                        <p>I’m a BSIT student specializing in Web Development, with hands-on UI/UX experience from an internship at Premier Software Enterprise and work on this capstone project. Organized and motivated, I bring strong communication skills, problem-solving ability, teamwork, and time management, with a willingness to learn and contribute to meaningful projects.</p>
                    </div>
                    <div className='team-socials'>
                        <a href="http://linkedin.com/in/micah-rocero/"><p>linkedin.com/in/micah-rocero/ </p></a>
                    </div>
                </div>
                <div className="containerAboutUs">
                    <img className="picture" src={marjorie} width={"250px"} height={"250px"}></img>
                    <div className='team-name'>
                        <h2>Marjorie Cinco</h2>
                        <p>I am a BSIT student with a strong interest in learning and improving my skills, particularly in technology and research. I am organized, detail-oriented, and motivated to learn, with strengths in problem-solving, teamwork, and time management. I enjoy taking on challenges that help me grow and contribute meaningfully to collaborative projects. </p>
                    </div>
                    <div className='team-socials'>
                        <a href="https://www.linkedin.com/in/marjorie-cinco-7abb00148/"><p>linkedin.com/in/marjorie-cinco-7abb00148/</p></a>
                    </div>
                </div>
                <div className="containerAboutUs">
                    <img className="picture" src={picture} width={"250px"} height={"250px"}></img>
                    <div className='team-name'>
                        <h2>Angela Dacasin</h2>
                        <p>I am a BS Computer Science student specializing in Data Science with a strong interest in transforming data into meaningful insights. I have hands-on experience in statistical analysis and data visualization, supported by solid analytical and problem-solving skills. I actively engage with the data science community through conferences and seminars to stay updated with emerging trends and best practices.</p>
                    </div>
                    <div className='team-socials'>
                        <a href="https://www.facebook.com/share/1H8m4dB2NF/?mibextid=wwXIfr"><p>facebook.com/angeeedcsn#</p></a>
                    </div>
                </div>
                <div className="containerAboutUs">
                    <img className="picture" src={patrick} width={"250px"} height={"250px"}></img>
                    <div className='team-name'>
                        <h2>Patrick Crisostomo</h2>
                        <p>With this team, I feel like I am growing in my own set of skills as well as my ability to do teamwork in web development. This project has opened more opportunities for upskilling than ever. As for my personal ambitions, I am aiming to be a junior system administrator in the future, I believe with the right skills and the right project, it is possible to achieve that goal and be competent in that field.</p>
                    </div>
                    <div className='team-socials'>
                        <a href="https://www.facebook.com/patrickkyle.crisostomo/"><p>facebook.com/patrickkyle.crisostomo/</p></a>
                    </div>
                </div>
                <div className="containerAboutUs">
                    <img className="picture" src={ryan} width={"250px"} height={"250px"}></img>
                    <div className='team-name'>
                        <h2>Ryan Mariano</h2>
                        <p>I'm Ryan Mariano, a BSIT at iAcademy, I specialize in full-stack web-development and currently serving as the head back-end developer of the "Readify" Capstone Project. I'm knowledgeable in most tasks regarding HTML Coding but I'm more familiar with Node.js</p>
                    </div>
                    <div className='team-socials'>
                        <p>optional link to socials/resume/linkedin here</p>
                    </div>
                </div>
            </div>
        </main>
    )
};

export default AboutUs
