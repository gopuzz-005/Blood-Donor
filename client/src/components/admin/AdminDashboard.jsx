import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import AdminSidebar from './AdminSidebar';
import { 
  People, VolunteerActivism, LocalHospital, Assignment, TrendingUp 
} from '@mui/icons-material';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { CircularProgress } from '@mui/material';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, donors: 0, hospitals: 0, requests: 0 });
  const [graphData, setGraphData] = useState([]); 
  const [pieData, setPieData] = useState([]);

  // --- CUSTOM COLORS FOR BLOOD GROUPS ---
  const BLOOD_COLORS = {
    'A+': '#ef4444', // Red
    'A-': '#b91c1c', // Dark Red
    'B+': '#3b82f6', // Blue
    'B-': '#1e3a8a', // Dark Blue
    'AB+': '#8b5cf6', // Purple
    'AB-': '#5b21b6', // Dark Purple
    'O+': '#10b981', // Green
    'O-': '#047857'  // Dark Green
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("adminInfo"));
        if (!userInfo || !userInfo.token) {
            setLoading(false);
            return;
        }
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        const { data } = await axios.get("http://localhost:5001/Admin/stats", config);
        
        setStats(data.counts);
        setGraphData(data.monthlyRequests);
        setPieData(data.bloodDistribution); // Ensure backend sends names like 'A+', 'B-'
        setLoading(false);

      } catch (error) {
        console.error("Admin Dashboard Error:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
        <Layout Sidebar={AdminSidebar}>
            <div style={{textAlign:'center', marginTop:'100px'}}>
                <CircularProgress style={{color: '#7c3aed'}} />
            </div>
        </Layout>
    );
  }

  return (
    <Layout Sidebar={AdminSidebar}>
      <div className="admin-container">
        
        <div className="admin-header">
          <div>
            <h1 className="admin-title">System Overview</h1>
            <p style={{color:'#64748b'}}>Real-time monitoring of BloodLink ecosystem.</p>
          </div>
        </div>

        {/* 1. Stats Grid (Same as before) */}
        <div className="admin-stats-grid">
          {/* ... cards code ... */}
          <div className="admin-card">
            <div className="admin-icon-box bg-purple"><People /></div>
            <div className="admin-content"><h3>{stats.users}</h3><p>Users</p></div>
          </div>
          <div className="admin-card">
            <div className="admin-icon-box bg-rose"><VolunteerActivism /></div>
            <div className="admin-content"><h3>{stats.donors}</h3><p>Donors</p></div>
          </div>
          <div className="admin-card">
            <div className="admin-icon-box bg-teal"><LocalHospital /></div>
            <div className="admin-content"><h3>{stats.hospitals}</h3><p>Hospitals</p></div>
          </div>
          <div className="admin-card">
            <div className="admin-icon-box bg-orange"><Assignment /></div>
            <div className="admin-content"><h3>{stats.requests}</h3><p>Requests</p></div>
          </div>
        </div>

        {/* 2. Charts Row */}
        <div className="admin-charts-row">
          
          {/* Request Trends (Area Chart) */}
          <div className="chart-box">
            <h4><TrendingUp fontSize="small"/> Request Trends (2023)</h4>
            <div style={{ width: '100%', height: 300, minWidth: 0, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius:'8px', border:'none'}} />
                  <Area type="monotone" dataKey="requests" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Blood Supply Distribution (Pie Chart) */}
          <div className="chart-box">
            <h4>Fulfilled Requests by Blood Type</h4>
            <div style={{ width: '100%', height: 300, minWidth: 0, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                {pieData.length > 0 && pieData.some(d => d.value > 0) ? (
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={5} 
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        // Use the specific color based on name (e.g., 'A+')
                        <Cell 
                          key={`cell-${index}`} 
                          fill={BLOOD_COLORS[entry.name] || '#ccc'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" />
                  </PieChart>
                ) : (
                  <div style={{textAlign: 'center', marginTop: '100px', color: '#94a3b8'}}>
                     No Inventory Data
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default AdminDashboard;