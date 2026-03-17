import React from 'react';
import "../style/Landingpage.css";
import Navbar from './Navbar';
import img1 from "../assets/landingImg/donate.jpg"
import img2 from "../assets/landingImg/happydonor.jpg"
import img3 from "../assets/landingImg/blooddrops.jpg"
function Landingpage() {
  return (
    <div className="landing-container">
      <Navbar />

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">Be A Hero. <span className="text-red">Save Lives.</span></h1>
          <p className="hero-subtitle">Your blood donation can give a second chance at life to someone in need.</p>
          <button className="cta-button">LOGIN</button>
        </div>
      </header>

      {/* Zig-Zag Content Sections */}
      <section className="info-section">
        
        {/* Row 1: Image Left, Text Right */}
        <div className="zigzag-row">
          <div className="zigzag-image">
            <img src={img1} alt="Blood Donation Process" />
          </div>
          <div className="zigzag-text">
            <span className="badge">Process</span>
            <h2>Simple & Safe Process</h2>
            <p>Donating blood is a simple four-step process: registration, medical history and mini-physical, donation, and refreshments. It takes less than an hour of your time but lasts a lifetime for the recipient.</p>
            <button className="secondary-btn">Learn More</button>
          </div>
        </div>

        {/* Row 2: Text Left, Image Right (Zig-Zag) */}
        <div className="zigzag-row reverse">
          <div className="zigzag-image">
            <img src={img2} alt="the need" />
          </div>
          <div className="zigzag-text">
            <span className="badge">Strategic Necessity (The Need)</span>
            <h2> Essential Supply Chains</h2>
            <p> Healthcare systems rely entirely on donors because blood has no synthetic 
                substitute. Maintaining a robust inventory is critical for surgical success and long-term
                 patient care. Your contribution builds a more resilient medical community.</p>
            <button className="secondary-btn">Read more</button>
          </div>
        </div>

        {/* Row 3: Image Left, Text Right */}
        <div className="zigzag-row">
          <div className="zigzag-image">
            <img src={img3} alt="Community Impact" />
          </div>
          <div className="zigzag-text">
            <span className="badge">Impact</span>
            <h2>Every Drop Counts</h2>
            <p>One single donation can save up to three lives. From trauma patients to those undergoing surgery or cancer treatment, your blood is a vital resource that hospitals need every single day.</p>
            <button className="secondary-btn">See Success Stories</button>
          </div>
        </div>

      </section>

      {/* Footer Call to Action */}
      <footer className="footer-cta">
        <h2>Ready to make a difference?</h2>
        <button className="cta-button">REGISTER</button>
      </footer>
    </div>
  );
}

export default Landingpage;