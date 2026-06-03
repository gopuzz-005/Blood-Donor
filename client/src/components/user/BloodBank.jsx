import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import UserSidebar from './UserSidebar';
import { 
  Search, LocationOn, LocalHospital, Send, Close 
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/BloodBank.css';

const BloodBank = () => {
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState([]);
  
  // Filters
  const [searchCity, setSearchCity] = useState('');
  const [filterBlood, setFilterBlood] = useState('All');

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // --- FORM DATA FOR MODAL ---
  const [requestForm, setRequestForm] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    bloodGroup: '',
    units: 1,
    reason: '',
    urgency: 'moderate'
  });

  // --- 1. FETCH HOSPITALS ---
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get("http://localhost:5001/Hospitals/all", config);
        
        const mappedHospitals = data.map(h => {
          const bloodInventory = {};
          if (h.inventory) {
            h.inventory.forEach(inv => {
              const key = inv.group.replace('+', '_pos').replace('-', '_neg');
              bloodInventory[key] = inv.units;
            });
          }
          return {
            ...h,
            city: h.address || '',
            bloodInventory
          };
        });

        setHospitals(mappedHospitals);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hospitals", error);
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  // --- 2. HANDLE MODAL OPEN ---
  const openRequestModal = (hospital) => {
    setSelectedHospital(hospital);
    // Pre-set blood group if filtered, reset form
    setRequestForm(prev => ({
        ...prev,
        bloodGroup: filterBlood !== 'All' ? filterBlood : '',
        patientName: '',
        age: '',
        units: 1,
        reason: ''
    }));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHospital(null);
  };

  // --- VALIDATION & CHANGE HANDLER ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // 1. Validation: Patient Name (Alphabets Only)
    if (name === 'patientName') {
        const alphabetRegex = /^[a-zA-Z\s]*$/; 
        if (alphabetRegex.test(value)) {
            setRequestForm({ ...requestForm, [name]: value });
        }
    } 
    // 2. Validation: Age (Numbers Only, Max 3 Digits)
    else if (name === 'age') {
        const numberRegex = /^\d*$/;
        if (numberRegex.test(value) && value.length <= 3) {
            setRequestForm({ ...requestForm, [name]: value });
        }
    }
    // 3. Validation: Units (Numbers Only, Max 2 Digits)
    else if (name === 'units') {
        const numberRegex = /^\d*$/;
        // Don't allow 0 as first char unless it's just "0" (optional, but logical for units)
        if (numberRegex.test(value) && value.length <= 2) {
            setRequestForm({ ...requestForm, [name]: value });
        }
    }
    else {
        // Default behavior for other fields
        setRequestForm({ ...requestForm, [name]: value });
    }
  };

  // --- 3. SUBMIT REQUEST TO BACKEND ---
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = { 
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}` 
            } 
        };

        const payload = {
            ...requestForm,
            hospitalId: selectedHospital._id, // LINKING ID
            hospitalName: selectedHospital.hospitalName,
            hospitalAddress: selectedHospital.address + ", " + selectedHospital.city
        };

        await axios.post("http://localhost:5001/api/requests/hospital-request", payload, config);

        toast.success(`Request sent to ${selectedHospital.hospitalName}!`);
        setSubmitLoading(false);
        closeModal();
        
        // Reset form
        setRequestForm({
            patientName: '', age: '', gender: 'Male', bloodGroup: '', units: 1, reason: '', urgency: 'moderate'
        });

    } catch (error) {
        console.error("Request Error", error);
        
        const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Failed to send request. Please try again.";
            
        toast.error(errorMessage);
        setSubmitLoading(false);
    }
  };

  // --- 4. FILTER LOGIC ---
  const filteredHospitals = hospitals.filter(hospital => {
    const matchesCity = hospital.city.toLowerCase().includes(searchCity.toLowerCase()) || 
                        hospital.hospitalName.toLowerCase().includes(searchCity.toLowerCase());
    let matchesBlood = true;
    if (filterBlood !== 'All') {
        const key = filterBlood.replace('+', '_pos').replace('-', '_neg');
        matchesBlood = hospital.bloodInventory && hospital.bloodInventory[key] > 0;
    }
    return matchesCity && matchesBlood;
  });

  return (
    <Layout Sidebar={UserSidebar}>
      <ToastContainer position="top-right" autoClose={4000} />
      
      <div className="blood-bank-container">
        
        <div className="page-header">
          <h1 className="page-title">Blood Banks & Inventory</h1>
          <p className="page-subtitle">View real-time stock and request directly.</p>
        </div>

        {/* Search & Filter */}
        <div className="search-wrapper">
          <div style={{position: 'relative', flex: 1}}>
            <Search style={{position: 'absolute', left: 12, top: 10, color: '#94a3b8'}} />
            <input 
                type="text" 
                className="search-input" 
                placeholder="Search by Hospital or City..." 
                style={{paddingLeft: '40px'}}
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filterBlood} onChange={(e) => setFilterBlood(e.target.value)}>
            <option value="All">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        {/* Results Grid */}
        {loading ? (
            <div style={{textAlign: 'center', marginTop: '50px'}}><CircularProgress style={{color: '#d32f2f'}} /></div>
        ) : (
            <div className="hospitals-grid">
                {filteredHospitals.length > 0 ? (
                    filteredHospitals.map((hospital) => (
                        <div className="hospital-card" key={hospital._id}>
                            <div className="hospital-header">
                                <div>
                                    <h3>{hospital.hospitalName}</h3>
                                    <div className="location-text"><LocationOn fontSize="small" /> {hospital.city}</div>
                                </div>
                                <LocalHospital style={{color: '#ef4444', opacity: 0.8}} />
                            </div>
                            <div className="inventory-grid">
                                {hospital.bloodInventory && Object.entries(hospital.bloodInventory).map(([type, count]) => {
                                    const displayType = type.replace('_pos', '+').replace('_neg', '-');
                                    return (
                                        <div className={`blood-badge ${count > 0 ? 'available' : ''}`} key={type}>
                                            <span className="blood-type">{displayType}</span>
                                            <span className="blood-count">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="card-footer">
                                <button className="request-btn" onClick={() => openRequestModal(hospital)}>
                                    <Send fontSize="small" /> Request Blood Here
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">No hospitals found matching your criteria.</div>
                )}
            </div>
        )}

        {/* --- MODAL POPUP --- */}
        {isModalOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Request Blood from {selectedHospital?.hospitalName}</h2>
                        <button className="close-btn" onClick={closeModal}><Close /></button>
                    </div>
                    
                    <form onSubmit={handleRequestSubmit}>
                        <div className="modal-form-grid">
                            <div className="modal-group">
                                <label className="modal-label">Patient Name (Alphabets Only)</label>
                                <input 
                                    type="text" 
                                    name="patientName" 
                                    value={requestForm.patientName} 
                                    required 
                                    className="modal-input" 
                                    onChange={handleFormChange} 
                                />
                            </div>
                            <div className="modal-group">
                                <label className="modal-label">Blood Group</label>
                                <select name="bloodGroup" required className="modal-input" value={requestForm.bloodGroup} onChange={handleFormChange}>
                                    <option value="">Select</option>
                                    <option value="A+">A+</option><option value="A-">A-</option>
                                    <option value="B+">B+</option><option value="B-">B-</option>
                                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                    <option value="O+">O+</option><option value="O-">O-</option>
                                </select>
                            </div>
                            <div className="modal-group">
                                <label className="modal-label">Age (Max 3 Digits)</label>
                                <input 
                                    type="text" // Using text to strictly enforce digits via regex
                                    inputMode="numeric"
                                    name="age" 
                                    value={requestForm.age} 
                                    required 
                                    className="modal-input" 
                                    onChange={handleFormChange} 
                                />
                            </div>
                            <div className="modal-group">
                                <label className="modal-label">Gender</label>
                                <select name="gender" className="modal-input" value={requestForm.gender} onChange={handleFormChange}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="modal-group">
                                <label className="modal-label">Units Needed (Max 2 Digits)</label>
                                <input 
                                    type="text" 
                                    inputMode="numeric"
                                    name="units" 
                                    value={requestForm.units} 
                                    className="modal-input" 
                                    onChange={handleFormChange} 
                                />
                            </div>
                            <div className="modal-group">
                                <label className="modal-label">Urgency</label>
                                <select name="urgency" className="modal-input" value={requestForm.urgency} onChange={handleFormChange}>
                                    <option value="moderate">Moderate</option>
                                    <option value="critical">Critical / Emergency</option>
                                    <option value="low">Standard</option>
                                </select>
                            </div>
                            <div className="modal-full-width">
                                <label className="modal-label">Reason / Condition</label>
                                <input type="text" name="reason" value={requestForm.reason} placeholder="e.g. Surgery, Accident" className="modal-input" onChange={handleFormChange} />
                            </div>
                        </div>

                        <button type="submit" className="modal-submit-btn" disabled={submitLoading}>
                            {submitLoading ? "Sending..." : "Submit Request to Hospital"}
                        </button>
                    </form>
                </div>
            </div>
        )}

      </div>
    </Layout>
  );
};

export default BloodBank;