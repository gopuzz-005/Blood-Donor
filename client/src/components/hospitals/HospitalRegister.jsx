import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LocalHospital, Email, Phone, Lock, Visibility, VisibilityOff,
  Badge, Domain, LocationOn, MeetingRoom, Emergency, Language,
  MedicalServices, DirectionsCar 
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../../styles/HospitalRegister.css'; 
import Navbar from '../common/Navbar';

const HospitalRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // --- Form State ---
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
    password: '',
    confirmPassword: ''
  });

  // --- Error State ---
  const [errors, setErrors] = useState({});

  // --- 1. HANDLE INPUT CHANGE WITH MASKS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    // Handle Checkboxes
    if (type === 'checkbox') {
        setFormData({ ...formData, [name]: checked });
        return;
    }

    // --- INPUT MASKS ---

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
            // Apply length limits during typing
            if (name === 'zipCode' && value.length > 6) return;
            if ((name === 'phone' || name === 'emergencyPhone') && value.length > 10) return;
            
            setFormData({ ...formData, [name]: value });
        }
    }
    // C. Alphanumeric Only (License Number)
    else if (name === 'licenseNumber') {
        const alphaNumericRegex = /^[a-zA-Z0-9]*$/;
        if (alphaNumericRegex.test(value) && value.length <= 12) {
            setFormData({ ...formData, [name]: value });
        }
    }
    // D. Default (Hospital Name allows text, numbers, special chars)
    else {
        setFormData({ ...formData, [name]: value });
    }
  };

  // --- 2. VALIDATION LOGIC ---
  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    // Required Fields
    const requiredFields = ['hospitalName', 'licenseNumber', 'ownershipType', 'email', 'phone', 'emergencyPhone', 'address', 'city', 'state', 'zipCode', 'totalBeds', 'password', 'confirmPassword'];
    requiredFields.forEach((key) => {
      if (!formData[key]) {
        tempErrors[key] = "This field is required";
        isValid = false;
      }
    });

    // 1. License Number (Exactly 12 Alphanumeric)
    if (formData.licenseNumber && formData.licenseNumber.length !== 12) {
        tempErrors.licenseNumber = "License must be exactly 12 alphanumeric characters.";
        isValid = false;
    }

    // 2. Phone Numbers (Exactly 10 Digits)
    if (formData.phone && formData.phone.length !== 10) {
        tempErrors.phone = "Phone must be 10 digits.";
        isValid = false;
    }
    if (formData.emergencyPhone && formData.emergencyPhone.length !== 10) {
        tempErrors.emergencyPhone = "Emergency Hotline must be 10 digits.";
        isValid = false;
    }

    // 3. Zip Code (Exactly 6 Digits)
    if (formData.zipCode && formData.zipCode.length !== 6) {
        tempErrors.zipCode = "Zip Code must be 6 digits.";
        isValid = false;
    }

    // 4. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      tempErrors.email = "Enter a valid official email.";
      isValid = false;
    }

    // 5. Password Match
    if (formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = "Passwords do not match.";
        isValid = false;
      }
    }

    setErrors(tempErrors);
    
    if (!isValid) {
      toast.error("Please fix the errors in the form.");
    }

    return isValid;
  };

  // --- API SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:5001/Hospitals/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Hospital Registration Successful!", {
            position: "top-right",
            autoClose: 2500,
          });

          setTimeout(() => {
            navigate('/hospital/login');
          }, 2500);

        } else {
          toast.error(data.message || "Registration Failed", {
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
      <div className="auth-wrapper">
        <ToastContainer />
        <div className="auth-container register-container">
          <div className="auth-header">
            <h2>Register Hospital</h2>
            <p>Partner with BloodLink to manage inventory and save lives.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            
            {/* --- Section 1: Organization Details --- */}
            <h4 className="form-section-title">Organization Details</h4>
            <div className="form-grid">
              
              {/* Hospital Name (All chars allowed) */}
              <div className="input-group full-width">
                <LocalHospital className="input-icon" />
                <input 
                  type="text" name="hospitalName" placeholder="Hospital Name"
                  value={formData.hospitalName} onChange={handleChange}
                  className={errors.hospitalName ? 'error-input' : ''}
                />
                {errors.hospitalName && <span className="error-text">{errors.hospitalName}</span>}
              </div>

              {/* License Number (Alphanumeric, 12 chars) */}
              <div className="input-group">
                <Badge className="input-icon" />
                <input 
                  type="text" name="licenseNumber" placeholder="License No (12 Alphanumeric)"
                  value={formData.licenseNumber} onChange={handleChange}
                  className={errors.licenseNumber ? 'error-input' : ''}
                />
                {errors.licenseNumber && <span className="error-text">{errors.licenseNumber}</span>}
              </div>

              {/* Ownership Type */}
              <div className="input-group">
                <Domain className="input-icon" />
                <select 
                  name="ownershipType" 
                  value={formData.ownershipType} 
                  onChange={handleChange}
                  className={errors.ownershipType ? 'error-input' : ''}
                >
                  <option value="">Ownership Type</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Non-Profit">Non-Profit / Charity</option>
                  <option value="Military">Military</option>
                </select>
                {errors.ownershipType && <span className="error-text">{errors.ownershipType}</span>}
              </div>
            </div>

            {/* --- Section 2: Contact Info --- */}
            <h4 className="form-section-title">Contact Information</h4>
            <div className="form-grid">
              
              <div className="input-group">
                <Email className="input-icon" />
                <input 
                  type="email" name="email" placeholder="Official Email"
                  value={formData.email} onChange={handleChange}
                  className={errors.email ? 'error-input' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="input-group">
                <Phone className="input-icon" />
                <input 
                  type="text" name="phone" placeholder="General Enquiry (10 Digits)"
                  value={formData.phone} onChange={handleChange}
                  className={errors.phone ? 'error-input' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="input-group">
                <Emergency className="input-icon" style={{color: '#d32f2f'}} />
                <input 
                  type="text" name="emergencyPhone" placeholder="Hotline (10 Digits)"
                  value={formData.emergencyPhone} onChange={handleChange}
                  className={errors.emergencyPhone ? 'error-input' : ''}
                />
                {errors.emergencyPhone && <span className="error-text">{errors.emergencyPhone}</span>}
              </div>

               <div className="input-group">
                <Language className="input-icon" />
                <input 
                  type="text" name="website" placeholder="Website URL (Optional)"
                  value={formData.website} onChange={handleChange}
                />
              </div>
            </div>

            {/* --- Section 3: Location & Facilities --- */}
            <h4 className="form-section-title">Location & Facilities</h4>
            <div className="form-grid">
              
              <div className="input-group full-width">
                <LocationOn className="input-icon" />
                <input 
                  type="text" name="address" placeholder="Complete Address"
                  value={formData.address} onChange={handleChange}
                  className={errors.address ? 'error-input' : ''}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="input-group">
                <input 
                  type="text" name="city" placeholder="City (Alphabets)"
                  style={{paddingLeft: '15px'}} 
                  value={formData.city} onChange={handleChange}
                  className={errors.city ? 'error-input' : ''}
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>

              <div className="input-group">
                <input 
                  type="text" name="state" placeholder="State (Alphabets)"
                  style={{paddingLeft: '15px'}}
                  value={formData.state} onChange={handleChange}
                  className={errors.state ? 'error-input' : ''}
                />
                {errors.state && <span className="error-text">{errors.state}</span>}
              </div>

              <div className="input-group">
                <input 
                  type="text" name="zipCode" placeholder="Zip Code (6 Digits)"
                  style={{paddingLeft: '15px'}}
                  value={formData.zipCode} onChange={handleChange}
                  className={errors.zipCode ? 'error-input' : ''}
                />
                {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
              </div>

               <div className="input-group">
                <MeetingRoom className="input-icon" />
                <input 
                  type="text" name="totalBeds" placeholder="Total Bed Capacity (Number)"
                  value={formData.totalBeds} onChange={handleChange}
                  className={errors.totalBeds ? 'error-input' : ''}
                />
                 {errors.totalBeds && <span className="error-text">{errors.totalBeds}</span>}
              </div>

              {/* Facilities Checkboxes */}
              <div className="input-group checkboxes-group" style={{gridColumn: 'span 2', display:'flex', gap:'20px', alignItems:'center'}}>
                  <label style={{display:'flex', alignItems:'center', cursor:'pointer'}}>
                      <input 
                          type="checkbox" 
                          name="hasBloodBank" 
                          checked={formData.hasBloodBank} 
                          onChange={handleChange}
                          style={{width:'auto', marginRight:'8px'}}
                      />
                      <MedicalServices style={{marginRight: '5px', fontSize:'20px', color:'#555'}}/> 
                      Blood Bank
                  </label>

                  <label style={{display:'flex', alignItems:'center', cursor:'pointer'}}>
                      <input 
                          type="checkbox" 
                          name="hasAmbulance" 
                          checked={formData.hasAmbulance} 
                          onChange={handleChange}
                          style={{width:'auto', marginRight:'8px'}}
                      />
                      <DirectionsCar style={{marginRight: '5px', fontSize:'20px', color:'#555'}}/> 
                      Ambulance Service
                  </label>
              </div>
            </div>

            {/* --- Section 4: Security --- */}
            <h4 className="form-section-title">Account Security</h4>
            <div className="form-grid">
              <div className="input-group">
                <Lock className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="Create Password"
                  value={formData.password} 
                  onChange={handleChange}
                  className={errors.password ? 'error-input' : ''}
                />
                <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="input-group">
                <Lock className="input-icon" />
                <input 
                  type="password" 
                  name="confirmPassword" 
                  placeholder="Confirm Password"
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error-input' : ''}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? "Registering..." : "Register Hospital"}
            </button>

            <p className="auth-footer">
              Already registered? <Link to="/hospital/login">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HospitalRegister;