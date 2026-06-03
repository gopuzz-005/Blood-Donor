import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import UserSidebar from './UserSidebar';
import { 
  Bloodtype, 
  History, 
  HourglassEmpty, 
  Favorite 
} from '@mui/icons-material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { CircularProgress } from '@mui/material';
import '../../styles/Dashboard.css';

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  
  // --- Data States ---
  const [stats, setStats] = useState([]);
  const [activityData, setActivityData] = useState([]); // Bar Chart
  const [pieData, setPieData] = useState([]); // Pie Chart
  const [recentRequests, setRecentRequests] = useState([]); // Table

  // Chart Colors
  const PIE_COLORS = ['#3b82f6', '#f97316', '#ef4444', '#22c55e'];

  // --- 1. FETCH & PROCESS DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token) return;

        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        // Fetch Requests
        const { data } = await axios.get("http://localhost:5001/api/requests/my-requests", config);

        // --- A. PROCESS STATS ---
        const total = data.length;
        const pending = data.filter(r => r.status === 'Pending').length;
        const fulfilled = data.filter(r => r.status === 'Fulfilled').length;
        // Assuming 1 fulfilled request ~ 1 life impacted (simplified logic)
        
        setStats([
          { title: "Total Requests", value: total, icon: <Bloodtype />, color: "bg-red" },
          { title: "Pending", value: pending, icon: <HourglassEmpty />, color: "bg-orange" },
          { title: "Fulfilled", value: fulfilled, icon: <History />, color: "bg-blue" },
          { title: "Lives Impacted", value: fulfilled, icon: <Favorite />, color: "bg-green" },
        ]);

        // --- B. PROCESS BAR CHART (Requests per Month) ---
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();
        
        // Initialize an object for counts
        const monthCounts = {};
        
        data.forEach(req => {
          const d = new Date(req.createdAt);
          if (d.getFullYear() === currentYear) {
            const monthName = months[d.getMonth()];
            monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
          }
        });

        // Convert to array for Recharts
        const chartArray = Object.keys(monthCounts).map(key => ({
          month: key,
          requests: monthCounts[key]
        }));
        setActivityData(chartArray.length > 0 ? chartArray : [{ month: 'No Data', requests: 0 }]);

        // --- C. PROCESS PIE CHART (Status Distribution) ---
        const statusCounts = { Pending: 0, Fulfilled: 0, Rejected: 0, Cancelled: 0 };
        data.forEach(req => {
            if (statusCounts[req.status] !== undefined) {
                statusCounts[req.status]++;
            }
        });

        const pieArray = Object.keys(statusCounts)
            .filter(key => statusCounts[key] > 0) // Only show statuses with data
            .map(key => ({
                name: key,
                value: statusCounts[key]
            }));
        setPieData(pieArray);

        // --- D. RECENT HISTORY (Top 5) ---
        setRecentRequests(data.slice(0, 5));

        setLoading(false);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout Sidebar={UserSidebar}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress style={{ color: '#d32f2f' }} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout Sidebar={UserSidebar}>
      <div className="dashboard-container">
        
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Overview</h1>
            <p className="dashboard-subtitle">Welcome back, here is your activity summary.</p>
          </div>
          <div style={{textAlign:'right'}}>
             <span style={{fontSize:'0.9rem', color:'#64748b', fontWeight:'500'}}>
               {new Date().toDateString()}
             </span>
          </div>
        </div>

        {/* 1. Statistics Cards */}
        <div className="stats-grid">
          {stats.map((item, index) => (
            <div className="stat-card" key={index}>
              <div className={`stat-icon-wrapper ${item.color}`}>
                {item.icon}
              </div>
              <div className="stat-content">
                <h3>{item.value}</h3>
                <p>{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Graphs Section */}
        <div className="charts-section">
          
          {/* Bar Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h4>Blood Requests (This Year)</h4>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}} 
                    dy={10}
                  />
                  <YAxis 
                    allowDecimals={false}
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="requests" 
                    fill="#ef4444" 
                    radius={[4, 4, 0, 0]} 
                    barSize={30} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h4>Request Status</h4>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                {pieData.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                ) : (
                  <div style={{textAlign: 'center', marginTop: '100px', color: '#94a3b8'}}>No Data Available</div>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Recent Activity Table */}
        <div className="table-card">
          <div className="chart-header">
            <h4>Recent Requests</h4>
          </div>
          <div style={{overflowX: 'auto'}}>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Blood Type</th>
                  <th>Hospital</th>
                  <th>Date Requested</th>
                  <th>Urgency</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.length > 0 ? (
                  recentRequests.map((row) => (
                    <tr key={row._id}>
                      <td style={{fontWeight:'600', color:'#1e293b'}}>{row.bloodGroup}</td>
                      <td>{row.hospitalName}</td>
                      <td>{formatDate(row.createdAt)}</td>
                      <td>
                        <span style={{ 
                            textTransform: 'capitalize',
                            color: row.urgency === 'critical' ? '#ef4444' : '#64748b',
                            fontWeight: row.urgency === 'critical' ? 'bold' : 'normal'
                        }}>
                           {row.urgency}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${row.status.toLowerCase()}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', color: '#94a3b8'}}>No recent requests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default UserDashboard;