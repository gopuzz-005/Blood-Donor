import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/UserRegisterLogin.css';
import Navbar from '../common/Navbar';

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5001/User/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("userInfo", JSON.stringify(data));
          toast.success("Login Successful!", { position: "top-right", autoClose: 2000 });
          setTimeout(() => { navigate('/user/dashboard'); }, 2000);
        } else {
          toast.error(data.message || "Invalid Email or Password");
        }
      } catch (error) {
        toast.error("Server not responding.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="user-log-wrapper">
        <ToastContainer />
        <div className="user-log-container">
          
          {/* Left Side - Reduced Size Box */}
          <div className="user-log-image-side">
            <div className="user-log-overlay">
              <h1>Welcome Back!</h1>
              <p>Every drop counts. Log in to manage your donations.</p>
            </div>
          </div>

          {/* Right Side - Expanded Form Side */}
          <div className="user-log-form-side">

            {/* ROLE SELECTOR */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px', background: '#f1f5f9', padding: '6px', borderRadius: '12px' }}>
              <button 
                onClick={() => navigate('/user/login')} 
                style={{ flex: 1, padding: '10px', border: 'none', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontWeight: 'bold', color: '#1e293b', cursor: 'pointer', transition: '0.3s' }}
              >
                Patient / User
              </button>
              <button 
                onClick={() => navigate('/donor/login')} 
                style={{ flex: 1, padding: '10px', border: 'none', background: 'transparent', borderRadius: '8px', fontWeight: 'bold', color: '#64748b', cursor: 'pointer', transition: '0.3s' }}
              >
                Blood Donor
              </button>
            </div>

            <div className="user-log-header">
              <h2>User Login</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="user-log-form">
              <div className="user-log-input-group">
                <input 
                  type="text" 
                  name="email" 
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'user-log-error-border' : ''}
                />
                <Email className="user-log-icon" />
                {errors.email && <span className="user-log-error-text">{errors.email}</span>}
              </div>

              <div className="user-log-input-group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'user-log-error-border' : ''}
                />
                <Lock className="user-log-icon" />
                <div className="user-log-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </div>
                {errors.password && <span className="user-log-error-text">{errors.password}</span>}
              </div>

              <div className="user-log-options">
                <label><input type="checkbox" /> Remember me</label>
                <Link to="/user/forgot-password">Forgot Password?</Link>
              </div>

              <button type="submit" className="user-log-btn" disabled={loading}>
                {loading ? "Logging In..." : "Log In"}
              </button>

              <p className="user-log-footer">
                Don't have an account? <Link to="/user/register">Register now</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;