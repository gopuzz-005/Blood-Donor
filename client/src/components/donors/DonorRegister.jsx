import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Person, Email, Phone, Lock, Visibility, VisibilityOff,
  CalendarToday, Bloodtype, MonitorWeight, Male,
  MedicalServices, Healing
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../../styles/DonorRegister.css';
import Navbar from '../common/Navbar';

const DonorRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    weight: '',
    address: '',
    lastDonationDate: '',
    hasDisease: '', 
    hadSurgery: '', 
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    if (name === 'fullName') {
        const alphabetRegex = /^[a-zA-Z\s]*$/;
        if (alphabetRegex.test(value)) {
            setFormData({ ...formData, [name]: value });
        }
    }
    else if (name === 'mobile') {
        const numberRegex = /^\d*$/;
        if (numberRegex.test(value) && value.length <= 10) {
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

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    const requiredFields = ['fullName', 'email', 'mobile', 'dob', 'gender', 'bloodGroup', 'weight', 'address', 'password', 'confirmPassword', 'hasDisease', 'hadSurgery'];
    requiredFields.forEach((key) => {
      if (!formData[key]) {
        tempErrors[key] = "This field is required";
        isValid = false;
      }
    });

    if (formData.mobile && formData.mobile.length !== 10) {
      tempErrors.mobile = "Mobile number must be 10 digits.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      tempErrors.email = "Enter a valid email.";
      isValid = false;
    }

    if (formData.weight && parseInt(formData.weight) <= 50) {
      tempErrors.weight = "Weight must be greater than 50kg.";
      isValid = false;
    }

    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        tempErrors.dob = "You must be at least 18 years old to donate.";
        isValid = false;
      }
    }

    if (formData.hasDisease === 'yes') {
        tempErrors.hasDisease = "You cannot register if you have a chronic disease.";
        isValid = false;
    }

    if (formData.hadSurgery === 'yes') {
        tempErrors.hadSurgery = "You cannot donate if you had surgery in the last 6 months.";
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
      toast.error("Validation failed. Please check the form.");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);

      try {
        let age = 0;
        if (formData.dob) {
          const birthDate = new Date(formData.dob);
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
        }

        const payload = {
          ...formData,
          phone: formData.mobile,
          age: age
        };

        const response = await fetch("http://localhost:5001/Donor/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Donor Registration Successful!", {
            position: "top-right",
            autoClose: 2000, 
          });

          setTimeout(() => {
            navigate('/donor/login');
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
            <h2>Become a Donor</h2>
            <p>Your blood can be the lifeline for someone in need.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            
            <h4 className="form-section-title">Personal Details</h4>
            <div className="form-grid">
              
              <div className="input-group full-width">
                <Person className="input-icon" />
                <input 
                  type="text" name="fullName" placeholder="Full Name (Alphabets Only)"
                  value={formData.fullName} onChange={handleChange}
                  className={errors.fullName ? 'error-input' : ''}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
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
                <Person className="input-icon" />
                <input 
                  type="text" name="address" placeholder="Address / Location"
                  value={formData.address} onChange={handleChange}
                  className={errors.address ? 'error-input' : ''}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="input-group">
                <CalendarToday className="input-icon" />
                <input 
                  type="text" 
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                  name="dob" placeholder="Date of Birth (18+)"
                  value={formData.dob} onChange={handleChange}
                  className={errors.dob ? 'error-input' : ''}
                />
                {errors.dob && <span className="error-text">{errors.dob}</span>}
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

            <h4 className="form-section-title">Donor Eligibility</h4>
            <div className="form-grid">
              
              <div className="input-group">
                <Bloodtype className="input-icon" />
                <select 
                  name="bloodGroup" 
                  value={formData.bloodGroup} 
                  onChange={handleChange}
                  className={errors.bloodGroup ? 'error-input' : ''}
                >
                  <option value="">Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors.bloodGroup && <span className="error-text">{errors.bloodGroup}</span>}
              </div>

              <div className="input-group">
                <MonitorWeight className="input-icon" />
                <input 
                  type="text" name="weight" placeholder="Weight (kg) > 50"
                  value={formData.weight} onChange={handleChange}
                  className={errors.weight ? 'error-input' : ''}
                />
                {errors.weight && <span className="error-text">{errors.weight}</span>}
              </div>

              <div className="input-group full-width">
                <CalendarToday className="input-icon" />
                <input 
                  type="text" 
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                  name="lastDonationDate" placeholder="Last Donation Date (Optional)"
                  value={formData.lastDonationDate} onChange={handleChange}
                />
              </div>

              <div className="input-group full-width">
                <MedicalServices className="input-icon" />
                <select 
                  name="hasDisease" 
                  value={formData.hasDisease} 
                  onChange={handleChange}
                  className={errors.hasDisease ? 'error-input' : ''}
                >
                  <option value="">Do you have any Chronic Disease?</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.hasDisease && <span className="error-text">{errors.hasDisease}</span>}
              </div>

              <div className="input-group full-width">
                <Healing className="input-icon" />
                <select 
                  name="hadSurgery" 
                  value={formData.hadSurgery} 
                  onChange={handleChange}
                  className={errors.hadSurgery ? 'error-input' : ''}
                >
                  <option value="">Any Surgery in last 6 months?</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.hadSurgery && <span className="error-text">{errors.hadSurgery}</span>}
              </div>
            </div>

            <h4 className="form-section-title">Account Security</h4>
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
              {loading ? "Registering..." : "Register as Donor"}
            </button>

            <p className="auth-footer">
              Already have an account? <Link to="/donor/login">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonorRegister;