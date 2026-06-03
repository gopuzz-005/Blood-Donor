import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Layout from '../common/Layout';
import UserSidebar from './UserSidebar';
import { 
  Person, Mail, Phone, Home, LocationCity, Edit, Save, Cancel 
} from '@mui/icons-material';
import '../../styles/Profile.css';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requestCount, setRequestCount] = useState(0);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    age: '',
    gender: 'Male',
    mobile: '',
    address: '',
    city: ''
  });

  // Fetch data on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo) return;

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get("http://localhost:5001/api/users/profile", config);
        
        setProfileData({
          fullName: data.fullName || '',
          email: data.email || '',
          age: data.age || '',
          gender: data.gender || 'Male',
          mobile: data.phone || '',
          address: data.address || '',
          city: data.city || ''
        });

        // Fetch user requests count
        try {
          const reqRes = await axios.get("http://localhost:5001/api/requests/my-requests", config);
          setRequestCount(reqRes.data.length);
        } catch (err) {
          console.error("Error fetching requests count", err);
        }

        setLoading(false);
      } catch (error) {
        toast.error("Error fetching profile data");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Allow typing in inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Save updated data
  const handleSave = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      // Map frontend fields back to backend field names
      const payload = {
        fullName: profileData.fullName,
        phone: profileData.mobile,
        age: profileData.age,
        gender: profileData.gender,
        address: profileData.address,
      };
      await axios.put("http://localhost:5001/api/users/profile", payload, config);
      
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Update failed. Check backend connection.");
    }
  };

  return (
    <Layout Sidebar={UserSidebar}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="profile-container">
        {/* TOP HEADER */}
        <div className="profile-header">
          <div className="header-left">
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">Manage your account details and preferences.</p>
          </div>
          <button 
            className={`edit-toggle-btn ${isEditing ? 'active' : ''}`} 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? <><Save /> Save Changes</> : <><Edit /> Edit Profile</>}
          </button>
        </div>

        <div className="profile-grid">
          
          {/* LEFT CARD - AVATAR & STATS */}
          <div className="profile-card avatar-card">
            <div className="avatar-circle">U</div>
            <h3 className="user-label">User Account</h3>
            
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-num">{requestCount}</span>
                <span className="stat-text">REQUESTS</span>
              </div>
              <div className="stat-item">
                <span className="stat-num status-active">Active</span>
                <span className="stat-text">STATUS</span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD - FORM DETAILS */}
          <div className="profile-card form-card">
            <h2 className="section-main-title">Personal Details</h2>

            {/* BASIC INFO */}
            <div className="form-section">
              <h3 className="section-sub-title"><Person /> Basic Information</h3>
              <div className="input-row">
                <div className="input-group">
                  <label>Full Name (Alphabets Only)</label>
                  <input name="fullName" value={profileData.fullName} onChange={handleChange} disabled={!isEditing} placeholder="Gopika" />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input name="email" type="email" value={profileData.email} onChange={handleChange} disabled={!isEditing} placeholder="example@mail.com" />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Age (18+)</label>
                  <input name="age" type="number" value={profileData.age} onChange={handleChange} disabled={!isEditing} />
                </div>
                <div className="input-group">
                  <label>Gender</label>
                  <select name="gender" value={profileData.gender} onChange={handleChange} disabled={!isEditing}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className="form-section">
              <h3 className="section-sub-title"><Phone /> Contact Information</h3>
              <div className="input-group full-width">
                <label>Mobile Number (10 Digits)</label>
                <input name="mobile" value={profileData.mobile} onChange={handleChange} disabled={!isEditing} placeholder="9876543210" />
              </div>
            </div>

            {/* ADDRESS INFO */}
            <div className="form-section">
              <h3 className="section-sub-title"><Home /> Address Details</h3>
              <div className="input-row">
                <div className="input-group">
                  <label>Street Address</label>
                  <input name="address" value={profileData.address} onChange={handleChange} disabled={!isEditing} />
                </div>
                <div className="input-group">
                  <label>City (Alphabets Only)</label>
                  <input name="city" value={profileData.city} onChange={handleChange} disabled={!isEditing} />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel Changes</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;