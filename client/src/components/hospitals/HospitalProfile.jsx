import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import HospitalSidebar from './HospitalSidebar';
import { 
  Edit, Save, Close, LocalHospital, Phone, LocationOn, 
  MedicalServices, LocalShipping, Apartment 
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/HospitalProfile.css';

const HospitalProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // --- Form Data State ---
  const [formData, setFormData] = useState({
    hospitalName: '',
    licenseNumber: '',
    ownershipType: '',
    email: '',
    phone: '',
    emergencyPhone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    totalBeds: '',
    hasBloodBank: false,
    hasAmbulance: false,
  });

  // --- Error State ---
  const [errors, setErrors] = useState({});

  // --- 1. FETCH PROFILE ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token || userInfo.role !== 'hospital') {
            setLoading(false);
            return;
        }
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get("http://localhost:5001/Hospitals/profile", config);
        
        setFormData(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load profile");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- 2. INPUT HANDLER WITH MASKS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear error
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    if (type === 'checkbox') {
        setFormData({ ...formData, [name]: checked });
        return;
    }

    // A. Alphabets Only (City, State)
    if (name === 'city' || name === 'state') {
        const alphabetRegex = /^[a-zA-Z\s]*$/;
        if (alphabetRegex.test(value)) {
            setFormData({ ...formData, [name]: value });
        }
    }
    // B. Numbers Only (Phones, Zip, Beds)
    else if (['phone', 'emergencyPhone', 'zipCode', 'totalBeds'].includes(name)) {
        const numberRegex = /^\d*$/;
        if (numberRegex.test(value)) {
            setFormData({ ...formData, [name]: value });
        }
    }
    // C. Default
    else {
        setFormData({ ...formData, [name]: value });
    }
  };

  // --- 3. VALIDATION LOGIC ---
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!(formData.hospitalName || '').trim()) {
        tempErrors.hospitalName = "Hospital Name is required";
        isValid = false;
    }

    if (!(formData.licenseNumber || '').trim()) {
        tempErrors.licenseNumber = "License is required";
        isValid = false;
    }

    if (formData.phone && formData.phone.length !== 10) {
        tempErrors.phone = "Must be 10 digits";
        isValid = false;
    }

    if (formData.emergencyPhone && formData.emergencyPhone.length !== 10) {
        tempErrors.emergencyPhone = "Must be 10 digits";
        isValid = false;
    }

    if (formData.zipCode && formData.zipCode.length !== 6) {
        tempErrors.zipCode = "Must be 6 digits";
        isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // --- 4. UPDATE PROFILE ---
  const handleSave = async () => {
    
    // Check Validation
    if (!validateForm()) {
        toast.error("Please fix errors in the form");
        return;
    }

    setSaveLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.put("http://localhost:5001/Hospitals/profile", formData, config);
      
      // Update LocalStorage Name
      const updatedUser = { ...userInfo, hospitalName: data.hospitalName };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      toast.success("Profile Updated");
      setIsEditing(false);
    } catch (error) {
      toast.error("Update Failed");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <Layout Sidebar={HospitalSidebar}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Hospital Profile</h1>
          <p className="profile-subtitle">Manage organization details and facilities.</p>
        </div>

        {loading ? (
            <div style={{textAlign:'center', marginTop:'50px'}}><CircularProgress style={{color:'#0ea5e9'}}/></div>
        ) : (
            <div className="profile-grid">
                
                {/* LEFT: Summary */}
                <div className="profile-card">
                    <div className="hospital-avatar">
                        {formData.hospitalName.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="profile-name">{formData.hospitalName}</h2>
                    <p className="profile-meta">License: {formData.licenseNumber}</p>
                    
                    <div style={{display:'flex', justifyContent:'center', gap:'10px', marginBottom:'20px'}}>
                        <span style={{background:'#f1f5f9', padding:'5px 10px', borderRadius:'15px', fontSize:'0.8rem', fontWeight:'600'}}>
                            {formData.ownershipType}
                        </span>
                        <span style={{background:'#f1f5f9', padding:'5px 10px', borderRadius:'15px', fontSize:'0.8rem', fontWeight:'600'}}>
                            {formData.totalBeds} Beds
                        </span>
                    </div>

                    {/* Facilities Toggle */}
                    <div className="facilities-box">
                        <div className="facility-item">
                            <span className="facility-label"><MedicalServices fontSize="small"/> Blood Bank</span>
                            <label className="switch">
                                <input type="checkbox" name="hasBloodBank" checked={formData.hasBloodBank} onChange={handleChange} disabled={!isEditing}/>
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="facility-item">
                            <span className="facility-label"><LocalShipping fontSize="small"/> Ambulance</span>
                            <label className="switch">
                                <input type="checkbox" name="hasAmbulance" checked={formData.hasAmbulance} onChange={handleChange} disabled={!isEditing}/>
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Details Form */}
                <div className="details-card">
                    <div className="details-header">
                        <h3 style={{margin:0, color:'#1e293b'}}>Organization Details</h3>
                        {!isEditing && (
                            <button className="edit-btn" onClick={() => setIsEditing(true)}>
                                <Edit fontSize="small" style={{verticalAlign:'middle', marginRight:5}}/> Edit
                            </button>
                        )}
                    </div>

                    <form className={isEditing ? 'editing' : ''}>
                        
                        <div className="section-label"><Apartment style={{color:'#0ea5e9'}}/> General Info</div>
                        <div className="form-row">
                            <div className="input-group full-width">
                                <input className="input-field" name="hospitalName" value={formData.hospitalName} onChange={handleChange} disabled={!isEditing} placeholder="Hospital Name"/>
                                {errors.hospitalName && <div className="error-text">{errors.hospitalName}</div>}
                            </div>
                        </div>
                        <div className="form-row">
                            {/* --- UPDATED: OWNERSHIP TYPE DROPDOWN --- */}
                            <div className="input-group">
                                <select 
                                    className="input-field" 
                                    name="ownershipType" 
                                    value={formData.ownershipType} 
                                    onChange={handleChange} 
                                    disabled={!isEditing}
                                >
                                    <option value="">Select Ownership Type</option>
                                    <option value="Government">Government</option>
                                    <option value="Private">Private</option>
                                    <option value="Non-Profit">Non-Profit / Charity</option>
                                    <option value="Military">Military</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <input className="input-field" type="text" name="totalBeds" value={formData.totalBeds} onChange={handleChange} disabled={!isEditing} placeholder="Total Beds"/>
                            </div>
                        </div>

                        <div className="section-label"><Phone style={{color:'#0ea5e9'}}/> Contact</div>
                        <div className="form-row">
                            <div className="input-group">
                                <input className="input-field" name="email" value={formData.email} disabled style={{opacity:0.7, cursor:'not-allowed'}}/>
                            </div>
                            <div className="input-group">
                                <input className="input-field" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} placeholder="General Phone"/>
                                {errors.phone && <div className="error-text">{errors.phone}</div>}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="input-group">
                                <input className="input-field" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} disabled={!isEditing} placeholder="Emergency Hotline" style={{borderColor: isEditing ? '#fecaca' : ''}}/>
                                {errors.emergencyPhone && <div className="error-text">{errors.emergencyPhone}</div>}
                            </div>
                        </div>

                        <div className="section-label"><LocationOn style={{color:'#0ea5e9'}}/> Location</div>
                        <div className="form-row">
                            <input className="input-field full-width" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} placeholder="Street Address"/>
                        </div>
                        <div className="form-row">
                            <div className="input-group">
                                <input className="input-field" name="city" value={formData.city} onChange={handleChange} disabled={!isEditing} placeholder="City"/>
                            </div>
                            <div className="input-group">
                                <input className="input-field" name="state" value={formData.state} onChange={handleChange} disabled={!isEditing} placeholder="State"/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="input-group">
                                <input className="input-field" name="zipCode" value={formData.zipCode} onChange={handleChange} disabled={!isEditing} placeholder="Zip Code"/>
                                {errors.zipCode && <div className="error-text">{errors.zipCode}</div>}
                            </div>
                        </div>

                        {isEditing && (
                            <div style={{display:'flex', gap:'15px', marginTop:'20px'}}>
                                <button type="button" className="save-btn" onClick={handleSave} disabled={saveLoading}>
                                    {saveLoading ? "Saving..." : "Save Changes"}
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
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

export default HospitalProfile;