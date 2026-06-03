import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import HospitalSidebar from './HospitalSidebar';
import { 
  AccessTime, Person, Inbox, CheckCircle, Cancel
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/HospitalRequests.css';

const HospitalRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  // --- MODAL STATE ---
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState({
    id: null,
    status: '', 
    bloodGroup: '',
    units: 1 // NEW: Track units needed
  });
  const [deductInventory, setDeductInventory] = useState(true);

  // --- 1. FETCH REQUESTS ---
  const fetchRequests = async () => {
    setLoading(true);
    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token || userInfo.role !== 'hospital') {
            setLoading(false);
            return;
        }
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get("http://localhost:5001/Hospitals/my-requests", config);
        setRequests(data);
        setLoading(false);
    } catch (error) {
        toast.error("Failed to load requests");
        setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  // --- 2. OPEN CONFIRMATION MODAL ---
  // Updated to accept 'units'
  const initiateAction = (id, status, bloodGroup, units) => {
    setSelectedAction({ id, status, bloodGroup, units });
    setDeductInventory(true);
    setModalOpen(true);
  };

  // --- 3. PROCESS REQUEST (API CALL) ---
  const handleConfirmAction = async () => {
    setModalOpen(false);
    const { id, status, bloodGroup, units } = selectedAction;

    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` } };

        // A. Update Request Status
        await axios.put(`http://localhost:5001/api/requests/${id}/status`, { status }, config);

        // B. Deduct Inventory (Dynamic Units)
        if (status === 'Fulfilled' && deductInventory) {
            const key = bloodGroup.replace('+', '_pos').replace('-', '_neg');
            
            await axios.put("http://localhost:5001/Hospitals/inventory", {
                bloodGroup: key,
                quantity: units, // DEDUCT THE REQUESTED AMOUNT
                action: "remove"
            }, config);
            
            toast.info(`${units} Unit(s) deducted from Inventory`);
        }

        toast.success(`Request marked as ${status}`);
        fetchRequests();

    } catch (error) {
        console.error("Action Error", error);
        toast.error(error.response?.data?.message || "Action failed");
    }
  };

  // Filter based on Tab
  const filteredRequests = requests.filter(req => 
    activeTab === 'pending' 
        ? req.status === 'Pending' 
        : ['Fulfilled', 'Rejected', 'Cancelled'].includes(req.status)
  );

  return (
    <Layout Sidebar={HospitalSidebar}>
      <ToastContainer position="top-right" autoClose={2500} />
      
      <div className="requests-container">
        
        <div className="requests-header">
          <h1 className="inventory-title">Active Requests</h1>
          <p style={{color:'#64748b'}}>Patient requests directed to your hospital.</p>
        </div>

        {/* Tabs */}
        <div className="tabs-wrapper">
            <button className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending Action</button>
            <button className={`tab-button ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>History</button>
        </div>

        {/* List */}
        {loading ? (
            <div style={{textAlign:'center', marginTop:'50px'}}><CircularProgress style={{color:'#0284c7'}} /></div>
        ) : filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
                <div className="request-card" key={req._id}>
                    <div className="req-info">
                        <div className="blood-group-box">{req.bloodGroup}</div>
                        <div className="req-details">
                            <h4 style={{display:'flex', alignItems:'center'}}>
                                {req.patientName}
                                <span className={`urgency-tag urgency-${req.urgency}`}>{req.urgency}</span>
                            </h4>
                            <div className="req-meta">
                                <span className="meta-item"><Person fontSize="small"/> {req.gender}, {req.age} yrs</span>
                                <span className="meta-item"><AccessTime fontSize="small"/> {new Date(req.createdAt).toLocaleDateString()}</span>
                                <span className="meta-item">Units: <strong>{req.units}</strong></span>
                            </div>
                            {req.reason && <p style={{margin:'5px 0 0', fontSize:'0.85rem', color:'#64748b'}}>Note: {req.reason}</p>}
                        </div>
                    </div>

                    {/* Actions */}
                    {activeTab === 'pending' ? (
                        <div className="req-actions">
                            <button className="btn-reject" onClick={() => initiateAction(req._id, 'Rejected', req.bloodGroup, req.units)}>
                                Reject
                            </button>
                            <button className="btn-fulfill" onClick={() => initiateAction(req._id, 'Fulfilled', req.bloodGroup, req.units)}>
                                Fulfill Request
                            </button>
                        </div>
                    ) : (
                        <span className={`urgency-tag`} style={{background:'#f1f5f9', color:'#64748b'}}>{req.status}</span>
                    )}
                </div>
            ))
        ) : (
            <div className="empty-state"><Inbox style={{fontSize:50, opacity:0.3}} /><p>No requests found.</p></div>
        )}

        {/* --- CONFIRMATION MODAL --- */}
        {modalOpen && (
            <div className="req-modal-overlay">
                <div className="req-modal-content">
                    <div className="req-modal-icon" style={{
                        background: selectedAction.status === 'Fulfilled' ? '#ecfdf5' : '#fef2f2',
                        color: selectedAction.status === 'Fulfilled' ? '#10b981' : '#ef4444'
                    }}>
                        {selectedAction.status === 'Fulfilled' ? <CheckCircle fontSize="inherit"/> : <Cancel fontSize="inherit"/>}
                    </div>

                    <h3>{selectedAction.status === 'Fulfilled' ? "Confirm Fulfillment" : "Reject Request"}</h3>
                    
                    <p>
                        Mark request for <strong>{selectedAction.units} unit(s)</strong> of 
                        <strong> {selectedAction.bloodGroup}</strong> as 
                        <strong> {selectedAction.status}</strong>?
                    </p>

                    {selectedAction.status === 'Fulfilled' && (
                        <div className="inventory-check-box">
                            <input 
                                type="checkbox" id="deductStock" 
                                checked={deductInventory} onChange={(e) => setDeductInventory(e.target.checked)}
                            />
                            <label htmlFor="deductStock">
                                Automatically deduct <strong>{selectedAction.units} units</strong> from inventory?
                            </label>
                        </div>
                    )}

                    <div className="req-modal-actions">
                        <button className="btn-modal-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button 
                            className="btn-modal-confirm" 
                            onClick={handleConfirmAction}
                            style={{ background: selectedAction.status === 'Fulfilled' ? '#10b981' : '#ef4444' }}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </Layout>
  );
};

export default HospitalRequests;