import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import DonorSidebar from './DonorSidebar';
import { 
  Edit, 
  Save, 
  Close, 
  Person, 
  ContactPhone, 
  MedicalServices, 
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/Profile.css'; 

const DonorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // --- Form Data State ---
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    weight: '',
    hasDisease: 'no',
    hadSurgery: 'no',
    isAvailable: true,
    createdAt: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token || userInfo.role !== 'donor') {
          toast.error("Session expired or unauthorized.");
          setFetchLoading(false);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        const { data } = await axios.get("http://localhost:5001/Donor/profile", config);

        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          age: data.age || '', 
          gender: data.gender || '',
          bloodGroup: data.bloodGroup || '',
          weight: data.weight || '',
          hasDisease: data.hasDisease || 'no',
          hadSurgery: data.hadSurgery || 'no',
          isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
          createdAt: data.createdAt
        });

      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load profile.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    if (type === 'checkbox') {
        setFormData({ ...formData, [name]: checked });
        return;
    }

    if (name === 'fullName') {
        const alphabetRegex = /^[a-zA-Z\s]*$/;
        if (alphabetRegex.test(value)) {
            setFormData({ ...formData, [name]: value });
        }
    }
    else if (name === 'phone') {
        const numberRegex = /^\d*$/;
        if (numberRegex.test(value) && value.length <= 10) {
            setFormData({ ...formData, [name]: value });
        }
    }
    else if (name === 'age') {
        const numberRegex = /^\d*$/;
        if (numberRegex.test(value) && value.length <= 3) {
            setFormData({ ...formData, [name]: value });
        }
    }
    else if (name === 'weight') {
        const numberRegex = /^\d*$/;
        if (numberRegex.test(value) && value.length <= 3) {
            setFormData({ ...formData, [name]: value });
        }
    }
    else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
        tempErrors.fullName = "Full Name is required.";
        isValid = false;
    }

    if (!formData.phone || formData.phone.length !== 10) {
        tempErrors.phone = "Mobile must be 10 digits.";
        isValid = false;
    }

    if (!formData.weight || parseInt(formData.weight) <= 50) {
        tempErrors.weight = "Weight must be > 50kg to donate.";
        isValid = false;
    }

    if (!formData.age || parseInt(formData.age) < 18) {
        tempErrors.age = "Must be 18+ years old.";
        isValid = false;
    }

    if ((formData.hasDisease === 'yes' || formData.hadSurgery === 'yes') && formData.isAvailable) {
        toast.warning("You cannot be 'Available' with a chronic disease or recent surgery.");
        tempErrors.isAvailable = "Mark unavailable due to medical reasons.";
        isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSave = async () => {
    
    if (!validateForm()) {
        toast.error("Please fix errors before saving.");
        return;
    }

    setSaveLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { 
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}` 
        } 
      };

      const { data } = await axios.put("http://localhost:5001/Donor/profile", formData, config);

      const updatedLocalStorage = { ...userInfo, fullName: data.fullName };
      localStorage.setItem("userInfo", JSON.stringify(updatedLocalStorage));

      toast.success("Profile Updated Successfully!");
      setIsEditing(false);

    } catch (error) {
      console.error("Update error:", error);
      toast.error("Update failed.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <Layout Sidebar={DonorSidebar}>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Donor Profile</h1>
          <p className="profile-subtitle">Manage your personal and health information.</p>
        </div>

        {fetchLoading ? (
            <div style={{ textAlign: 'center', marginTop: '50px' }}><CircularProgress style={{ color: '#be123c' }} /></div>
        ) : (
            <div className="profile-grid">
            
            <div className="profile-card avatar-card">
                <div className="avatar-circle" style={{ borderColor: '#ffe4e6', color: '#be123c', background: '#fff1f2' }}>
                    {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : "D"}
                </div>
                <h2 style={{fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '10px 0'}}>{formData.fullName}</h2>
                <span className="user-label" style={{background: '#ffe4e6', color: '#881337'}}>Blood Donor</span>

                <div className="stats-row">
                    <div className="stat-box">
                        <span className="stat-num" style={{color: '#be123c'}}>{formData.bloodGroup}</span>
                        <span className="stat-text">Blood Type</span>
                    </div>
                    <div className="stat-box">
                        <span className={`stat-num ${formData.isAvailable ? 'status-active' : ''}`} style={!formData.isAvailable ? {color: '#9ca3af'} : {}}>
                            {formData.isAvailable ? "Yes" : "No"}
                        </span>
                        <span className="stat-text">Available</span>
                    </div>
                </div>
            </div>

            <div className="details-card">
                <div className="details-header">
                    <h3 style={{margin:0, fontSize: '1.2rem', color: '#1e293b'}}>Health & Personal Info</h3>
                    {!isEditing && (
                        <button className="edit-btn" onClick={() => setIsEditing(true)}>
                            <Edit fontSize="small" style={{marginRight: 5}}/> Edit Details
                        </button>
                    )}
                </div>

                <form className={isEditing ? 'editing' : ''}>
                    
                    {/* Basic Info */}
                    <div className="section-sub-title"><Person fontSize="small" style={{color: '#be123c'}} /> Personal Information</div>
                    <div className="input-row">
                        <div className="input-group">
                            <label>Full Name (Alphabets Only)</label>
                            <input 
                                type="text" name="fullName" 
                                className={`input-field ${errors.fullName ? 'input-error' : ''}`}
                                value={formData.fullName} onChange={handleChange} disabled={!isEditing} 
                            />
                            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" className="input-field" value={formData.email} disabled style={{cursor:'not-allowed', opacity:0.7}} />
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input-group">
                            <label>Mobile Number (10 Digits)</label>
                            <input 
                                type="text" name="phone" 
                                className={`input-field ${errors.phone ? 'input-error' : ''}`}
                                value={formData.phone} onChange={handleChange} disabled={!isEditing} 
                            />
                            {errors.phone && <span className="error-text">{errors.phone}</span>}
                        </div>
                        <div className="input-group">
                            <label>Age (18+)</label>
                            <input 
                                type="text" name="age" 
                                className={`input-field ${errors.age ? 'input-error' : ''}`}
                                value={formData.age} onChange={handleChange} disabled={!isEditing} 
                            />
                            {errors.age && <span className="error-text">{errors.age}</span>}
                        </div>
                    </div>

                    <div className="section-sub-title" style={{marginTop:'30px'}}><MedicalServices fontSize="small" style={{color: '#be123c'}} /> Medical Eligibility</div>
                    <div className="input-row">
                        <div className="input-group">
                            <label>Blood Group</label>
                            <select name="bloodGroup" className="input-field" value={formData.bloodGroup} onChange={handleChange} disabled={!isEditing}>
                                <option value="A+">A+</option><option value="A-">A-</option>
                                <option value="B+">B+</option><option value="B-">B-</option>
                                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                <option value="O+">O+</option><option value="O-">O-</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Weight (kg)  50</label>
                            <input 
                                type="text" name="weight" 
                                className={`input-field ${errors.weight ? 'input-error' : ''}`}
                                value={formData.weight} onChange={handleChange} disabled={!isEditing} 
                            />
                            {errors.weight && <span className="error-text">{errors.weight}</span>}
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input-group">
                            <label>Chronic Disease?</label>
                            <select name="hasDisease" className="input-field" value={formData.hasDisease} onChange={handleChange} disabled={!isEditing}>
                                <option value="no">No</option><option value="yes">Yes</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Surgery in last 6 months?</label>
                            <select name="hadSurgery" className="input-field" value={formData.hadSurgery} onChange={handleChange} disabled={!isEditing}>
                                <option value="no">No</option><option value="yes">Yes</option>
                            </select>
                        </div>
                    </div>

                    {isEditing && (
                        <div style={{marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', border: errors.isAvailable ? '1px solid #ef4444' : 'none'}}>
                            <input 
                                type="checkbox" 
                                name="isAvailable" 
                                checked={formData.isAvailable} 
                                onChange={handleChange}
                                style={{width: '20px', height: '20px'}}
                            />
                            <div>
                                <label style={{margin:0, fontWeight: '600', color: '#334155'}}>Available for Donation Requests?</label>
                                {errors.isAvailable && <div className="error-text">{errors.isAvailable}</div>}
                            </div>
                        </div>
                    )}

                    {isEditing && (
                        <div className="action-buttons">
                            <button type="button" className="save-btn" onClick={handleSave} disabled={saveLoading} style={{background: '#be123c'}}>
                                {saveLoading ? "Saving..." : "Save Changes"}
                            </button>
                            <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)} disabled={saveLoading}>
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>
            </div>
        )}
      </div>
    </Layout>
  );
};

export default DonorProfile;