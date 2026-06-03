import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import AdminSidebar from './AdminSidebar';
import { Search, Delete, Visibility, FilterList } from '@mui/icons-material';
import { CircularProgress, Tooltip, IconButton } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/ManageUsers.css'; // Reusing base styles

const AllRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // --- 1. FETCH ALL REQUESTS ---
  const fetchRequests = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.get("http://localhost:5001/Admin/requests", config);
      setRequests(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load requests");
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  // --- 2. DELETE REQUEST ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this request permanently?")) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await axios.delete(`http://localhost:5001/Admin/requests/${id}`, config);
      
      toast.success("Request deleted");
      setRequests(requests.filter(r => r._id !== id));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // --- 3. FILTER LOGIC ---
  const filteredRequests = requests.filter(r => {
    const matchesSearch = 
        r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Helper for Badges
  const getUrgencyColor = (u) => {
      switch(u) {
          case 'critical': return { bg: '#fee2e2', text: '#ef4444' };
          case 'moderate': return { bg: '#fff7ed', text: '#ea580c' };
          default: return { bg: '#f0f9ff', text: '#0284c7' };
      }
  };

  return (
    <Layout Sidebar={AdminSidebar}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="manage-container">
        
        <div className="manage-header">
          <div>
            <h1 className="manage-title">All Blood Requests</h1>
            <p style={{color:'#64748b'}}>Monitor active and historical requests across the platform.</p>
          </div>
          
          <div style={{display:'flex', gap:'15px'}}>
            {/* Search */}
            <div className="search-box">
                <Search style={{color: '#94a3b8'}} />
                <input 
                type="text" 
                placeholder="Search Patient or Hospital..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Filter */}
            <div className="search-box" style={{width:'180px'}}>
                <FilterList style={{color: '#94a3b8'}} />
                <select 
                    style={{border:'none', outline:'none', width:'100%', marginLeft:'10px', color:'#334155'}}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Fulfilled">Fulfilled</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
             <div style={{ padding: '50px', textAlign: 'center' }}><CircularProgress style={{color: '#7c3aed'}} /></div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Patient Info</th>
                  <th>Hospital</th>
                  <th>Requirements</th>
                  <th>Status</th>
                  <th>Requester</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => {
                    const urgencyStyle = getUrgencyColor(req.urgency);
                    return (
                        <tr key={req._id}>
                        <td>
                            <div style={{fontWeight:'600', color:'#1e293b'}}>{req.patientName}</div>
                            <div style={{fontSize:'0.8rem', color:'#64748b'}}>{req.gender}, {req.age} yrs</div>
                        </td>
                        <td>{req.hospitalName}</td>
                        <td>
                            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                <span style={{fontWeight:'700', color:'#ef4444'}}>{req.bloodGroup}</span>
                                <span style={{fontSize:'0.8rem', background:'#f1f5f9', padding:'2px 6px', borderRadius:'4px'}}>{req.units} Unit</span>
                                <span style={{
                                    fontSize:'0.7rem', fontWeight:'700', textTransform:'uppercase',
                                    background: urgencyStyle.bg, color: urgencyStyle.text, padding:'2px 6px', borderRadius:'4px'
                                }}>
                                    {req.urgency}
                                </span>
                            </div>
                        </td>
                        <td>
                            <span style={{
                                padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700',
                                background: req.status === 'Fulfilled' ? '#dcfce7' : req.status === 'Pending' ? '#ffedd5' : '#f1f5f9',
                                color: req.status === 'Fulfilled' ? '#166534' : req.status === 'Pending' ? '#c2410c' : '#64748b'
                            }}>
                                {req.status}
                            </span>
                        </td>
                        <td>
                            <div style={{fontSize:'0.9rem'}}>{req.requester?.fullName || "Unknown"}</div>
                            <div style={{fontSize:'0.8rem', color:'#64748b'}}>{req.requester?.mobile}</div>
                        </td>
                        <td>
                            <Tooltip title="Delete Request">
                                <IconButton size="small" onClick={() => handleDelete(req._id)}>
                                    <Delete style={{ color: '#ef4444' }} />
                                </IconButton>
                            </Tooltip>
                        </td>
                        </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="6" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}>No requests found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default AllRequests;