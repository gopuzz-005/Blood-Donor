import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Person, Email, Phone, Home, LocationCity, 
  Map, PinDrop, Lock, Visibility, VisibilityOff,
  Cake, Male
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../../styles/UserRegisterLogin.css';
import Navbar from '../common/Navbar';

const UserRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    password: '',
    confirmPassword: ''
  });

  // Error State
  const [errors, setErrors] = useState({});

  // --- 1. HANDLE INPUT CHANGE WITH VALIDATION MASKS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field immediately
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    // A. Alphabets Only (Full Name, City, State)
    if (name === 'fullName' || name === 'city' || name === 'state') {
        const alphabetRegex = /^[a-zA-Z\s]*$/;
        if (alphabetRegex.test(value)) {
            setFormData({ ...formData, [name]: value });
        }
    }
    // B. Numbers Only & Length Limit (Mobile - 10 digits)
    else if (name === 'mobile') {
        const numberRegex = /^\d*$/;
        if (numberRegex.test(value) && value.length <= 10) {
            setFormData({ ...formData, [name]: value });
        }
    }
    // C. Numbers Only & Length Limit (Pincode - 6 digits)
    else if (name === 'pincode') {
        const numberRegex = /^\d*$/;
        if (numberRegex.test(value) && value.length <= 6) {
            setFormData({ ...formData, [name]: value });
        }
    }
    // D. Numbers Only & Length Limit (Age - max 3 digits)
    else if (name === 'age') {
        const numberRegex = /^\d*$/;
        if (numberRegex.test(value) && value.length <= 3) {
            setFormData({ ...formData, [name]: value });
        }
    }
    // E. Default behavior for other fields (Address, Email, Password, Gender)
    else {
        setFormData({ ...formData, [name]: value });
    }
  };

  // --- 2. FINAL VALIDATION BEFORE SUBMIT ---
  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    // Required Fields Check
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        tempErrors[key] = "This field is required";
        isValid = false;
      }
    });

    // Specific Logic
    if (formData.age && parseInt(formData.age) < 18) {
      tempErrors.age = "You must be 18+ to register.";
      isValid = false;
    }

    if (formData.mobile && formData.mobile.length !== 10) {
      tempErrors.mobile = "Mobile Number must be exactly 10 digits.";
      isValid = false;
    }

    if (formData.pincode && formData.pincode.length !== 6) {
      tempErrors.pincode = "Pincode must be exactly 6 digits.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      tempErrors.email = "Enter a valid email address.";
      isValid = false;
    }

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

  // --- API CONNECTION HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);
      
      try {
        const payload = {
          ...formData,
          phone: formData.mobile,
          role: 'user'
        };

        const response = await fetch("http://localhost:5001/User/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Registration Successful! Redirecting...", {
            position: "top-right",
            autoClose: 2000,
          });
          
          setTimeout(() => {
            navigate('/user/login');
          }, 2000);

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
            <h2>Create Account</h2>
            <p>Join the BloodLink community to save lives.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            
            {/* --- Personal Details --- */}
            <h4 className="form-section-title">Personal Details</h4>
            <div className="form-grid">
              <div className="input-group">
                <Person className="input-icon" />
                <input 
                  type="text" name="fullName" placeholder="Full Name (Alphabets Only)"
                  value={formData.fullName} onChange={handleChange}
                  className={errors.fullName ? 'error-input' : ''}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              <div className="input-group">
                <Cake className="input-icon" />
                <input 
                  type="text" name="age" placeholder="Age (18+)"
                  value={formData.age} onChange={handleChange}
                  className={errors.age ? 'error-input' : ''}
                />
                {errors.age && <span className="error-text">{errors.age}</span>}
              </div>

              <div className="input-group">
                <Male className="input-icon" />
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className={errors.gender ? 'error-input' : ''}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="error-text">{errors.gender}</span>}
              </div>
            </div>

            {/* --- Contact Details --- */}
            <h4 className="form-section-title">Contact Info</h4>
            <div className="form-grid">
              <div className="input-group">
                <Phone className="input-icon" />
                <input 
                  type="text" name="mobile" placeholder="Mobile Number (10 Digits)"
                  value={formData.mobile} onChange={handleChange}
                  className={errors.mobile ? 'error-input' : ''}
                />
                {errors.mobile && <span className="error-text">{errors.mobile}</span>}
              </div>

              <div className="input-group">
                <Email className="input-icon" />
                <input 
                  type="email" name="email" placeholder="Email Address"
                  value={formData.email} onChange={handleChange}
                  className={errors.email ? 'error-input' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            {/* --- Address Details --- */}
            <h4 className="form-section-title">Address Details</h4>
            <div className="form-grid full-width">
              <div className="input-group">
                <Home className="input-icon" />
                <input 
                  type="text" name="address" placeholder="Address Line (House No, Street)"
                  value={formData.address} onChange={handleChange}
                  className={errors.address ? 'error-input' : ''}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>
            </div>
            
            <div className="form-grid">
              <div className="input-group">
                <LocationCity className="input-icon" />
                <input 
                  type="text" name="city" placeholder="City"
                  value={formData.city} onChange={handleChange}
                  className={errors.city ? 'error-input' : ''}
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>

              <div className="input-group">
                <Map className="input-icon" />
                <input 
                  type="text" name="state" placeholder="State"
                  value={formData.state} onChange={handleChange}
                  className={errors.state ? 'error-input' : ''}
                />
                {errors.state && <span className="error-text">{errors.state}</span>}
              </div>

              <div className="input-group">
                <PinDrop className="input-icon" />
                <input 
                  type="text" name="pincode" placeholder="Pincode (6 Digits)"
                  value={formData.pincode} onChange={handleChange}
                  className={errors.pincode ? 'error-input' : ''}
                />
                {errors.pincode && <span className="error-text">{errors.pincode}</span>}
              </div>
            </div>

            {/* --- Security --- */}
            <h4 className="form-section-title">Security</h4>
            <div className="form-grid">
              <div className="input-group">
                <Lock className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="Password"
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
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="auth-footer">
              Already have an account? <Link to="/user/login">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;