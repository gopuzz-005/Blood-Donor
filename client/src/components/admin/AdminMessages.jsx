import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import AdminSidebar from './AdminSidebar';
import { 
  Email, Delete, Person, AccessTime, MarkEmailRead, Warning 
} from '@mui/icons-material';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/AdminMessages.css';

const AdminMessages = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  // --- FETCH MESSAGES ---
  const fetchMessages = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.get("http://localhost:5001/Admin/messages", config);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load messages");
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  // --- OPEN DELETE MODAL ---
  const initiateDelete = (id) => {
    setSelectedMessageId(id);
    setShowModal(true);
  };

  // --- CONFIRM DELETE ---
  const confirmDelete = async () => {
    setShowModal(false); // Close Modal
    try {
      const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await axios.delete(`http://localhost:5001/Admin/messages/${selectedMessageId}`, config);
      
      toast.success("Message deleted");
      setMessages(messages.filter(m => m._id !== selectedMessageId));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout Sidebar={AdminSidebar}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="messages-container">
        
        <div className="messages-header">
          <div>
            <h1 className="messages-title">User Inquiries</h1>
            <p style={{color:'#64748b'}}>Feedback and support requests from the platform.</p>
          </div>
          <div className="msg-count-badge">
            <Email fontSize="small" /> {messages.length} Messages
          </div>
        </div>

        {loading ? (
            <div style={{textAlign:'center', marginTop:'50px'}}>
                <CircularProgress style={{color:'#7c3aed'}} />
            </div>
        ) : (
            <div className="messages-list">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <div className="message-card" key={msg._id}>
                            <div className="msg-left">
                                <div className="avatar-circle">
                                    {msg.name ? msg.name.charAt(0).toUpperCase() : "U"}
                                </div>
                            </div>
                            
                            <div className="msg-content">
                                <div className="msg-top-row">
                                    <h4>{msg.subject}</h4>
                                    <span className="msg-date">
                                        <AccessTime fontSize="inherit" style={{marginRight:4}}/>
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="msg-body">{msg.message}</p>
                                
                                <div className="msg-footer">
                                    <span className="user-meta">
                                        <Person fontSize="small"/> {msg.name} ({msg.role})
                                    </span>
                                    <span className="user-meta" style={{marginLeft:15}}>
                                        <Email fontSize="small"/> {msg.email}
                                    </span>
                                </div>
                            </div>

                            <div className="msg-actions">
                                <Tooltip title="Delete">
                                    <IconButton onClick={() => initiateDelete(msg._id)}>
                                        <Delete style={{color:'#ef4444'}} />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <MarkEmailRead style={{fontSize:50, opacity:0.3}} />
                        <p>No new messages.</p>
                    </div>
                )}
            </div>
        )}

        {/* --- DELETE CONFIRMATION MODAL --- */}
        {showModal && (
            <div className="msg-modal-overlay">
                <div className="msg-modal-content">
                    <div className="msg-modal-icon">
                        <Warning fontSize="inherit" />
                    </div>
                    <h3>Delete Message?</h3>
                    <p>This action cannot be undone. Are you sure you want to remove this inquiry?</p>
                    
                    <div className="msg-modal-actions">
                        <button className="msg-btn-cancel" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button className="msg-btn-delete" onClick={confirmDelete}>
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </Layout>
  );
};

export default AdminMessages;