import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import AdminSidebar from './AdminSidebar';
import { Search, Delete, Person } from '@mui/icons-material';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/ManageUsers.css';

const ManageUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1. FETCH USERS ---
  const fetchUsers = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!userInfo || !userInfo.token || userInfo.role !== 'admin') {
          setLoading(false);
          return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.get("http://localhost:5001/Admin/users", config);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load users");
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // --- 2. DELETE USER ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await axios.delete(`http://localhost:5001/api/admin/users/${id}`, config);
      
      toast.success("User removed successfully");
      setUsers(users.filter(user => user._id !== id)); // Remove from UI
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // --- 3. FILTER LOGIC ---
  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout Sidebar={AdminSidebar}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="manage-container">
        
        {/* Header */}
        <div className="manage-header">
          <div>
            <h1 className="manage-title">Manage Users</h1>
            <p style={{color:'#64748b'}}>View and manage registered system users.</p>
          </div>
          
          <div className="search-box">
            <Search style={{color: '#94a3b8'}} />
            <input 
              type="text" 
              placeholder="Search users..." 
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
                  <th>User</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-cell">
                          <div className="list-avatar-circle">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span style={{fontWeight:'600'}}>{user.fullName}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" style={{textAlign:'center', padding:'30px', color:'#94a3b8'}}>No users found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default ManageUsers;