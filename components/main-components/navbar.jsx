import React, { useState } from 'react';
import './navbar.css';

import userIcon from '../../images/icons/user.png';
import dashboardIcon from '../../images/icons/dashboard.png';
import mainTestIcon from '../../images/icons/main-test.png';
import practiceTestIcon from '../../images/icons/practice-test.png';
import vocabularyIcon from '../../images/icons/vocabulary.png';
import achievementIcon from '../../images/icons/achievement.png';
import tipsIcon from '../../images/icons/tips.png';
import settingsIcon from '../../images/icons/settings.png';
import profileIcon from '../../images/icons/profile.png';
import logoutIcon from '../../images/icons/logout.png';
import aboutUsIcon from '../../images/icons/aboutus.png';
import Dashboard from './dashboard';
import MTPage from './maintest';
import TipsnTricks from './tipsntricks';
import AboutUs from './aboutus';
import Achievements from './achievements';
import Profile from './profile';
//import dropdownIcon from '../images/icons/dropdown.png';

function PageNavigation({input}) {
    
    switch(input) {
        case 'Dashboard':
            return <Dashboard/>
        case 'Main Test':
            return <MTPage/>
        case 'Practice Test':
            return <MTPage/>  
        case 'Achievements':
            return <Achievements/>
        case 'Tips & Tricks':
            return <TipsnTricks/>
        case 'About Us':
            return <AboutUs/>
        case 'Profile':
            return <Profile/>
        default:
            return <Dashboard/>
    }
}

function Navbar() {
  const [activeMenu, setActiveMenu] = useState('');

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      alert("Logging out...");
    }
  };

  return (
    <div className="app"> 
      {/* HEADER */}
      <div className="header">
        <div className="logo-placeholder">
          <div className="logo-icon">R</div>
          <div className="app-title">Readify</div>
        </div>

        <div className="user-dropdown">
          <img src={userIcon} className="user-nav-icon" alt="User" />
          <span>Micah Rocero</span>
          {/*<img src={dropdownIcon} className="dropdown-icon" alt="Dropdown" /> */}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="main-container">
        {/* SIDEBAR */}
        <div className="sidebar-nav">
          <div className="sidebar-title">All Tests</div>

          <a 
            className={`menu-item ${activeMenu === 'Dashboard' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Dashboard')}
            href="#!"
          >
            <img src={dashboardIcon} className="menu-icon" alt="Dashboard" />
            <span>Dashboard</span>
          </a> 

          <a 
            className={`menu-item ${activeMenu === 'Main Test' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Main Test')}
            href="#!"
          >
            <img src={mainTestIcon} className="menu-icon" alt="Main Test" />
            <span>Main Test</span>
          </a>

          <a 
            className={`menu-item ${activeMenu === 'Practice Test' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Practice Test')}
            href="#!"
          >
            <img src={practiceTestIcon} className="menu-icon" alt="Practice Test" />
            <span>Practice Test</span>
          </a>

          <a 
            className={`menu-item ${activeMenu === 'Achievements' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Achievements')}
            href="#!"
          >
            <img src={achievementIcon} className="menu-icon" alt="Achievements" />
            <span>Achievements</span>
          </a>

          <a 
            className={`menu-item ${activeMenu === 'Tips & Tricks' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Tips & Tricks')}
            href="#!"
          >
            <img src={tipsIcon} className="menu-icon" alt="Tips & Tricks" />
            <span>Tips & Tricks</span>
          </a>

          <div className="settings-separator">Settings</div>

          <a 
            className={`menu-item ${activeMenu === 'Settings' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Settings')}
            href="#!"
          >
            <img src={settingsIcon} /*className="menu-icon"*/ alt="Settings" />
            <span>Settings</span>
          </a>

          <a 
            className={`menu-item ${activeMenu === 'Profile' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Profile')}
            href="#!"
          >
            <img src={profileIcon} className="menu-icon" alt="Profile" />
            <span>Profile</span>
          </a>

          <a 
            className={`menu-item ${activeMenu === 'About Us' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('About Us')}
            href="#!"
          >
            <img src={aboutUsIcon} className="menu-icon" alt="About Us" />
            <span>About Us</span>
          </a>

          <div className="logout-section">
            <a className="logout-link" onClick={handleLogout}>
              <img src={logoutIcon} className="menu-icon" alt="Log Out" />
              <span>Log Out</span>
            </a>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content">
            <PageNavigation input={activeMenu} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
