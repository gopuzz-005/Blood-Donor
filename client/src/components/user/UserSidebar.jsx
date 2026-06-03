import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Dashboard, 
  Bloodtype, 
  History, 
  Person, 
  Logout, 
  LocalHospital, 
  Warning 
} from '@mui/icons-material';
import '../../styles/Sidebar.css';

const UserSidebar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Get data from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { fullName: "User" };

  // --- LOGOUT LOGIC ---
  const confirmLogout = () => {
    localStorage.removeItem("userInfo");
    setShowLogoutModal(false);
    navigate('/');
  };

  return (
    <>
      <div className="sidebar theme-user">
        <div className="sidebar-header">
          <span className="brand-title">BLOOD<span className="brand-highlight">LINK</span></span>
        </div>

        <div className="profile-section">
          <div className="avatar">{userInfo.fullName ? userInfo.fullName.charAt(0) : "U"}</div>
          <div className="profile-info">
            <h4>{userInfo.fullName}</h4>
            <p>User Portal</p>
          </div>
        </div>

        <nav className="nav-menu">
          <div style={{margin: '10px 0', borderBottom: '1px solid #f1f5f9'}}></div>

          <NavLink to="/user/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Dashboard /> Dashboard
          </NavLink>
          <NavLink to="/user/request-blood" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Bloodtype /> Request Blood
          </NavLink>
          <NavLink to="/user/blood-bank" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LocalHospital /> Blood Bank
          </NavLink>
          <NavLink to="/user/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <History /> History
          </NavLink>
          <NavLink to="/user/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Person /> Profile
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => setShowLogoutModal(true)} className="logout-btn">
            <Logout fontSize="small"/> Sign Out
          </button>
        </div>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="logout-modal-content">
            <div className="modal-icon-wrapper">
              <Warning style={{ fontSize: 40, color: '#ef4444' }} />
            </div>
            <h3>Sign Out?</h3>
            <p>Are you sure you want to end your current session?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="btn-confirm" onClick={confirmLogout}>Yes, Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserSidebar;