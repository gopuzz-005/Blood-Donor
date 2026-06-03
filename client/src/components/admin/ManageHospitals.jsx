import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import AdminSidebar from './AdminSidebar';
import { 
  Search, Delete, LocalHospital, CheckCircle, Cancel, MedicalServices, LocalShipping 
} from '@mui/icons-material';
import { CircularProgress, Tooltip, IconButton } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/ManageUsers.css'; // Reusing base table styles

const ManageHospitals = () => {
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1. FETCH HOSPITALS ---
  const fetchHospitals = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!userInfo || !userInfo.token || userInfo.role !== 'admin') {
          setLoading(false);
          return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.get("http://localhost:5001/Admin/hospitals", config);
      setHospitals(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load hospitals");
      setLoading(false);
    }
  };

  useEffect(() => { fetchHospitals(); }, []);

  // --- 2. UPDATE STATUS ---
  const handleStatusUpdate = async (id, newStatus) => {
    try {
        const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
        const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` } };

        await axios.put(`http://localhost:5001/Admin/hospitals/${id}/status`, { status: newStatus }, config);
        
        toast.success(`Hospital ${newStatus}`);
        fetchHospitals(); // Refresh List
    } catch (error) {
        toast.error("Update failed");
    }
  };

  // --- 3. DELETE HOSPITAL ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await axios.delete(`http://localhost:5001/Admin/hospitals/${id}`, config);
      
      toast.success("Hospital deleted");
      setHospitals(hospitals.filter(h => h._id !== id));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // --- 4. FILTER ---
  const filteredHospitals = hospitals.filter(h => 
    h.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout Sidebar={AdminSidebar}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="manage-container">
        
        <div className="manage-header">
          <div>
            <h1 className="manage-title">Manage Hospitals</h1>
            <p style={{color:'#64748b'}}>Approve registrations and monitor partners.</p>
          </div>
          
          <div className="search-box">
            <Search style={{color: '#94a3b8'}} />
            <input 
              type="text" 
              placeholder="Search by Name or City..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
             <div style={{ padding: '50px', textAlign: 'center' }}><CircularProgress style={{color: '#7c3aed'}} /></div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Hospital Name</th>
                  <th>Location</th>
                  <th>Facilities</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHospitals.length > 0 ? (
                  filteredHospitals.map((hospital) => (
                    <tr key={hospital._id}>
                      <td>
                        <div className="user-cell">
                          <div className="list-avatar-circle" style={{background: '#e0f2fe', color: '#0ea5e9'}}>
                            {hospital.hospitalName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{fontWeight:'600'}}>{hospital.hospitalName}</div>
                            <div style={{fontSize:'0.8rem', color:'#64748b'}}>{hospital.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td>{hospital.address}</td>
                      <td>
                        <div style={{display:'flex', gap:'5px'}}>
                            {hospital.hasBloodBank && (
                                <Tooltip title="Blood Bank"><MedicalServices fontSize="small" style={{color:'#ef4444'}}/></Tooltip>
                            )}
                            {hospital.hasAmbulance && (
                                <Tooltip title="Ambulance"><LocalShipping fontSize="small" style={{color:'#0ea5e9'}}/></Tooltip>
                            )}
                            {!hospital.hasBloodBank && !hospital.hasAmbulance && <span style={{color:'#94a3b8', fontSize:'0.8rem'}}>None</span>}
                        </div>
                      </td>
                      <td>
                        <span style={{
                            padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'capitalize',
                            background: hospital.status === 'Approved' ? '#dcfce7' : hospital.status === 'Pending' ? '#ffedd5' : '#fee2e2',
                            color: hospital.status === 'Approved' ? '#166534' : hospital.status === 'Pending' ? '#c2410c' : '#991b1b'
                        }}>
                            {hospital.status}
                        </span>
                      </td>
                      <td>
                        <div style={{display:'flex', gap:'5px'}}>
                            {/* APPROVE BUTTON */}
                            {hospital.status !== 'Approved' && (
                                <Tooltip title="Approve">
                                    <IconButton size="small" onClick={() => handleStatusUpdate(hospital._id, 'Approved')}>
                                        <CheckCircle style={{ color: '#22c55e' }} />
                                    </IconButton>
                                </Tooltip>
                            )}
                            
                            {/* REJECT BUTTON */}
                            {hospital.status !== 'Rejected' && (
                                <Tooltip title="Reject">
                                    <IconButton size="small" onClick={() => handleStatusUpdate(hospital._id, 'Rejected')}>
                                        <Cancel style={{ color: '#f59e0b' }} />
                                    </IconButton>
                                </Tooltip>
                            )}

                            {/* DELETE BUTTON */}
                            <Tooltip title="Delete">
                                <IconButton size="small" onClick={() => handleDelete(hospital._id)}>
                                    <Delete style={{ color: '#ef4444' }} />
                                </IconButton>
                            </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}>No hospitals found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default ManageHospitals;