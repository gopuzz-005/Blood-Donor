import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Dashboard, 
  VolunteerActivism, 
  History, 
  Person, 
  Logout, 
  Warning 
} from '@mui/icons-material';
import '../../styles/Sidebar.css'; 

const DonorSidebar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || { fullName: "Donor" };

  const confirmLogout = () => {
    localStorage.removeItem("userInfo");
    setShowLogoutModal(false);
    navigate('/');
  };

  return (
    <>
      <div className="sidebar theme-donor"> {/* Applying Donor Theme Class */}
        
        <div className="sidebar-header">
          <span className="brand-title">BLOOD<span className="brand-highlight">LINK</span></span>
        </div>

        <div className="profile-section">
          <div className="avatar">{userInfo.fullName ? userInfo.fullName.charAt(0) : "D"}</div>
          <div className="profile-info">
            <h4>{userInfo.fullName}</h4>
            <p>Registered Donor</p>
          </div>
        </div>

        <nav className="nav-menu">
          <div style={{margin: '10px 0', borderBottom: '1px solid #f1f5f9'}}></div>

          <NavLink to="/donor/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Dashboard /> Dashboard
          </NavLink>
          
          <NavLink to="/donor/donate" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <VolunteerActivism /> Donate Now
          </NavLink>
          
          <NavLink to="/donor/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <History /> History
          </NavLink>
          
          <NavLink to="/donor/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Person /> Profile
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => setShowLogoutModal(true)} className="logout-btn">
            <Logout fontSize="small"/> Sign Out
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="logout-modal-content">
            <div className="modal-icon-wrapper" style={{ background: '#fff1f2' }}> {/* Light Maroon for Donor */}
              <Warning style={{ fontSize: 40, color: '#be123c' }} /> {/* Theme Color */}
            </div>
            <h3>Sign Out?</h3>
            <p>Are you sure you want to end your donor session?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button 
                className="btn-confirm" 
                onClick={confirmLogout}
                style={{ background: '#be123c' }} 
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

export default DonorSidebar;