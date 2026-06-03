import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Dashboard, 
  Inventory, // Blood Inventory
  Assignment, // Requests
  LocalHospital, // Profile
  Logout, 
  Warning 
} from '@mui/icons-material';
import '../../styles/Sidebar.css';

const HospitalSidebar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Get data from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { hospitalName: "Hospital" };

  // --- LOGOUT LOGIC ---
  const confirmLogout = () => {
    localStorage.removeItem("userInfo");
    setShowLogoutModal(false);
    navigate('/');
  };

  return (
    <>
      <div className="sidebar theme-hospital"> {/* Apply Blue Theme */}
        
        {/* Brand */}
        <div className="sidebar-header">
          <span className="brand-title">BLOOD<span className="brand-highlight">LINK</span></span>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <div className="avatar">
            {userInfo.hospitalName ? userInfo.hospitalName.charAt(0) : "H"}
          </div>
          <div className="profile-info">
            <h4 style={{fontSize: '0.85rem'}}>{userInfo.hospitalName}</h4>
            <p>Partner Hospital</p>
          </div>
        </div>

        {/* Links */}
        <nav className="nav-menu">
          <div style={{margin: '10px 0', borderBottom: '1px solid #f1f5f9'}}></div>

          <NavLink to="/hospital/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Dashboard /> Dashboard
          </NavLink>
          
          <NavLink to="/hospital/inventory" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Inventory /> Blood Inventory
          </NavLink>
          
          <NavLink to="/hospital/requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Assignment /> Active Requests
          </NavLink>
          
          <NavLink to="/hospital/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LocalHospital /> Hospital Profile
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button onClick={() => setShowLogoutModal(true)} className="logout-btn">
            <Logout fontSize="small"/> Sign Out
          </button>
        </div>
      </div>

      {/* --- LOGOUT MODAL --- */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="logout-modal-content">
            <div className="modal-icon-wrapper" style={{background: '#e0f2fe'}}> {/* Light Blue */}
              <Warning style={{ fontSize: 40, color: '#0ea5e9' }} /> {/* Blue Icon */}
            </div>
            <h3>Sign Out?</h3>
            <p>Are you sure you want to end the hospital session?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button 
                className="btn-confirm" 
                onClick={confirmLogout}
                style={{ background: '#0ea5e9' }} // Override to Blue
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HospitalSidebar;