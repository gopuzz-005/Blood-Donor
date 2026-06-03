import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Dashboard, 
  Person, 
  Bloodtype, 
  LocalHospital, 
  History, 
  Settings, 
  Logout, 
  Inventory,
  Group,
  Assignment,
  Home
} from '@mui/icons-material';
import '../../styles/Sidebar.css';

const Sidebar = ({ role = 'user', userName = 'Welcome' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuConfig = {
    admin: [
      { title: 'Dashboard', path: '/admin/dashboard', icon: <Dashboard /> },
      { title: 'Manage Users', path: '/admin/users', icon: <Person /> },
      { title: 'Hospitals', path: '/admin/hospitals', icon: <LocalHospital /> },
      { title: 'Donors', path: '/admin/donors', icon: <Bloodtype /> },
      { title: 'Requests', path: '/admin/requests', icon: <Assignment /> },
    ],
    user: [
      { title: 'Dashboard', path: '/user/dashboard', icon: <Dashboard /> },
      { title: 'Request Blood', path: '/user/request', icon: <Bloodtype /> },
      { title: 'Donation History', path: '/user/history', icon: <History /> },
      { title: 'Profile', path: '/user/profile', icon: <Person /> },
    ],
    donor: [
      { title: 'Dashboard', path: '/donor/dashboard', icon: <Dashboard /> },
      { title: 'Donate Now', path: '/donor/donate', icon: <Bloodtype /> },
      { title: 'Donation History', path: '/donor/history', icon: <History /> },
      { title: 'Profile', path: '/donor/profile', icon: <Person /> },
    ],
    hospital: [
      { title: 'Dashboard', path: '/hospital/dashboard', icon: <Dashboard /> },
      { title: 'Inventory', path: '/hospital/inventory', icon: <Inventory /> },
      { title: 'Requests', path: '/hospital/requests', icon: <Group /> },
      { title: 'Profile', path: '/hospital/profile', icon: <LocalHospital /> },
    ]
  };

  const currentMenu = menuConfig[role] || menuConfig['user'];

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("userInfo");
        navigate('/login');
    }
  };

  return (
    <div className={`sidebar-container ${role}-mode`}>
      
      <div className="sidebar-header">
        <span className="brand-text">BLOOD<span className="brand-highlight">LINK</span></span>
      </div>
      <div className="user-info-box">
        <div className="user-avatar">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="user-details">
          <h4>{userName}</h4>
          <p>{role} Account</p>
        </div>
      </div>
      <nav className="sidebar-menu">
        <NavLink 
          to="/" 
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <span className="menu-icon"><Home /></span>
          <span>Home Website</span>
        </NavLink>

        <div style={{height: '1px', background: '#f1f5f9', margin: '10px 0'}}></div>

        {currentMenu.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path} 
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <Logout sx={{ fontSize: 20 }} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;