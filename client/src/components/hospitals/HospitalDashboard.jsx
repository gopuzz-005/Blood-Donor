import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import HospitalSidebar from './HospitalSidebar';
import { 
  Bloodtype, 
  LocalHospital, 
  Group, 
  CheckCircle 
} from '@mui/icons-material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { CircularProgress } from '@mui/material';
import '../../styles/HospitalDashboard.css';

const HospitalDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStock: 0,
    totalRequests: 0,
    pendingRequests: 0,
    fulfilledRequests: 0
  });
  const [inventoryData, setInventoryData] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token || userInfo.role !== 'hospital') {
            setLoading(false);
            return;
        }

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        const profileRes = await axios.get("http://localhost:5001/Hospitals/profile", config);
        
        const inv = {};
        if (profileRes.data.inventory) {
          profileRes.data.inventory.forEach(item => {
            const key = item.group.replace('+', '_pos').replace('-', '_neg');
            inv[key] = item.units;
          });
        }

        const chartData = [
            { name: 'A+', count: inv.A_pos || 0 }, { name: 'A-', count: inv.A_neg || 0 },
            { name: 'B+', count: inv.B_pos || 0 }, { name: 'B-', count: inv.B_neg || 0 },
            { name: 'AB+', count: inv.AB_pos || 0 }, { name: 'AB-', count: inv.AB_neg || 0 },
            { name: 'O+', count: inv.O_pos || 0 }, { name: 'O-', count: inv.O_neg || 0 },
        ];
        setInventoryData(chartData);

        const totalStock = Object.values(inv).reduce((a, b) => a + b, 0);

        const requestRes = await axios.get("http://localhost:5001/Hospitals/my-requests", config);
        const requestData = requestRes.data;

        const pending = requestData.filter(r => r.status === 'Pending').length;
        const fulfilled = requestData.filter(r => r.status === 'Fulfilled').length;

        setStats({
            totalStock: totalStock,
            totalRequests: requestData.length,
            pendingRequests: pending,
            fulfilledRequests: fulfilled
        });

        setRecentRequests(requestData.slice(0, 5));

        setLoading(false);

      } catch (error) {
        console.error("Dashboard Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
        <Layout Sidebar={HospitalSidebar}>
            <div style={{textAlign:'center', marginTop:'100px'}}>
                <CircularProgress style={{color: '#0284c7'}} />
            </div>
        </Layout>
    );
  }

  return (
    <Layout Sidebar={HospitalSidebar}>
      <div className="dashboard-container">
        
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Hospital Overview</h1>
            <p style={{color:'#64748b'}}>Manage blood stock and patient requests efficiently.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper bg-blue"><Bloodtype /></div>
            <div className="stat-content">
              <h3>{stats.totalStock}</h3>
              <p>Total Blood Units</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper bg-indigo"><Group /></div>
            <div className="stat-content">
              <h3>{stats.totalRequests}</h3>
              <p>Total Requests</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper bg-cyan"><LocalHospital /></div>
            <div className="stat-content">
              <h3>{stats.pendingRequests}</h3>
              <p>Pending Actions</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper bg-emerald"><CheckCircle /></div>
            <div className="stat-content">
              <h3>{stats.fulfilledRequests}</h3>
              <p>Fulfilled</p>
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          
          <div className="chart-card">
            <div className="chart-header">
              <h4>Current Blood Stock Levels</h4>
            </div>
            <div style={{ width: '100%', height: 300, minWidth: 0, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{borderRadius:'8px', border:'none'}} />
                  <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="table-card">
            <div className="chart-header">
              <h4>Recent Patient Requests</h4>
            </div>
            <div style={{overflowX: 'auto'}}>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Type</th>
                            <th>Urgency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentRequests.length > 0 ? (
                            recentRequests.map(row => (
                                <tr key={row._id}>
                                    <td style={{fontWeight:'600'}}>{row.patientName}</td>
                                    <td style={{color:'#0284c7', fontWeight:'bold'}}>{row.bloodGroup}</td>
                                    <td>
                                        <span className={`badge-${row.urgency ? row.urgency.toLowerCase() : 'low'}`}>
                                            {row.urgency}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3" style={{textAlign:'center', color:'#94a3b8'}}>No requests yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default HospitalDashboard;