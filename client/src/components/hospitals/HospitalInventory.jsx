import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import HospitalSidebar from './HospitalSidebar';
import { 
  Add, 
  Remove, 
  Opacity, 
  Refresh 
} from '@mui/icons-material';
import { CircularProgress, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/Inventory.css';

const HospitalInventory = () => {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState({});
  const [updating, setUpdating] = useState(null); 

  const bloodTypes = [
    { key: 'A_pos', label: 'A+', class: 'group-A' },
    { key: 'A_neg', label: 'A-', class: 'group-A' },
    { key: 'B_pos', label: 'B+', class: 'group-B' },
    { key: 'B_neg', label: 'B-', class: 'group-B' },
    { key: 'AB_pos', label: 'AB+', class: 'group-AB' },
    { key: 'AB_neg', label: 'AB-', class: 'group-AB' },
    { key: 'O_pos', label: 'O+', class: 'group-O' },
    { key: 'O_neg', label: 'O-', class: 'group-O' },
  ];

  const fetchInventory = async () => {
    setLoading(true);
    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token || userInfo.role !== 'hospital') {
            setLoading(false);
            return;
        }
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        const { data } = await axios.get("http://localhost:5001/Hospitals/profile", config);
        // Map backend array to object
        const invObj = {};
        if (data.inventory) {
          data.inventory.forEach(inv => {
            const key = inv.group.replace('+', '_pos').replace('-', '_neg');
            invObj[key] = inv.units;
          });
        }
        setInventory(invObj);
        setLoading(false);
    } catch (error) {
        toast.error("Failed to load inventory");
        setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  // --- 2. UPDATE STOCK ---
  const handleUpdate = async (key, label, action) => {
    setUpdating(key); 
    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` } };

        const payload = {
            group: label,
            units: action === 'add' ? 1 : -1
        };

        const { data } = await axios.put("http://localhost:5001/Hospitals/inventory", payload, config);
        
        // Map the returned array back to object format
        const newInvObj = {};
        if (data.inventory) {
          data.inventory.forEach(inv => {
            const k = inv.group.replace('+', '_pos').replace('-', '_neg');
            newInvObj[k] = inv.units;
          });
        }
        setInventory(newInvObj);
        
    } catch (error) {
        console.error("Update Error", error);
        toast.error("Failed to update stock");
    } finally {
        setUpdating(null);
    }
  };

  return (
    <Layout Sidebar={HospitalSidebar}>
      <ToastContainer position="top-right" autoClose={1500} />
      
      <div className="inventory-container">
        
        <div className="inventory-header">
          <div>
            <h1 className="inventory-title">Blood Inventory</h1>
            <p style={{color:'#64748b'}}>Manage your real-time blood stock levels.</p>
          </div>
          <Button startIcon={<Refresh />} onClick={fetchInventory}>Refresh</Button>
        </div>

        {loading ? (
            <div style={{textAlign:'center', marginTop:'80px'}}>
                <CircularProgress style={{color:'#0284c7'}} />
            </div>
        ) : (
            <div className="blood-grid">
                {bloodTypes.map((type) => {
                    const count = inventory[type.key] || 0;
                    const isLow = count < 5; 

                    return (
                        <div className={`blood-card ${type.class}`} key={type.key}>
                            <span className={`status-indicator ${isLow ? 'status-low' : 'status-good'}`}>
                                {isLow ? 'LOW STOCK' : 'AVAILABLE'}
                            </span>

                            <div className="blood-icon">
                                {type.label}
                            </div>

                            {updating === type.key ? (
                                <CircularProgress size={30} style={{margin:'15px 0'}} />
                            ) : (
                                <h2 className="stock-count">{count}</h2>
                            )}
                            <span className="unit-label">Units Available</span>

                            <div className="action-row">
                                <button 
                                    className="btn-icon btn-minus" 
                                    onClick={() => handleUpdate(type.key, type.label, 'remove')}
                                    disabled={updating === type.key || count === 0}
                                    style={count === 0 ? {opacity:0.5, cursor:'not-allowed'} : {}}
                                >
                                    <Remove fontSize="small" />
                                </button>
                                <button 
                                    className="btn-icon btn-plus"
                                    onClick={() => handleUpdate(type.key, type.label, 'add')}
                                    disabled={updating === type.key}
                                >
                                    <Add fontSize="small" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

      </div>
    </Layout>
  );
};

export default HospitalInventory;