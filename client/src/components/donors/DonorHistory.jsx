import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import DonorSidebar from './DonorSidebar';
import { 
  Event, 
  AccessTime, 
  LocalHospital, 
  Person 
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import '../../styles/History.css'; 

const DonorHistory = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token || userInfo.role !== 'donor') {
            setLoading(false);
            return;
        }

        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const { data } = await axios.get("http://localhost:5001/api/requests/donor-history", config);
        
        setHistory(data);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching history:", error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Layout Sidebar={DonorSidebar}>
      <div className="history-container">
        
        <div className="history-header">
          <h1 className="history-title">Donation History</h1>
          <p className="history-subtitle">Track your scheduled and completed donations.</p>
        </div>

        <div className="history-table-card">
          {loading ? (
             <div style={{ padding: '50px', textAlign: 'center' }}>
                <CircularProgress style={{ color: '#be123c' }} />
             </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date Scheduled</th>
                    <th>Patient Name</th>
                    <th>Hospital</th>
                    <th>Appointment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length > 0 ? (
                    history.map((row) => (
                      <tr key={row._id}>
                        <td style={{color: '#64748b'}}>
                            {new Date(row.updatedAt).toLocaleDateString()}
                        </td>
                        <td style={{fontWeight:'600', color:'#1e293b'}}>
                            <Person fontSize="inherit" style={{marginRight:5, verticalAlign:'middle'}}/>
                            {row.patientName}
                        </td>
                        <td>
                            <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                                <LocalHospital fontSize="inherit" style={{color:'#ef4444'}}/>
                                {row.hospitalName}
                            </div>
                        </td>
                        <td>
                            {row.appointmentSlot ? (
                                <span style={{fontSize:'0.9rem'}}>
                                    <Event fontSize="inherit"/> {row.appointmentSlot.date} <br/>
                                    <AccessTime fontSize="inherit"/> {row.appointmentSlot.time}
                                </span>
                            ) : "N/A"}
                        </td>
                        <td>
                          <span className={`badge-${row.status.toLowerCase()}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{textAlign:'center', padding:'40px', color:'#94a3b8'}}>
                        No donation history found. Start donating today!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default DonorHistory;