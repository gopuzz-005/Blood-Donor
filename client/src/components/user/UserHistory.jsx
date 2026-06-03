import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import UserSidebar from './UserSidebar';
import { 
  Search, FilterList, Visibility, Delete, Block, CheckCircle, Cancel, Person, LocalHospital, Event, Warning
} from '@mui/icons-material';
import { IconButton, Tooltip, CircularProgress, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/History.css';

const UserHistory = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [loading, setLoading] = useState(true);
  const [requestHistory, setRequestHistory] = useState([]);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal States
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Confirmation Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ id: null, status: '' });

  // --- 1. FETCH DATA ---
  const fetchRequests = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo || !userInfo.token) {
        setLoading(false);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get("http://localhost:5001/api/requests/my-requests", config);
      setRequestHistory(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load history.");
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  // --- 2. INITIATE STATUS UPDATE (Open Confirm Modal) ---
  const initiateStatusUpdate = (id, status) => {
    setConfirmAction({ id, status });
    setIsConfirmModalOpen(true);
  };

  // --- 3. EXECUTE STATUS UPDATE ---
  const executeStatusUpdate = async () => {
    setIsConfirmModalOpen(false); // Close modal
    const { id, status } = confirmAction;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { 
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` }
      };

      await axios.put(`http://localhost:5001/api/requests/${id}/status`, { status }, config);

      toast.success(`Request marked as ${status}`);
      setIsDetailModalOpen(false); // Close detail modal if open
      fetchRequests(); // Refresh list

    } catch (error) {
      toast.error("Update failed.");
    }
  };

  // --- 4. FILTER LOGIC ---
  const filteredData = requestHistory.filter(item => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = item.hospitalName.toLowerCase().includes(searchString) || item.bloodGroup.toLowerCase().includes(searchString);
    const matchesFilter = filterStatus === 'all' || item.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // --- OPEN DETAILS MODAL ---
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  return (
    <Layout Sidebar={UserSidebar}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="history-container">
        <div className="history-header">
          <h1 className="history-title">Activity History</h1>
          <p className="history-subtitle">Track your blood requests and donor responses.</p>
        </div>

        {/* Tabs & Filters */}
        <div className="history-tabs">
          <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Blood Requests</button>
        </div>

        <div className="filter-bar">
          <div style={{ position: 'relative', flex: 1 }}>
            <input type="text" placeholder="Search by Hospital or Blood Group..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Search style={{ position: 'absolute', right: 10, top: 10, color: '#94a3b8' }} />
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Fulfilled">Fulfilled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* DATA TABLE */}
        <div className="history-table-card">
          {loading ? <div style={{ padding: '50px', textAlign: 'center' }}><CircularProgress /></div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th><th>Blood Type</th><th>Hospital</th><th>Urgency</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr key={row._id}>
                      <td>{formatDate(row.createdAt)}</td>
                      <td><span style={{ fontWeight: 'bold', color: '#ef4444' }}>{row.bloodGroup}</span></td>
                      <td>{row.hospitalName}</td>
                      <td><span style={{ color: row.urgency === 'critical' ? '#ef4444' : '#64748b' }}>{row.urgency}</span></td>
                      <td><span className={`status-pill status-${row.status.toLowerCase()}`}>{row.status}</span></td>
                      <td>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewDetails(row)}>
                            <Visibility fontSize="small" style={{ color: '#3b82f6' }} />
                          </IconButton>
                        </Tooltip>
                        {(row.status === 'Scheduled' || row.status === 'Pending') && (
                          <Tooltip title="Mark as Completed">
                            <IconButton size="small" onClick={() => initiateStatusUpdate(row._id, 'Completed')}>
                              <CheckCircle fontSize="small" style={{ color: '#10b981' }} />
                            </IconButton>
                          </Tooltip>
                        )}
                        {row.status === 'Pending' && (
                          <Tooltip title="Cancel Request">
                            <IconButton size="small" onClick={() => initiateStatusUpdate(row._id, 'Cancelled')}>
                              <Block fontSize="small" style={{ color: '#94a3b8' }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- DETAILS MODAL --- */}
        {isDetailModalOpen && selectedRequest && (
          <div className="modal-overlay">
            <div className="modal-content" style={{maxWidth: '600px'}}>
              <div className="modal-header">
                <h2>Request Details</h2>
                <button className="close-btn" onClick={() => setIsDetailModalOpen(false)}><Cancel /></button>
              </div>
              
              <div className="request-details-grid">
                
                {/* Info Sections (Same as before) */}
                <div className="detail-section">
                    <h3><Person fontSize="small"/> Patient Information</h3>
                    <p><strong>Name:</strong> {selectedRequest.patientName}</p>
                    <p><strong>Age/Gender:</strong> {selectedRequest.age} / {selectedRequest.gender}</p>
                    <p><strong>Blood Needed:</strong> {selectedRequest.units} Unit(s) of <span style={{color:'#ef4444', fontWeight:'bold'}}>{selectedRequest.bloodGroup}</span></p>
                    <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                </div>

                <div className="detail-section">
                    <h3><LocalHospital fontSize="small"/> Hospital Details</h3>
                    <p><strong>Name:</strong> {selectedRequest.hospitalName}</p>
                    <p><strong>Doctor:</strong> {selectedRequest.doctorName}</p>
                    <p><strong>Contact:</strong> {selectedRequest.hospitalPhone}</p>
                    <p><strong>Address:</strong> {selectedRequest.hospitalAddress}</p>
                </div>

                {/* DONOR INFO (If Scheduled) */}
                {selectedRequest.status === 'Scheduled' && selectedRequest.fulfilledBy && (
                    <div className="detail-section full-width highlight-box">
                        <h3><Event fontSize="small"/> Donor Appointment</h3>
                        <p><strong>Donor Name:</strong> {selectedRequest.fulfilledBy.fullName}</p>
                        <p><strong>Contact:</strong> {selectedRequest.fulfilledBy.mobile} | {selectedRequest.fulfilledBy.email}</p>
                        <p><strong>Scheduled For:</strong> {selectedRequest.appointmentSlot?.date} at {selectedRequest.appointmentSlot?.time}</p>
                        <p><strong>Message:</strong> "{selectedRequest.donorMessage}"</p>
                        
                        <div className="modal-actions" style={{marginTop:'15px', display:'flex', gap:'10px'}}>
                            <Button 
                                variant="contained" 
                                color="success" 
                                startIcon={<CheckCircle />}
                                onClick={() => initiateStatusUpdate(selectedRequest._id, 'Fulfilled')}
                                fullWidth
                            >
                                Donation Successful
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="error" 
                                startIcon={<Cancel />}
                                onClick={() => initiateStatusUpdate(selectedRequest._id, 'Rejected')}
                                fullWidth
                            >
                                Donor Didn't Show
                            </Button>
                        </div>
                    </div>
                )}

                {(selectedRequest.status === 'Fulfilled' || selectedRequest.status === 'Completed') && (
                    <div className="detail-section full-width" style={{background:'#dcfce7', color:'#166534', textAlign:'center'}}>
                        <h3>Request Completed Successfully!</h3>
                    </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* --- CONFIRMATION MODAL --- */}
        {isConfirmModalOpen && (
            <div className="modal-overlay" style={{zIndex: 1100}}>
                <div className="modal-content" style={{maxWidth: '350px', textAlign:'center'}}>
                    <div style={{
                        width:'60px', height:'60px', borderRadius:'50%', margin:'0 auto 15px', display:'flex', alignItems:'center', justifyContent:'center',
                        background: (confirmAction.status === 'Fulfilled' || confirmAction.status === 'Completed') ? '#ecfdf5' : '#fef2f2',
                        color: (confirmAction.status === 'Fulfilled' || confirmAction.status === 'Completed') ? '#10b981' : '#ef4444'
                    }}>
                        {(confirmAction.status === 'Fulfilled' || confirmAction.status === 'Completed') ? <CheckCircle fontSize="large"/> : <Warning fontSize="large"/>}
                    </div>
                    
                    <h3 style={{margin:0}}>Confirm Action</h3>
                    <p style={{color:'#64748b', margin:'10px 0 20px'}}>
                        Are you sure you want to mark this request as <strong>{confirmAction.status}</strong>?
                    </p>

                    <div className="modal-actions" style={{display:'flex', gap:'10px'}}>
                        <button className="btn-modal-cancel" onClick={() => setIsConfirmModalOpen(false)} style={{flex:1, padding:'10px', borderRadius:'8px', border:'none', background:'#f1f5f9', cursor:'pointer'}}>
                            Cancel
                        </button>
                        <button 
                            className="btn-modal-confirm" 
                            onClick={executeStatusUpdate}
                            style={{
                                flex:1, padding:'10px', borderRadius:'8px', border:'none', color:'white', cursor:'pointer',
                                background: (confirmAction.status === 'Fulfilled' || confirmAction.status === 'Completed') ? '#10b981' : '#ef4444'
                            }}
                        >
                            Yes, Confirm
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </Layout>
  );
};

export default UserHistory;