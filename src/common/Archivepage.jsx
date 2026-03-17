import React from 'react';
import "../style/Archive.css";
import Navbar from './Navbar';
import aboutImg from "../assets/landingImg/happydonor.jpg"; // Using your existing assets

function AboutPage() {
  const stats = [
    { label: "Lives Saved", value: "25,000+" },
    { label: "Active Donors", value: "12,000+" },
    { label: "Partner Hospitals", value: "85+" },
    { label: "Blood Drives", value: "450+" },
  ];

  const values = [
    {
      title: "Our Mission",
      desc: "To ensure a stable and safe blood supply for every patient in need through community engagement and innovative logistics."
    },
    {
      title: "Integrity",
      desc: "We maintain the highest standards of safety and medical ethics in every drop we collect and distribute."
    },
    {
      title: "Community",
      desc: "We believe in the power of people. Our network of donors is the heartbeat of our local healthcare system."
    }
  ];

  return (
    <div className="about-container">
      <Navbar />

      {/* Modern Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>Empowering Communities <br />Through <span className="text-red">Compassion</span></h1>
          <p>We are a dedicated network of healthcare professionals and volunteers working together to bridge the gap between blood donors and those in urgent need.</p>
        </div>
      </section>

      {/* Story Section: Image Left, Text Right */}
      <section className="story-section">
        <div className="story-grid">
          <div className="story-image">
            <img src={aboutImg} alt="Our Story" />
            <div className="experience-badge">
              <span className="years">10+</span>
              <span className="text">Years of Service</span>
            </div>
          </div>
          <div className="story-text">
            <span className="subtitle">WHO WE ARE</span>
            <h2>Bridging the Gap Between Donors and Patients</h2>
            <p>Founded in 2014, our organization started with a simple observation: lives were being lost not due to a lack of blood, but due to a lack of information and access.</p>
            <p>Today, we operate a state-of-the-art platform that connects thousands of donors with hospitals in real-time. Our commitment is to ensure that no surgery is delayed and no life is lost due to blood shortages.</p>
            <button className="primary-btn">View Our Annual Report</button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section className="values-section">
        <div className="section-header">
          <h2>Our Core Values</h2>
          <div className="header-line"></div>
        </div>
        <div className="values-grid">
          {values.map((item, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">0{index + 1}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="about-footer">
        <h2>Become Part of Our Mission</h2>
        <div className="footer-btns">
          <button className="cta-button">Donate</button>
          <button className="secondary-btn">Volunteer</button>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;