import React from 'react';
import "../style/About.css";
import Navbar from './Navbar';
import mission from "../assets/aboutimg/blooddonation.jpg"
import visionImg from "../assets/aboutimg/smartphone.jpg"
import valuesImg from "../assets/aboutimg/bloodfall.jpg"
function About() {
  return (
    <div className="about-container">
      <Navbar />

      {/* Page Header */}
      <header className="about-hero">
        <div className="container">
          <h1>About Our Mission</h1>
          <p>Saving lives through the power of community and selfless giving.</p>
        </div>
      </header>

      {/* Main Content Sections */}
      <section className="about-info">
        
        {/* Row 1: Our Story */}
        <div className="about-row">
          <div className="about-image">
            <img src={mission} alt="Our Story" />
          </div>
          <div className="about-content">
            <h4 className="sub-title">Who We Are</h4>
            <h2>Connecting Donors with Those in Need</h2>
            <p>
              Founded with the goal of bridging the gap between blood donors and 
              hospitals, we have grown into a nationwide network. We believe that 
              no life should be lost due to the unavailability of blood.
            </p>
            <p>
              Our platform uses advanced logistics to ensure that the right blood 
              type reaches the right location at the perfect time.
            </p>
          </div>
        </div>

        {/* Row 2: Mission (Reversed) */}
        <div className="about-row reverse">
          <div className="about-image">
            <img src={visionImg} alt="Our Vision" />
          </div>
          <div className="about-content">
            <h4 className="sub-title">Our Vision</h4>
            <h2>A Future with Zero Shortages</h2>
            <p>
              We envision a world where every medical emergency is met with an 
              immediate supply of safe, screened blood. By digitizing the donation 
              process, we make it easier for heroes like you to step forward.
            </p>
            <ul className="about-list">
              <li>✓ 24/7 Emergency Support</li>
              <li>✓ Nationwide Hospital Network</li>
              <li>✓ Verified & Safe Donors</li>
            </ul>
          </div>
        </div>

        {/* Row 3: Our Values */}
        <div className="about-row">
          <div className="about-image">
            <img src={valuesImg} alt="Our Values" />
          </div>
          <div className="about-content">
            <h4 className="sub-title">Core Values</h4>
            <h2>Integrity, Care & Transparency</h2>
            <p>
              Every drop of blood is a gift of life. We treat every donation with 
              the utmost respect, ensuring transparency in how blood is tested, 
              stored, and delivered to patients.
            </p>
            <button className="contact-btn">Meet Our Team</button>
          </div>
        </div>

      </section>

      {/* Stats Section (Optional Professional Touch) */}
      <section className="stats-bar">
        <div className="stat-item">
          <h3>10k+</h3>
          <p>Active Donors</p>
        </div>
        <div className="stat-item">
          <h3>500+</h3>
          <p>Hospitals Partnered</p>
        </div>
        <div className="stat-item">
          <h3>25k+</h3>
          <p>Lives Saved</p>
        </div>
      </section>
    </div>
  );
}

export default About;