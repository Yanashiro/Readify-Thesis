import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
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
import PTPage from './practicetest';
import TipsnTricks from './tipsntricks';
import AboutUs from './aboutus';
import Achievements from './achievements';
import Profile from './profile';
import AdminHome from '../admin-components/adminhome';
import PassageCreation from '../admin-components/passagecreation';
import ManageUsers from '../admin-components/manageusers';
import TestReview from '../admin-components/testreview';
//import dropdownIcon from '../images/icons/dropdown.png';

function PageNavigation({input, setInput}) {
  const [cookies, setCookie, removeCookie] = useCookies(['examinee-cookie', 'admin-cookie'])
  const isAdmin = !!cookies['admin-cookie']
  const isExaminee = !!cookies['examinee-cookie']
    
  if (isExaminee) {
    switch(input) {
      case 'Dashboard':
          return <Dashboard setPage={setInput}/>
      case 'Main Test':
          return <MTPage/>
      case 'Practice Test':
          return <PTPage/>  
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
  } else if (isAdmin) {
    switch(input) {
      case 'Home':
        return <AdminHome setPage={setInput}/>
      case 'Passage Creation':
        return <PassageCreation/>
      case 'Manage Users':
        return <ManageUsers setPage={setInput}/>
      case 'Test Review':
        return <TestReview/>
      default:
        return <AdminHome/>
    }
  }

  return null;
}

function Navbar() {
  const [cookies, setCookie, removeCookie] = useCookies(['examinee-cookie', 'admin-cookie'])
  const isAdmin = !!cookies['admin-cookie']
  const isExaminee = !!cookies['examinee-cookie']
  const [activeMenu, setActiveMenu] = useState(() => { 
    if(isExaminee) {
      const currentPath = window.location.pathname;
      if(currentPath === '/home') {
        return 'Dashboard';
      }
      return ''
    } else if (isAdmin) {
      const currentPath = window.location.pathname;
      if(currentPath === '/home') {
        return 'Home';
      }
      return ''
    }
  });

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  }
  {/*}
  useEffect(() => {
      const currentExamData = [
        "Answer", 
        "Font Size", 
        "Passage History", 
        "Questions History", 
        "Features History",
        "Endings History",
        "Page History", 
        "Timer remain",
        "Headings History",
        "Summary History"
      ];

      if (sessionStorage.getItem("Timer remain")) {
        currentExamData.forEach(key => sessionStorage.removeItem(key));
        console.warn("Anti-Cheat: Progress wiped.");
        window.location.reload();
      }
  }, []) */}
  useEffect(() => {
    if(!cookies['examinee-cookie' || 'admin-cookie']) {
      alert("User Identity lost, logging out");
      sessionStorage.clear();
      window.location.replace('/');
    }
  }, [cookies['examinee-cookie'], cookies['admin-cookie']]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      removeCookie('examinee-cookie', {path: '/'});
      removeCookie('admin-cookie', {path:"/"});
      sessionStorage.clear();
      window.location.replace('/');
    }
  };

  return (
    <div className="app"> 
      {/* HEADER */}
      <div className="header">
        <div className="logo-placeholder">
          {/*<div className="logo-icon">R</div>*/}
          <div className="app-title">Readify</div>
        </div>

        <div className="user-dropdown">
          <img src={userIcon} className="user-nav-icon" alt="User" />
          <span>{isExaminee ? cookies['examinee-cookie'] : isAdmin ? cookies['admin-cookie'] : 'User'}</span>
          {/*<img src={dropdownIcon} className="dropdown-icon" alt="Dropdown" /> */}
        </div>
      </div>
      {/* MAIN CONTAINER */}
      <div className="main-container">
        {/* SIDEBAR */}
        {isExaminee &&
        <div className="sidebar-nav">
          <div className="sidebar-title">All Tests</div>
          <a 
            className={`menu-item ${activeMenu === 'Dashboard' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Dashboard')} 
            href="#"
          > 
            <img src={dashboardIcon} className="menu-icon" alt="Dashboard" />
            <span>Dashboard</span>
          </a> 
          <a 
            className={`menu-item ${activeMenu === 'Main Test' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Main Test')}
            href="#"
          >
            <img src={mainTestIcon} className="menu-icon" alt="Main Test" />
            <span>Main Test</span>
          </a>

          <a 
            className={`menu-item ${activeMenu === 'Practice Test' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Practice Test')}
            href="#"
          >
            <img src={practiceTestIcon} className="menu-icon" alt="Practice Test" />
            <span>Practice Test</span>
          </a>

          <a 
            className={`menu-item ${activeMenu === 'Achievements' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Achievements')}
            href="#"
          >
            <img src={achievementIcon} className="menu-icon" alt="Achievements" />
            <span>Achievements</span>
          </a>

          <a 
            className={`menu-item ${activeMenu === 'Tips & Tricks' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Tips & Tricks')}
            href="#"
          >
            <img src={tipsIcon} className="menu-icon" alt="Tips & Tricks" />
            <span>Tips & Tricks</span>
          </a>

          <div className="settings-separator">Settings</div>

          <a 
            className={`menu-item ${activeMenu === 'Profile' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Profile')}
            href="#"
          >
            <img src={profileIcon} className="menu-icon" alt="Profile" />
            <span>Profile</span>
          </a>

          <a 
            className={`menu-item ${activeMenu === 'About Us' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('About Us')}
            href="#"
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
      }

      {isAdmin &&
        <div className="sidebar-nav">
          <div className="sidebar-title">All Tests</div>
          <a 
            className={`menu-item ${activeMenu === 'Home' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Home')} 
            href="#"
          > 
            <img src={dashboardIcon} className="menu-icon" alt="Home" />
            <span>Home</span>
          </a> 

          <a 
            className={`menu-item ${activeMenu === 'Passage Creation' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Passage Creation')} 
            href="#"
          > 
            <img src={mainTestIcon} className="menu-icon" alt="Passage Creation" />
            <span>Passage Creation</span>
          </a> 

          <a 
            className={`menu-item ${activeMenu === 'Manage Users' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Manage Users')} 
            href="#"
          > 
            <img src={practiceTestIcon} className="menu-icon" alt="Manage Users" />
            <span>Manage Users</span>
          </a> 

          <a 
            className={`menu-item ${activeMenu === 'Test Review' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Test Review')} 
            href="#"
          > 
            <img src={practiceTestIcon} className="menu-icon" alt="Test Review" />
            <span>Test Review</span>
          </a> 
        </div>
      }
        {/* MAIN CONTENT */}
        <div className="main-content">
            <PageNavigation input={activeMenu} setInput={setActiveMenu} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
