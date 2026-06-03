import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import AdminSidebar from './AdminSidebar';
import { Search, Delete, VolunteerActivism } from '@mui/icons-material';
import { CircularProgress, Tooltip } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/ManageUsers.css'; // Reusing User styles for consistency

const ManageDonors = () => {
  const [loading, setLoading] = useState(true);
  const [donors, setDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1. FETCH DONORS ---
  const fetchDonors = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!userInfo || !userInfo.token || userInfo.role !== 'admin') {
          setLoading(false);
          return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.get("http://localhost:5001/Admin/donors", config);
      console.log(data);
      
      setDonors(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load donors");
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonors(); }, []);

  // --- 2. DELETE DONOR ---
 
  // --- 3. FILTER LOGIC ---
  const filteredDonors = donors.filter(d => 
    d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout Sidebar={AdminSidebar}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="manage-container">
        
        {/* Header */}
        <div className="manage-header">
          <div>
            <h1 className="manage-title">Manage Donors</h1>
            <p style={{color:'#64748b'}}>View donor history and manage profiles.</p>
          </div>
          
          <div className="search-box">
            <Search style={{color: '#94a3b8'}} />
            <input 
              type="text" 
              placeholder="Search by Name, Email or Blood Group..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          {loading ? (
             <div style={{ padding: '50px', textAlign: 'center' }}>
                <CircularProgress style={{color: '#7c3aed'}} />
             </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Donor Name</th>
                  <th>Blood Group</th>
                  <th>Contact</th>
                  <th>Total Donations</th>
                  <th>Last Donation</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.length > 0 ? (
                  filteredDonors.map((donor) => (
                    <tr key={donor._id}>
                      <td>
                        <div className="user-cell">
                          <div className="list-avatar-circle" style={{background: '#fce7f3', color: '#be123c'}}>
                            {donor.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span style={{fontWeight:'600'}}>{donor.fullName}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{
                            background: '#fee2e2', color: '#ef4444', 
                            padding: '4px 10px', borderRadius: '12px', fontWeight: '700', fontSize: '0.8rem'
                        }}>
                            {donor.bloodGroup}
                        </span>
                      </td>
                      <td>
                        <div style={{fontSize:'0.9rem'}}>{donor.email}</div>
                        <div style={{fontSize:'0.8rem', color:'#64748b'}}>{donor.mobile}</div>
                      </td>
                      <td style={{fontWeight: '600', paddingLeft: '40px'}}>
                        {donor.totalDonations}
                      </td>
                      <td>
                        {donor.lastDonationDate 
                            ? new Date(donor.lastDonationDate).toLocaleDateString() 
                            : <span style={{color:'#94a3b8'}}>Never</span>}
                      </td>
                     
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}>No donors found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default ManageDonors;