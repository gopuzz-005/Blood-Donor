import React, { useState } from 'react';
import "../../styles/LandingPage.css";
import Navbar from './Navbar'; 
import img1 from "../../assets/landingImg/donate.jpg";
import img2 from "../../assets/landingImg/happydonor.jpg";
import img3 from "../../assets/landingImg/blooddrops.jpg";
import docPatient from "../../assets/landingImg/docpatient.jpg";
import { Link } from 'react-router-dom';

function LandingPage() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="landing-container">
      <Navbar showDropdown={showDropdown} setShowDropdown={setShowDropdown} />

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Every Drop <span className="text-red">Counts</span></h1>
          <p className="hero-subtitle">Your blood can save lives. Join our community of heroes today.</p>
          <div className="hero-actions">
            <Link to="/user/register" className="primary-btn-red">Donate Now</Link>
            <Link to="/about" className="secondary-btn-outline">Learn More</Link>
          </div>
        </div>
      </section>

      <section className="info-section">
        
        {/* Row 1 */}
        <div className="zigzag-row">
          <div className="zigzag-image">
            <img src={img1} alt="Donate Blood" className="rounded-img shadow-lg" />
          </div>
          <div className="zigzag-text">
            <h2>The Need is Constant</h2>
            <p className="hero-description">
              Every two seconds, someone needs blood. Whether it's for emergency surgery, trauma care, or chronic illness treatments, your donation ensures a steady supply for those in critical need.
            </p>
          </div>
        </div>

        {/* Row 2 (Reversed) */}
        <div className="zigzag-row reverse">
          <div className="zigzag-text">
            <h2>Be a Hero in Your Community</h2>
            <p className="hero-description">
              Donating blood is a safe and simple process. A single donation can save up to three lives. Join thousands of happy donors who make a tangible difference in their local hospitals.
            </p>
          </div>
          <div className="zigzag-image">
            <img src={img2} alt="Happy Donor" className="rounded-img shadow-lg" />
          </div>
        </div>

        {/* Row 3 (From screenshot) */}
        <div className="zigzag-row">
          <div className="zigzag-image">
            <img src={img3} alt="Community Impact" className="rounded-img shadow-lg" />
          </div>
          <div className="zigzag-text">
            <p className="hero-description font-large">
              to those undergoing surgery or cancer treatment, your blood is a 
              vital resource that hospitals need every single day.
            </p>
            <button className="secondary-btn-outline mt-4">See Success Stories</button>
          </div>
        </div>
      </section>

      <footer className="footer-cta">
        <h2 className="footer-title">Ready to make a difference?</h2>
        <Link to='/user/register'>
          <button className="cta-button-red">REGISTER</button>
        </Link>
      </footer>

      <div className="toast-notification">
        <div className="toast-icon">✓</div>
        <span>Copied to clipboard.</span>
      </div>
    </div>
  );
}

export default LandingPage;