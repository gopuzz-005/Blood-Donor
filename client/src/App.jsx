import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/common/LandingPage';
import About from './components/common/About';

// Admin
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import AdminForgotPass from './components/admin/AdminForgotPass';
import ManageDonors from './components/admin/ManageDonors';
import ManageHospitals from './components/admin/ManageHospitals';
import ManageUsers from './components/admin/ManageUsers';
import AdminMessages from './components/admin/AdminMessages';
import AllRequests from './components/admin/AllRequests';

// Donor
import DonorDashboard from './components/donors/DonorDashboard';
import DonorLogin from './components/donors/DonorLogin';
import DonorRegister from './components/donors/DonorRegister';
import DonorForgotPass from './components/donors/DonorForgotPass';
import DonateNow from './components/donors/DonateNow';
import DonorHistory from './components/donors/DonorHistory';
import DonorProfile from './components/donors/DonorProfile';

// Hospital
import HospitalDashboard from './components/hospitals/HospitalDashboard';
import HospitalLogin from './components/hospitals/HospitalLogin';
import HospitalRegister from './components/hospitals/HospitalRegister';
import HospitalForgotPass from './components/hospitals/HospitalForgotPass';
import HospitalInventory from './components/hospitals/HospitalInventory';
import HospitalRequests from './components/hospitals/HospitalRequests';
import HospitalProfile from './components/hospitals/HospitalProfile';

// User
import UserLogin from './components/user/UserLogin';
import UserRegister from './components/user/UserRegister';
import UserForgotPass from './components/user/UserForgotPass';
import UserDashboard from './components/user/UserDashboard';
import RequestBlood from './components/user/RequestBlood';
import BloodBank from './components/user/BloodBank';
import UserHistory from './components/user/UserHistory';
import UserProfile from './components/user/UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPass />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-donors" element={<ManageDonors />} />
        <Route path="/admin/manage-hospitals" element={<ManageHospitals />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/all-requests" element={<AllRequests />} />

        {/* Donor Routes */}
        <Route path="/donor/login" element={<DonorLogin />} />
        <Route path="/donor/register" element={<DonorRegister />} />
        <Route path="/donor/forgot-password" element={<DonorForgotPass />} />
        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/donor/donate" element={<DonateNow />} />
        <Route path="/donor/history" element={<DonorHistory />} />
        <Route path="/donor/profile" element={<DonorProfile />} />

        {/* Hospital Routes */}
        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/hospital/register" element={<HospitalRegister />} />
        <Route path="/hospital/forgot-password" element={<HospitalForgotPass />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/inventory" element={<HospitalInventory />} />
        <Route path="/hospital/requests" element={<HospitalRequests />} />
        <Route path="/hospital/profile" element={<HospitalProfile />} />

        {/* User Routes */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/forgot-password" element={<UserForgotPass />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/request-blood" element={<RequestBlood />} />
        <Route path="/user/blood-bank" element={<BloodBank />} />
        <Route path="/user/history" element={<UserHistory />} />
        <Route path="/user/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
