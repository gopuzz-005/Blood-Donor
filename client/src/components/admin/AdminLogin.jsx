import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Email, Lock, Visibility, VisibilityOff, Security } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../../styles/AdminTheme.css'; 
import Navbar from '../common/Navbar';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/Admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminInfo", JSON.stringify(data));
        toast.success("Access Granted. Welcome, Admin.");
        setTimeout(() => navigate('/admin/dashboard'), 2000);
      } else {
        toast.error(data.message || "Access Denied");
      }
    } catch (error) {
      toast.error("System Failure. Check Server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
<Navbar/>
    <div className="Admin-log-bg">
      {/* Animated Cells - All prefixed with Admin-log- */}
      <div className="Admin-log-cell Admin-log-cell-1"></div>
      <div className="Admin-log-cell Admin-log-cell-2"></div>
      <div className="Admin-log-cell Admin-log-cell-3"></div>
      <div className="Admin-log-cell Admin-log-cell-4"></div>
      <div className="Admin-log-cell Admin-log-cell-5"></div>
      <div className="Admin-log-cell Admin-log-cell-6"></div>
      <div className="Admin-log-cell Admin-log-cell-7"></div>

      <ToastContainer theme="dark" />

      <div className="Admin-log-card">
        <Security style={{ fontSize: 50, color: '#ff4d4d', marginBottom: '15px' }} />
        <h2>SYSTEM LOGIN</h2>
        <p style={{ color: '#ccc', marginBottom: '30px' }}>Restricted Access. Super Admin Only.</p>

        <form onSubmit={handleSubmit}>
          <div className="Admin-log-input-group">
            <Email className="Admin-log-icon" />
            <input 
              type="text" 
              name="email" 
              placeholder="Admin ID / Email" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="Admin-log-input-group">
            <Lock className="Admin-log-icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Security Key" 
              value={formData.password}
              onChange={handleChange}
            />
            <div 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#aaa' }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </div>
          </div>

          <button type="submit" className="Admin-log-btn" disabled={loading}>
            {loading ? "AUTHENTICATING..." : "ACCESS DASHBOARD"}
          </button>
        </form>

        <Link to="/admin/forgot-password" className="Admin-log-link">Forgot Credentials?</Link>
      </div>
    </div>
        </div>

  );
};

export default AdminLogin;