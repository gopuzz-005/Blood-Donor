import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Dashboard,
  People, // Users
  VolunteerActivism, // Donors
  LocalHospital, // Hospitals
  Assignment, // Requests
  Settings,
  Logout,
  Warning,
  Email,
  Security // Admin Icon
} from '@mui/icons-material';
import '../../styles/Sidebar.css'; // Reusing the shared styles

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Get Admin data
  const userInfo = JSON.parse(localStorage.getItem("adminInfo")) || { fullName: "Administrator" };

  // --- LOGOUT LOGIC ---
  const confirmLogout = () => {
    localStorage.removeItem("adminInfo");
    setShowLogoutModal(false);
    navigate('/');
  };

  return (
    <>
      <div className="sidebar theme-admin"> {/* Apply Purple Theme */}

        {/* Brand */}
        <div className="sidebar-header">
          <span className="brand-title">BLOOD<span className="brand-highlight">LINK</span></span>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <div className="avatar">
            <Security fontSize="small" />
          </div>
          <div className="profile-info">
            <h4>{userInfo.fullName}</h4>
            <p>System Admin</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="nav-menu">
          <div style={{ margin: '10px 0', borderBottom: '1px solid #f1f5f9' }}></div>

          <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Dashboard /> Overview
          </NavLink>

          <NavLink to="/admin/manage-users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <People /> Users
          </NavLink>

          <NavLink to="/admin/manage-donors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <VolunteerActivism /> Donors
          </NavLink>

          <NavLink to="/admin/manage-hospitals" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LocalHospital /> Hospitals
          </NavLink>

          <NavLink to="/admin/all-requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Assignment /> All Requests
          </NavLink>

          {/* In AdminSidebar.js */}
          <NavLink to="/admin/messages" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Email /> Messages
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button onClick={() => setShowLogoutModal(true)} className="logout-btn">
            <Logout fontSize="small" /> Sign Out
          </button>
        </div>
      </div>

      {/* --- LOGOUT MODAL --- */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="logout-modal-content">
            <div className="modal-icon-wrapper" style={{ background: '#f3e5f5' }}> {/* Light Purple */}
              <Warning style={{ fontSize: 40, color: '#7c3aed' }} /> {/* Purple Icon */}
            </div>
            <h3>Sign Out?</h3>
            <p>Are you sure you want to end the admin session?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button
                className="btn-confirm"
                onClick={confirmLogout}
                style={{ background: '#7c3aed' }} // Purple Button
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

export default AdminSidebar;