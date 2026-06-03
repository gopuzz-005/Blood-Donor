import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import DonorSidebar from './DonorSidebar';
import { 
  CheckCircle, LocationOn, AccessTime, EventAvailable, Bloodtype,
  LocalHospital, Close, PregnantWoman, History
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/DonateNow.css';

const DonateNow = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState([]);
  
  // --- Modal States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [donorInfo, setDonorInfo] = useState(null);

  const [formData, setFormData] = useState({
    date: '', time: '', comments: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token || userInfo.role !== 'donor') {
            toast.error("Please login as donor.");
            setLoading(false);
            return;
        }
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        const reqData = await axios.get("http://localhost:5001/api/requests/matching", config);
        setRequests(reqData.data.requests);

        const profileData = await axios.get("http://localhost:5001/Donor/profile", config);
        setDonorInfo(profileData.data);

        setLoading(false);
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to load data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInitiateDonation = (req) => {
    setSelectedRequest(req);
    
    if (donorInfo.gender === 'Female') {
        setModalStep(1); // Ask Pregnancy
    } else {
        checkDonationEligibility();
    }
    setIsModalOpen(true);
  };

  const checkDonationEligibility = () => {
    if (!donorInfo.lastDonationDate) {
        setModalStep(2); 
        return;
    }

    const lastDate = new Date(donorInfo.lastDonationDate);
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const requiredGap = donorInfo.gender === 'Female' ? 120 : 90;

    if (diffDays < requiredGap) {
        setRejectReason(`You last donated ${diffDays} days ago. Please wait ${requiredGap - diffDays} more days.`);
        setModalStep(3); 
    } else {
        setModalStep(2); 
    }
  };

  const handlePregnancyAnswer = (isPregnant) => {
    if (isPregnant) {
        setRejectReason("Pregnancy defers donation for safety reasons.");
        setModalStep(3); 
    } else {
        checkDonationEligibility(); 
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (selectedDate < today) {
        toast.error("You cannot select a past date.");
        return;
    }

    if (selectedDate.getTime() === today.getTime()) {
        const currentTime = new Date();
        const [hours, minutes] = formData.time.split(':');
        const selectedTime = new Date();
        selectedTime.setHours(hours, minutes, 0, 0);

        const oneHourLater = new Date(currentTime.getTime() + 60 * 60 * 1000);

        if (selectedTime < oneHourLater) {
            toast.error("Please select a time at least 1 hour from now.");
            return;
        }
    }

    setSubmitting(true);

    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = { 
            headers: { 
                "Content-Type": "application/json", 
                Authorization: `Bearer ${userInfo.token}` 
            } 
        };

        const payload = {
            date: formData.date,
            time: formData.time,
            comments: formData.comments
        };

        await axios.put(
            `http://localhost:5001/api/requests/schedule/${selectedRequest._id}`, 
            payload, 
            config
        );

        toast.success(`Donation Scheduled! Recipient notified.`);
        setRequests(prev => prev.filter(req => req._id !== selectedRequest._id));
        setIsModalOpen(false); 

    } catch (error) {
        toast.error("Failed to schedule donation.");
    } finally {
        setSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ date: '', time: '', comments: '' });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <Layout Sidebar={DonorSidebar}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="donate-container">
        <div className="page-header">
          <h1 className="page-title">Donate Blood</h1>
          <p className="page-subtitle">Select a request to start the eligibility check.</p>
        </div>

        <div className="donate-grid" style={{gridTemplateColumns: '1fr'}}> 
          <div className="campaigns-section">
                <h3 style={{marginBottom: '20px', color: '#334155'}}>Matching Requests ({requests.length})</h3>
                
                {loading ? (
                    <div style={{textAlign: 'center', padding: '40px'}}><CircularProgress style={{color: '#be123c'}} /></div>
                ) : requests.length > 0 ? (
                    <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
                        {requests.map((req) => (
                            <div className="campaign-card" key={req._id}>
                                <div className="camp-info">
                                    <h4 style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        {req.patientName} 
                                        <span className={`status-badge ${req.urgency === 'critical' ? 'critical' : 'moderate'}`}>
                                            {req.urgency.toUpperCase()}
                                        </span>
                                    </h4>
                                    <div className="camp-location"><LocalHospital fontSize="small" style={{color:'#be123c'}} /> {req.hospitalName}</div>
                                    <div className="camp-location"><LocationOn fontSize="small" style={{color:'#64748b'}} /> {req.hospitalAddress}</div>
                                    <span className="camp-time">Needs {req.units} Unit(s) of {req.bloodGroup}</span>
                                </div>
                                <button className="book-btn" onClick={() => handleInitiateDonation(req)}>Donate</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-box">No matching requests found.</div>
                )}
            </div>
        </div>

        {isModalOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    
                    <div className="modal-header">
                        <h2>Donation Safety Check</h2>
                        <button className="close-btn" onClick={closeModal}><Close /></button>
                    </div>

                    {modalStep === 1 && (
                        <div className="check-step">
                            <div style={{textAlign:'center', marginBottom:'20px'}}>
                                <PregnantWoman style={{fontSize: 60, color: '#ec4899'}} />
                                <h3>Are you currently pregnant?</h3>
                                <p>Pregnancy affects your eligibility to donate blood.</p>
                            </div>
                            <div className="modal-actions">
                                <button className="btn-no" onClick={() => handlePregnancyAnswer(false)}>No, I am not</button>
                                <button className="btn-yes" onClick={() => handlePregnancyAnswer(true)}>Yes, I am</button>
                            </div>
                        </div>
                    )}

                    {modalStep === 2 && (
                        <div className="booking-step">
                            <div className="success-banner">
                                <CheckCircle style={{fontSize:20}}/> You are eligible to donate!
                            </div>
                            <form onSubmit={handleBookingSubmit}>
                                <div className="donate-form-group">
                                    <label>Appointment Date (Future Only)</label>
                                    <input 
                                        type="date" 
                                        name="date" 
                                        className="donate-input" 
                                        min={getTodayDate()} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="donate-form-group">
                                    <label>Time</label>
                                    <input 
                                        type="time" 
                                        name="time" 
                                        className="donate-input" 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="donate-form-group">
                                    <label>Message (Optional)</label>
                                    <textarea name="comments" className="donate-input" rows="2" onChange={handleChange}></textarea>
                                </div>
                                <button type="submit" className="confirm-btn" disabled={submitting}>
                                    {submitting ? "Confirming..." : <><EventAvailable style={{marginRight:8}}/> Confirm Appointment</>}
                                </button>
                            </form>
                        </div>
                    )}

                    {modalStep === 3 && (
                        <div className="reject-step" style={{textAlign:'center'}}>
                            <div style={{color: '#ef4444', marginBottom:'15px'}}>
                                <History style={{fontSize: 60}} />
                            </div>
                            <h3>Cannot Donate Yet</h3>
                            <p style={{color: '#64748b', margin: '15px 0'}}>{rejectReason}</p>
                            <button className="btn-close" onClick={closeModal}>Close</button>
                        </div>
                    )}

                </div>
            </div>
        )}

      </div>
    </Layout>
  );
};

export default DonateNow;