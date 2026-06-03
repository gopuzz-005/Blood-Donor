import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Email, Lock, VpnKey, Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../../styles/AdminTheme.css';
import Navbar from '../common/Navbar';

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- Step 1: Send OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter Admin Email");
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/Admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Security Code Sent");
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Network Error");
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Reset ---
  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/Admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Credentials Updated");
        setTimeout(() => navigate('/login/admin'), 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="admin-bg">
      {/* Background Animation */}
      <div className="blood-cell cell-1"></div>
      <div className="blood-cell cell-2"></div>
      <div className="blood-cell cell-3"></div>
      <div className="blood-cell cell-4"></div>
      <div className="blood-cell cell-5"></div>
      <div className="blood-cell cell-6"></div>
      
      <ToastContainer theme="dark" />

      <div className="admin-card">
        <VpnKey style={{ fontSize: 50, color: '#ff4d4d', marginBottom: '15px' }} />
        <h2>ACCOUNT RECOVERY</h2>
        <p style={{ color: '#ccc', marginBottom: '30px' }}>
          {step === 1 ? "Verify Admin Identity" : "Secure New Credentials"}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="admin-input-group">
              <Email className="admin-icon" />
              <input 
                type="email" 
                placeholder="Official Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="admin-btn" disabled={loading}>
              {loading ? "VERIFYING..." : "SEND SECURITY CODE"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <div className="admin-input-group">
              <VpnKey className="admin-icon" />
              <input 
                type="number" 
                placeholder="6-Digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="admin-input-group">
              <Lock className="admin-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#aaa' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </div>
            <div className="admin-input-group">
              <Lock className="admin-icon" />
              <input 
                type="password" 
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="admin-btn" disabled={loading}>
              {loading ? "UPDATING..." : "RESET PASSWORD"}
            </button>
            <div 
              onClick={() => setStep(1)} 
              className="admin-link"
              style={{ cursor: 'pointer' }}
            >
              Resend OTP?
            </div>
          </form>
        )}

        <Link to="/login/admin" className="admin-link">
          <ArrowBack style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 5 }} /> 
          Return to Login
        </Link>
      </div>
    </div>
        </div>

  );
};

export default AdminForgotPassword;