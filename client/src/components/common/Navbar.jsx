import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginClick = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          💧 BLOOD <span className="logo-red">DONOR</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">HOME</Link>
          <Link to="/about" className="nav-link">ABOUT US</Link>
          <Link to="/archive" className="nav-link">ARCHIVE</Link>
        </div>

        <div className="navbar-actions">
          <div className="dropdown" ref={dropdownRef}>
            <button 
              className="login-btn-red" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Login
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => handleLoginClick('/user/login')} className="dropdown-item">User</button>
                <button onClick={() => handleLoginClick('/admin/login')} className="dropdown-item">Admin</button>
                <button onClick={() => handleLoginClick('/hospital/login')} className="dropdown-item">Hospital</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;