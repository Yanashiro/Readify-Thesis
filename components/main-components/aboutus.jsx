// needs change in content

import React from 'react';
import './aboutus.css';
import picture from '../components/images/picture_aboutus.png';

function AboutUs() {
    return (
        <main className="aboutUsMain">
            <div className='about-us-header'>
                <h1>About Us</h1>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos iure repudiandae quasi ea aut nesciunt consectetur maiores labore. Inventore atque, voluptatum voluptates sunt nihil asperiores magnam non saepe ad ut!</p>
            </div>
            <div>
                <div className='meet-the-team'>
                    <h1>Meet the Team</h1>
                </div>
                <div className="containerAboutUs">
                    <img className="picture" src={picture} width={"350px"} height={"300px"}></img>
                    <div className='team-name'>
                        <h2>Name Here</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum ad consequatur et a officiis veniam saepe nostrum iusto aperiam? Fugiat, odit tenetur sapiente quidem similique dicta perferendis? Ut, eligendi esse.</p>
                    </div>
                    <div className='team-socials'>
                        <p>optional link to socials/resume/linkedin here</p>
                    </div>
                </div>
                <div className="containerAboutUs">
                    <img className="picture" src={picture} width={"350px"} height={"300px"}></img>
                    <div className='team-name'>
                        <h2>Name Here</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum ad consequatur et a officiis veniam saepe nostrum iusto aperiam? Fugiat, odit tenetur sapiente quidem similique dicta perferendis? Ut, eligendi esse.</p>
                    </div>
                    <div className='team-socials'>
                        <p>optional link to socials/resume/linkedin here</p>
                    </div>
                </div>
                <div className="containerAboutUs">
                    <img className="picture" src={picture} width={"350px"} height={"300px"}></img>
                    <div className='team-name'>
                        <h2>Name Here</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum ad consequatur et a officiis veniam saepe nostrum iusto aperiam? Fugiat, odit tenetur sapiente quidem similique dicta perferendis? Ut, eligendi esse.</p>
                    </div>
                    <div className='team-socials'>
                        <p>optional link to socials/resume/linkedin here</p>
                    </div>
                </div>
                <div className="containerAboutUs">
                    <img className="picture" src={picture} width={"350px"} height={"300px"}></img>
                    <div className='team-name'>
                        <h2>Name Here</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum ad consequatur et a officiis veniam saepe nostrum iusto aperiam? Fugiat, odit tenetur sapiente quidem similique dicta perferendis? Ut, eligendi esse.</p>
                    </div>
                    <div className='team-socials'>
                        <p>optional link to socials/resume/linkedin here</p>
                    </div>
                </div>
                <div className="containerAboutUs">
                    <img className="picture" src={picture} width={"350px"} height={"300px"}></img>
                    <div className='team-name'>
                        <h2>Name Here</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum ad consequatur et a officiis veniam saepe nostrum iusto aperiam? Fugiat, odit tenetur sapiente quidem similique dicta perferendis? Ut, eligendi esse.</p>
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
