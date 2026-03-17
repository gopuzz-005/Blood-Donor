import React from 'react';
import '../style/Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top custom-navbar">
      <div className="container">
        {/* Brand / Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="logo-icon">🩸</span>
          <span className="brand-text">BLOOD<span className="text-red">DONOR</span></span>
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/">HOME</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/about">ABOUT US</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/archive">ARCHIVE</Link>
            </li>
          </ul>

          {/* Action Button with Dropdown */}
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <button 
                className="nav-cta-btn dropdown-toggle" 
                type="button" 
                id="loginDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                LOGIN
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="loginDropdown">
                <li><Link className="dropdown-item py-2" to="/login/user">User</Link></li>
                <li><Link className="dropdown-item py-2" to="/login/admin">Admin</Link></li>
                <li><Link className="dropdown-item py-2" to="/login/hospital">Hospital</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;