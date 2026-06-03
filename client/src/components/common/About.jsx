import React from 'react';
import '../../styles/About.css';
import { Speed, Security, Favorite, LinkedIn, Twitter, Language } from '@mui/icons-material';

import imgStory from '../../assets/aboutimg/blooddonation.jpg'; 
import team1 from '../../assets/aboutimg/blooddonation.jpg';   
import team2 from '../../assets/aboutimg/bloodfall.jpg';
import team3 from '../../assets/aboutimg/smartphone.jpg';
import Navbar from './Navbar';

const About = () => {
  return (
    <div>
<Navbar/>
    <div className="about-wrapper">
      
      <header className="about-header">
        <div className="header-content">
          <span className="tagline">WHO WE ARE</span>
          <h1>More Than Just Code.<br />We Are <span className="highlight">Saving Lives.</span></h1>
          <p className="header-desc">
            BloodLink is a non-profit initiative powered by technology to eliminate 
            the communication gap between blood donors and hospitals.
          </p>
        </div>
        <div className="header-bg-shape"></div>
      </header>

      <div className="about-container">
        <div className="story-section">
          
          <div className="story-image-wrapper">
            <div className="story-blob"></div> {/* Animated Blob */}
            <img src={imgStory} alt="Our Story" className="story-img" />
            
            <div className="experience-badge">
              <span className="exp-number">100%</span>
              <span className="exp-text">Non-Profit</span>
            </div>
          </div>

          <div className="story-content">
            <h4 className="sub-heading">THE ORIGIN</h4>
            <h2>Bridging the Gap</h2>
            <p>
              It started with a simple observation: blood banks often have stock, 
              and donors are willing to give, but the <strong>connection</strong> is too slow. 
              In emergencies, every second counts.
            </p>
            <p>
              We developed this MERN-stack solution to replace manual phone calls 
              and chaotic WhatsApp groups with a centralized, automated, and 
              geo-located network.
            </p>

            <div className="stats-grid">
              <div className="stat-box">
                <h4 className="counter">10k+</h4>
                <span>Lives Impacted</span>
              </div>
              <div className="stat-box">
                <h4 className="counter">500+</h4>
                <span>Active Donors</span>
              </div>
              <div className="stat-box">
                <h4 className="counter">24/7</h4>
                <span>System Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="values-section">
        <div className="about-container">
          <div className="section-title centered">
            <h4 className="sub-heading">OUR VALUES</h4>
            <h2>What Drives Us</h2>
            <div className="title-underline"></div>
          </div>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="icon-box">
                <Speed fontSize="large" />
              </div>
              <h3>Speed</h3>
              <p>
                We optimize our code and database queries to ensure alerts 
                reach donors in milliseconds, not minutes. Time is critical.
              </p>
            </div>

            <div className="value-card">
              <div className="icon-box">
                <Security fontSize="large" />
              </div>
              <h3>Trust</h3>
              <p>
                Donor privacy is paramount. We use JWT authentication and 
                encrypted data storage to keep user information secure.
              </p>
            </div>

            <div className="value-card">
              <div className="icon-box">
                <Favorite fontSize="large" />
              </div>
              <h3>Empathy</h3>
              <p>
                Technology is the tool, but humanity is the goal. We design 
                interfaces that are accessible to everyone, everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="about-container">
          <div className="section-title centered">
            <h4 className="sub-heading">THE CREATORS</h4>
            <h2>Meet the Minds</h2>
            <p className="subtitle">The developers and designers behind the screen.</p>
          </div>

          <div className="team-grid">
            {/* Member 1 */}
            <div className="team-card">
              <div className="team-img-box">
                <img src={team1} alt="Alex Johnson" />
                <div className="social-overlay">
                  <LinkedIn className="social-icon" />
                  <Twitter className="social-icon" />
                </div>
              </div>
              <div className="team-info">
                <h4>Alex Johnson</h4>
                <span className="role">Lead Developer</span>
              </div>
            </div>

            <div className="team-card">
              <div className="team-img-box">
                <img src={team2} alt="Sarah Williams" />
                <div className="social-overlay">
                  <LinkedIn className="social-icon" />
                  <Language className="social-icon" />
                </div>
              </div>
              <div className="team-info">
                <h4>Sarah Williams</h4>
                <span className="role">UI/UX Designer</span>
              </div>
            </div>

            <div className="team-card">
              <div className="team-img-box">
                <img src={team3} alt="Michael Chen" />
                <div className="social-overlay">
                  <LinkedIn className="social-icon" />
                  <Twitter className="social-icon" />
                </div>
              </div>
              <div className="team-info">
                <h4>Michael Chen</h4>
                <span className="role">Backend Architect</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-wrapper">
        <div className="cta-box">
          <h2>Ready to make a difference?</h2>
          <p>Whether you are a developer, a hospital, or a donor, we need you.</p>
          <button className="btn-glow">Get Involved Today</button>
        </div>
      </section>

    </div>
        </div>

  );
}

export default About;