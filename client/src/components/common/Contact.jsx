import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import "../../styles/Contact.css"; 

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    console.log(formData);
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero Section */}
      <header className="page-hero">
        <div className="hero-overlay">
          <h1 className="hero-title">Contact <span className="text-red">Us</span></h1>
          <p className="hero-subtitle">Have questions or need assistance? Our team is here to support your life-saving journey.</p>
        </div>
      </header>

      {/* Main Content */}
      <section className="contact-content">
        <div className="contact-grid">
          
          {/* Left Side: Info Cards */}
          <div className="contact-sidebar">
            <div className="section-header">
              <span className="badge">Get in Touch</span>
              <h2>We'd Love to Hear From You</h2>
              <p>Reach out through any of these channels or fill out the form.</p>
            </div>

            <div className="info-card-group">
              <div className="info-card">
                <div className="icon-circle">📍</div>
                <div>
                  <h4>Our Location</h4>
                  <p>123 Health Ave, Medical District, NY 10001</p>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-circle">📞</div>
                <div>
                  <h4>Phone Number</h4>
                  <p>+1 (800) 555-0199</p>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-circle">✉️</div>
                <div>
                  <h4>Email Address</h4>
                  <p>support@bloodbank.org</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Professional Form */}
          <div className="form-container">
            <form onSubmit={handleSubmit} className="modern-form">
              <div className="input-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" name="email" placeholder="john@example.com" onChange={handleChange} required />
                </div>
              </div>

              <div className="input-group">
                <label>Subject</label>
                <input type="text" name="subject" placeholder="How can we help?" onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Message</label>
                <textarea name="message" rows="6" placeholder="Write your message here..." onChange={handleChange} required></textarea>
              </div>

              <button type="submit" className="cta-button">SEND MESSAGE</button>
            </form>
          </div>

        </div>
      </section>

      {/* Footer CTA */}
      <footer className="footer-cta">
        <h2>Want to save a life today?</h2>
        <Link to='/registerpage'>
          <button className="secondary-btn">JOIN AS A DONOR</button>
        </Link>
      </footer>
    </div>
  );
}

export default Contact;