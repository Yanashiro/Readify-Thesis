import React, { useState, useEffect } from 'react';
import './navbar.css';
import axios from 'axios';

import userIcon from '../../images/icons/user.png';
import dashboardIcon from '../../images/icons/dashboard.png';
import mainTestIcon from '../../images/icons/main-test.png';
import practiceTestIcon from '../../images/icons/practice-test.png';
import vocabularyIcon from '../../images/icons/vocabulary.png';
import achievementIcon from '../../images/icons/achievement.png';
import tipsIcon from '../../images/icons/tips.png';
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
import VocPage from './vocabtest';
import AdminHome from '../admin-components/adminhome';
import PassageCreation from '../admin-components/passagecreation';
import ManageUsers from '../admin-components/manageusers';
import TestReview from '../admin-components/testreview';
import AdminProfile from '../admin-components/adminprofile';
import Adminprofile from '../admin-components/adminprofile';
//import dropdownIcon from '../images/icons/dropdown.png';

function PageNavigation({input, setInput, role, name}) {
  // accepting props role={auth.isAdmin}
  const isAdmin = role === true;
  const isExaminee = role === false;
  
  // Examinee web pages
  if (isExaminee) {
    switch(input) {
      case 'Dashboard':
          return <Dashboard setPage={setInput} name={name}/>
      case 'Main Test':
          return <MTPage/>
      case 'Practice Test':
          return <PTPage/>  
      case 'Vocabulary Test':
          return <VocPage/>
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
  } else if (isAdmin) { // admin web pages
    switch(input) {
      case 'Dashboard':
        return <AdminHome setPage={setInput} name={name}/>
      case 'Passage Creation':
        return <PassageCreation/>
      case 'Manage Users':
        return <ManageUsers setPage={setInput}/>
      case 'Test Review':
        return <TestReview/>
      case 'Profile':
        return <AdminProfile/>
      case 'About Us':
        return <AboutUs/>
      default:
        return <AdminHome/>
    }
  }

  return null;
}

function Navbar() {
  // accepting backend "variables?" into the useState via Axios call /auth/me
  const [auth, setAuth] = useState({
    loading: true,
    checked: false,
    loggedIn: false,
    isAdmin: null,
    name: null
  });
  // using auth variable from setAuth state to determine if user account is examinee(admin:false) or admin(admin:true)
  const isAdmin = auth.isAdmin === true;
  const isExaminee = auth.isAdmin === false;
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  useEffect(() => {
    // axios call receiving "res.json" from app.get(/auth/me) path 
    axios.get("/auth/me", { withCredentials: true})
      .then(res => {
        console.log("AUTH RESPONSE:", res.data)
        // updates useState variable "auth"
        setAuth({
          loading: false,
          loggedIn: res.data.loggedIn,
          isAdmin: res.data.isAdmin ?? null,
          name: res.data.name ?? null
        })
      })
      // if error from axios call
      .catch(() => {
        setAuth({loading: false, checked: true, loggedIn: false, isAdmin: null})
      })
  }, [])

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  }

  useEffect(() => {
    if (!auth.loading && auth.loggedIn) {
      setActiveMenu('Dashboard')
    }
  }, [auth.loading, auth.loggedIn])

  useEffect(() => {
    if(auth.checked === true && auth.loggedIn === false) {
      window.location.replace('/');
    }
  }, [auth.checked, auth.loggedIn]);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;

    await axios.get("/Logout", { withCredentials: true });
    sessionStorage.clear();
    window.location.replace("/");
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
          <span>{auth.name || 'User'}</span>
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
            className={`menu-item ${activeMenu === 'Vocabulary Test' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Vocabulary Test')} 
            href="#"
          > 
            <img src={dashboardIcon} className="menu-icon" alt="Vocabulary Test" />
            <span>Vocabulary Test</span>
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
            className={`menu-item ${activeMenu === 'Dashboard' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('Dashboard')} 
            href="#"
          > 
            <img src={dashboardIcon} className="menu-icon" alt="Home" />
            <span>Dashboard</span>
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
        {/* MAIN CONTENT */}
        <div className="main-content">
            <PageNavigation input={activeMenu} setInput={setActiveMenu} role={auth.isAdmin} name={auth.name}/>
        </div>
      </div>
      <div>
      {isExaminee &&
      <footer className="readify-footer">
      <div className="footer-inner">
        <div className="footer-top-row">
          {/* LEFT */}
          <div className="left-brand-block">
            <div className="readify-title">Readify</div>
            <div className="readify-description">
              Readify is an online reading comprehension platform designed to help senior high school
              students improve their reading skills using the IELTS reading framework. It provides
              automated tests, instant feedback, and progress tracking to support students and teachers.
              Readify aims to make reading assessment accessible and prepare students for college-level
              academic reading.
            </div>

            <div className="policy-links">
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms &amp; Conditions</a>
            </div>
          </div>

        
          <div className="right-nav-group">
            <div className="nav-col">
              <a onClick={() => handleMenuClick('Dashboard')} className="footer-link">Dashboard</a>
              <a onClick={() => handleMenuClick('Main Test')} className="footer-link">Main Test</a>
              <a onClick={() => handleMenuClick('Practice Test')} className="footer-link">Practice Test</a>
              <a onClick={() => handleMenuClick('Vocabulary Test')} className="footer-link">Vocabulary Test</a>
              <a onClick={() => handleMenuClick('Achievements')} className="footer-link">Achievements</a>
              <a onClick={() => handleMenuClick('Tips & Tricks')} className="footer-link">Tips &amp; Tricks</a>
            </div>

            <div className="nav-col">
              <a onClick={() => handleMenuClick('Profile')} className="footer-link">Profile</a>
              <a onClick={() => handleMenuClick('About Us')} className="footer-link">About Us</a>
            </div>
          </div>
        </div>
      </div>

      
      <div className="footer-bottom-yellow">
        <div className="footer-bottom-inner">© 2026 Readify. All Rights Reserved</div>
      </div>
      </footer>
      }
      {isAdmin &&
        <footer className="readify-footer">
      <div className="footer-inner">
        <div className="footer-top-row">
          {/* LEFT */}
          <div className="left-brand-block">
            <div className="readify-title">Readify</div>
            <div className="readify-description">
              Readify is an online reading comprehension platform designed to help senior high school
              students improve their reading skills using the IELTS reading framework. It provides
              automated tests, instant feedback, and progress tracking to support students and teachers.
              Readify aims to make reading assessment accessible and prepare students for college-level
              academic reading.
            </div>

            <div className="policy-links">
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms &amp; Conditions</a>
            </div>
          </div>

        
          <div className="right-nav-group">
            <div className="nav-col">
              <a onClick={() => handleMenuClick('Dashboard')} className="footer-link">Dashboard</a>
              <a onClick={() => handleMenuClick('Manage Users')} className="footer-link">Manage Users</a>
              <a onClick={() => handleMenuClick('Test Review')} className="footer-link">View Scores</a>
              <a onClick={() => handleMenuClick('Passage Creation')} className="footer-link">Add Passages</a>
            </div>

            <div className="nav-col">
              <a onClick={() => handleMenuClick('Profile')} className="footer-link">Profile</a>
              <a onClick={() => handleMenuClick('About Us')} className="footer-link">About Us</a>
            </div>
          </div>
        </div>
      </div>

      
      <div className="footer-bottom-yellow">
        <div className="footer-bottom-inner">© 2026 Readify. All Rights Reserved</div>
      </div>
      </footer>
      }
      </div>
    </div>
  );
}

export default Navbar;
