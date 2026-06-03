import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import DonorSidebar from './DonorSidebar';
import { 
  VolunteerActivism, 
  Event, 
  Favorite, 
  WaterDrop,
  MonitorHeart
} from '@mui/icons-material';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { CircularProgress } from '@mui/material';
import '../../styles/DonorDashboard.css';

const DonorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [donorProfile, setDonorProfile] = useState({});
  const [history, setHistory] = useState([]);
  
  // Stats State
  const [stats, setStats] = useState({
    totalDonations: 0,
    livesSaved: 0,
    lastDonation: 'Never',
    nextEligible: 'Available Now'
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token || userInfo.role !== 'donor') {
            setLoading(false);
            return;
        }

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        const profileRes = await axios.get("http://localhost:5001/Donor/profile", config);
        setDonorProfile(profileRes.data);

        const historyRes = await axios.get("http://localhost:5001/api/requests/donor-history", config);
        const historyData = historyRes.data;
        setHistory(historyData);

        const total = historyData.filter(h => h.status === 'Fulfilled').length;
        
        let lastDate = 'Never';
        let nextDate = 'Available Now';

        if (profileRes.data.lastDonationDate) {
            const last = new Date(profileRes.data.lastDonationDate);
            lastDate = last.toLocaleDateString();

            const gapMonths = profileRes.data.gender === 'Female' ? 4 : 3;
            const next = new Date(last);
            next.setMonth(next.getMonth() + gapMonths);
            
            if (next > new Date()) {
                nextDate = next.toLocaleDateString();
            }
        }

        setStats({
            totalDonations: total,
            livesSaved: total * 3, 
            lastDonation: lastDate,
            nextEligible: nextDate
        });

        const monthCounts = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        historyData.forEach(item => {
            if (item.status === 'Fulfilled') {
                const d = new Date(item.updatedAt);
                const m = months[d.getMonth()];
                monthCounts[m] = (monthCounts[m] || 0) + 1;
            }
        });

        const processedChart = months.map(m => ({
            month: m,
            units: monthCounts[m] || 0
        }));
        setChartData(processedChart);

        setLoading(false);

      } catch (error) {
        console.error("Dashboard Load Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
        <Layout Sidebar={DonorSidebar}>
            <div style={{textAlign:'center', marginTop:'100px'}}>
                <CircularProgress style={{color:'#be123c'}} />
            </div>
        </Layout>
    );
  }

  return (
    <Layout Sidebar={DonorSidebar}>
      <div className="donor-dash-container">
        
        <div className="donor-dash-header">
          <div>
            <h1 className="donor-dash-title">Donor Overview</h1>
            <p className="donor-dash-subtitle">Thank you for being a hero. Here is your impact.</p>
          </div>
          <div style={{textAlign:'right'}}>
             <span style={{fontSize:'0.9rem', color:'#64748b', fontWeight:'500'}}>
               Blood Group: <span style={{color:'#be123c', fontWeight:'bold', fontSize:'1.2rem'}}>
                 {donorProfile.bloodGroup || "N/A"}
               </span>
             </span>
          </div>
        </div>

        <div className="donor-dash-stats-grid">
          <div className="donor-dash-stat-card">
            <div className="donor-dash-stat-icon-wrapper donor-dash-bg-rose"><VolunteerActivism /></div>
            <div className="donor-dash-stat-content">
              <h3>{stats.totalDonations}</h3>
              <p>Total Donations</p>
            </div>
          </div>

          <div className="donor-dash-stat-card">
            <div className="donor-dash-stat-icon-wrapper donor-dash-bg-teal"><Favorite /></div>
            <div className="donor-dash-stat-content">
              <h3>{stats.livesSaved}</h3>
              <p>Lives Impacted</p>
            </div>
          </div>

          <div className="donor-dash-stat-card">
            <div className="donor-dash-stat-icon-wrapper donor-dash-bg-amber"><Event /></div>
            <div className="donor-dash-stat-content">
              <h3 style={{fontSize: '1.2rem'}}>{stats.nextEligible}</h3>
              <p>Next Eligible Date</p>
            </div>
          </div>

          <div className="donor-dash-stat-card">
            <div className="donor-dash-stat-icon-wrapper donor-dash-bg-indigo"><WaterDrop /></div>
            <div className="donor-dash-stat-content">
              <h3 style={{fontSize: '1.2rem'}}>{stats.lastDonation}</h3>
              <p>Last Donation</p>
            </div>
          </div>
        </div>

        <div className="donor-dash-row">
          
          <div className="donor-dash-health-card">
            <div className="donor-dash-health-title"><MonitorHeart /> Health Vitals</div>
            <div className="donor-dash-health-metric">
                <span>Weight</span>
                <h2>{donorProfile.weight ? `${donorProfile.weight} kg` : "N/A"}</h2>
            </div>
            <div className="donor-dash-health-metric">
                <span>Gender</span>
                <h2>{donorProfile.gender || "N/A"}</h2>
            </div>
            <div style={{marginTop: '25px', fontSize:'0.8rem', opacity:0.8}}>
                *Based on profile data
            </div>
          </div>

          <div className="donor-dash-chart-card">
            <div className="donor-dash-chart-header">
              <h4>Donation Frequency ({new Date().getFullYear()})</h4>
            </div>
            <div style={{ width: '100%', height: 250, minWidth: 0, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#be123c" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#be123c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="units" stroke="#be123c" strokeWidth={3} fillOpacity={1} fill="url(#colorUnits)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="donor-dash-table-card">
          <div className="donor-dash-chart-header">
            <h4>Recent Activity</h4>
          </div>
          <div style={{overflowX: 'auto'}}>
            <table className="donor-dash-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient / Hospital</th>
                  <th>Units</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                    history.slice(0, 5).map((row) => (
                      <tr key={row._id}>
                        <td>{new Date(row.createdAt).toLocaleDateString()}</td>
                        <td style={{fontWeight:'600', color:'#1e293b'}}>
                            {row.patientName} <span style={{fontWeight:'normal', color:'#64748b'}}>@ {row.hospitalName}</span>
                        </td>
                        <td>{row.units} Unit</td>
                        <td>
                          <span className={`donor-dash-badge-${row.status.toLowerCase() === 'fulfilled' ? 'fulfilled' : 'scheduled'}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                ) : (
                    <tr><td colSpan="4" style={{textAlign:'center', color:'#94a3b8'}}>No history yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default DonorDashboard;