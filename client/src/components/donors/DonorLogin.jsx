import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../../styles/UserLogin.css'; 
import Navbar from '../common/Navbar';

const DonorLogin = () => {
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
        const response = await fetch("http://localhost:5001/Donor/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
        
          localStorage.setItem("userInfo", JSON.stringify(data));
          
          toast.success("Welcome back, Hero!", {
            position: "top-right",
            autoClose: 2000,
          });

          console.log("Donor Login Success:", data);

          setTimeout(() => {
            navigate('/donor/dashboard'); 
          }, 2000);

        } else {
          toast.error(data.message || "Invalid Email or Password", {
            position: "top-center"
          });
        }

      } catch (error) {
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
        
        <div className="user-log-image-side" style={{ background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)' }}>
          <div className="user-log-overlay">
            <h1>Welcome Hero!</h1>
            <p>Your commitment saves lives. Log in to manage your availability and view donation history.</p>
          </div>
        </div>

          <div className="user-log-form-side">
            
            {/* ROLE SELECTOR */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px', background: '#f1f5f9', padding: '6px', borderRadius: '12px' }}>
              <button 
                onClick={() => navigate('/user/login')} 
                style={{ flex: 1, padding: '10px', border: 'none', background: 'transparent', borderRadius: '8px', fontWeight: 'bold', color: '#64748b', cursor: 'pointer', transition: '0.3s' }}
              >
                Patient / User
              </button>
              <button 
                onClick={() => navigate('/donor/login')} 
                style={{ flex: 1, padding: '10px', border: 'none', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontWeight: 'bold', color: '#d32f2f', cursor: 'pointer', transition: '0.3s' }}
              >
                Blood Donor
              </button>
            </div>

            <div className="user-log-header">
              <h2>Donor Login</h2>
              <p>Enter your credentials to access your donor account</p>
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
                <div 
                  className="user-log-password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </div>
                {errors.password && <span className="user-log-error-text">{errors.password}</span>}
              </div>

              <div className="user-log-options">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <Link to="/donor/forgot-password">Forgot Password?</Link>
              </div>

              <button type="submit" className="user-log-btn" disabled={loading}>
                {loading ? "Verifying..." : "Log In"}
              </button>

              <p className="user-log-footer">
                Not registered as a donor? <Link to="/donor/register">Register now</Link>
              </p>
          </form>
        </div>
      </div>
    </div>
        </div>

  );
};

export default DonorLogin;