import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Email, Lock, VpnKey, Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/UserRegisterLogin.css';
import Navbar from '../common/Navbar';

const UserForgotPassword = () => {
  const navigate = useNavigate();
  
  // --- UI States ---
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP & New Password
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- Form Data ---
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ==========================================
  // STEP 1: Send OTP to Email
  // ==========================================
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/User/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "OTP sent to your email!");
        setStep(2); 
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STEP 2: Verify OTP and Reset Password
  // ==========================================
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validation
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/User/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          otp, 
          newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password Reset Successful! Redirecting...");
        setTimeout(() => {
          navigate('/login/user'); // Send to Login Page
        }, 3000);
      } else {
        toast.error(data.message || "Failed to reset password.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
<Navbar/>
    <div className="user-log-wrapper">
      <ToastContainer />
      <div className="user-log-container">
        
        {/* Left Side - Visuals */}
        <div className="user-log-image-side" style={{ background: 'linear-gradient(135deg, #607d8b 0%, #37474f 100%)' }}>
          <div className="user-log-overlay">
            <h1>Account Recovery</h1>
            <p>
              {step === 1 
                ? "Don't worry, it happens. Enter your email and we'll send you a verification code." 
                : "Secure your account. Enter the OTP sent to your email and create a new password."}
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="user-log-form-side">
          <div className="user-log-header">
            <h2>{step === 1 ? "Forgot Password?" : "Reset Password"}</h2>
            <p>{step === 1 ? "Enter email to receive OTP" : `OTP sent to ${email}`}</p>
          </div>

          {/* --- FORM STEP 1: SEND OTP --- */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="user-log-form">
              <div className="user-log-input-group">
                <input 
                  type="email" 
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Email className="user-log-icon" />
              </div>
              
              <button type="submit" className="user-log-btn" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>

              <div className="user-log-options" style={{ justifyContent: 'center', marginTop: '20px' }}>
                <Link to="/login/user" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ArrowBack style={{ fontSize: '16px' }} /> Back to Login
                </Link>
              </div>
            </form>
          )}

          {/* --- FORM STEP 2: RESET PASSWORD --- */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="user-log-form">
              
              {/* OTP Input */}
              <div className="user-log-input-group">
                <input 
                  type="number" 
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <VpnKey className="user-log-icon" />
              </div>

              {/* New Password */}
              <div className="user-log-input-group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Lock className="user-log-icon" />
                <div className="user-log-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="user-log-input-group">
                <input 
                  type="password" 
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Lock className="user-log-icon" />
              </div>

              <button type="submit" className="user-log-btn" disabled={loading}>
                {loading ? "Resetting..." : "Set New Password"}
              </button>

              <div className="user-log-options" style={{ justifyContent: 'center', marginTop: '20px' }}>
                <span 
                  onClick={() => setStep(1)} 
                  style={{ cursor: 'pointer', color: '#d32f2f', fontSize: '14px' }}
                >
                  Change Email?
                </span>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
        </div>

  );
};

export default UserForgotPassword;