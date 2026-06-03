import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../../styles/UserLogin.css'; 
import Navbar from '../common/Navbar';

const HospitalLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Input Change Handler ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user types
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // --- Validation ---
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

  // --- API SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setLoading(true);

      try {
        // NOTE: Endpoint is /Hospitals/login
        const response = await fetch("http://localhost:5001/Hospitals/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          // 1. Save Token
          // Using 'userInfo' ensures the Navbar works seamlessly across all user types
          localStorage.setItem("userInfo", JSON.stringify(data));
          
          // 2. Success Toast
          toast.success("Login Successful! Welcome Partner.", {
            position: "top-right",
            autoClose: 2000,
          });

          console.log("Hospital Login Success:", data);

          // 3. Redirect
          setTimeout(() => {
            navigate('/hospital/dashboard'); 
          }, 2000);

        } else {
          // 4. API Error
          toast.error(data.message || "Invalid Email or Password", {
            position: "top-center"
          });
        }

      } catch (error) {
        // 5. Network Error
        console.error("Network Error:", error);
        toast.error("Server not responding. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="user-log-wrapper">
      <ToastContainer />
      <div className="user-log-container">
        
        {/* Left Side - Image/Welcome (Blue Theme for Hospitals) */}
        <div className="user-log-image-side" style={{ background: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)' }}>
          <div className="user-log-overlay">
            <h1>Welcome Partner!</h1>
            <p>Streamline your blood inventory management. Log in to update stock levels and request emergency supplies.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="user-log-form-side">
          <div className="user-log-header">
            <h2>Hospital Login</h2>
            <p>Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="user-log-form">
            
            {/* Email Input */}
            <div className="user-log-input-group">
              <input 
                type="text" 
                name="email" 
                placeholder="Official Email Address"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'user-log-error-border' : ''}
              />
              <Email className="user-log-icon" />
              {errors.email && <span className="user-log-error-text">{errors.email}</span>}
            </div>

            {/* Password Input */}
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
              <div 
                className="user-log-password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </div>
              {errors.password && <span className="user-log-error-text">{errors.password}</span>}
            </div>

            {/* Options */}
            <div className="user-log-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password-hospital">Forgot Password?</Link>
            </div>

            {/* Submit Button */}
            <button type="submit" className="user-log-btn" disabled={loading}>
              {loading ? "Verifying..." : "Log In"}
            </button>

            {/* Footer */}
            <p className="user-log-footer">
              Not a partner hospital? <Link to="/hospital/register">Register here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
          </div>

  );
};

export default HospitalLogin;