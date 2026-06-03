import express from 'express';
import { protect, adminOnly } from './middleware/authMiddleware.js';

import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
} from './controllers/userController.js';

import {
  registerHospital,
  loginHospital,
  getHospitalProfile,
  updateHospitalProfile,
  getHospitalInventory,
  updateHospitalInventory,
  forgotPassword as forgotHospitalPassword,
} from './controllers/hospitalController.js';

import {
  createRequest,
  getMatchingRequests,
  getDonorHistory,
  getHospitalRequests,
  scheduleDonation,
  getAllStock,
  getMyRequests,
  createHospitalRequest,
  updateRequestStatus,
} from './controllers/requestController.js';

import {
  loginAdmin,
  getStats,
  getAllUsers,
  deleteUser,
  getAllHospitals,
  updateHospitalStatus,
  deleteHospital,
  getAllRequests,
  deleteRequest,
  getMessages,
  deleteMessage,
  postContactMessage,
} from './controllers/adminController.js';

const router = express.Router();

// ==========================================
// 1. DONOR / USER PROFILE & AUTH ROUTES
// ==========================================
router.post('/Donor/register', registerUser);
router.post('/User/register', registerUser); // alias
router.post('/Donor/login', loginUser);
router.post('/User/login', loginUser); // support duplicate route
router.get('/Donor/profile', protect, getUserProfile);
router.put('/Donor/update-profile', protect, updateUserProfile);
router.post('/Donor/forgot-password', forgotPassword);
router.post('/User/forgot-password', forgotPassword);
router.post('/Donor/reset-password', (req, res) => res.json({ success: true })); // mock
router.post('/User/reset-password', (req, res) => res.json({ success: true })); // mock
router.get('/api/users/profile', protect, getUserProfile); // alias
router.put('/api/users/profile', protect, updateUserProfile); // alias

// ==========================================
// 2. HOSPITAL PROFILE & AUTH ROUTES
// ==========================================
router.post('/hospital/register', registerHospital);
router.post('/Hospitals/register', registerHospital); // alias
router.post('/hospital/login', loginHospital);
router.post('/Hospitals/login', loginHospital); // alias
router.get('/hospital/profile', protect, getHospitalProfile);
router.put('/hospital/update-profile', protect, updateHospitalProfile);
router.get('/hospital/inventory', protect, getHospitalInventory);
router.put('/hospital/inventory', protect, updateHospitalInventory);
router.post('/hospital/forgot-password', forgotHospitalPassword);
router.post('/Hospitals/forgot-password', forgotHospitalPassword); // alias
router.post('/Hospitals/reset-password', (req, res) => res.json({ success: true })); // mock
router.get('/Hospitals/all', protect, getAllHospitals); // Get all hospitals for users
router.get('/Hospitals/profile', protect, getHospitalProfile); // alias
router.put('/Hospitals/profile', protect, updateHospitalProfile); // alias
router.get('/Hospitals/inventory', protect, getHospitalInventory); // alias
router.put('/Hospitals/inventory', protect, updateHospitalInventory); // alias
router.get('/Hospitals/my-requests', protect, getHospitalRequests); // alias

// ==========================================
// 3. BLOOD REQUEST ROUTES
// ==========================================
router.post('/api/requests/create', protect, createRequest);
router.get('/api/requests/matching', protect, getMatchingRequests);
router.get('/api/requests/donor-history', protect, getDonorHistory);
router.get('/api/requests/hospital', protect, getHospitalRequests);
router.get('/api/requests/my-requests', protect, getMyRequests);
router.post('/api/requests/hospital-request', protect, createHospitalRequest);
router.put('/api/requests/schedule/:id', protect, scheduleDonation);
router.put('/api/requests/:id/status', protect, updateRequestStatus);

// ==========================================
// 4. BLOOD BANK STOCK ROUTES (PUBLIC AGGREGATES)
// ==========================================
router.get('/api/bloodbank/all-stock', getAllStock);

// ==========================================
// 5. PUBLIC CONTACT ROUTES
// ==========================================
router.post('/api/contact', postContactMessage);

// ==========================================
// 6. ADMIN PORTAL ROUTING
// ==========================================
router.post('/Admin/login', loginAdmin);
router.get('/Admin/stats', protect, adminOnly, getStats);

// User management
router.get('/Admin/users', protect, adminOnly, getAllUsers);
router.get('/Admin/donors', protect, adminOnly, getAllUsers);
router.delete('/Admin/users/:id', protect, adminOnly, deleteUser);

// Hospital management
router.get('/Admin/hospitals', protect, adminOnly, getAllHospitals);
router.put('/Admin/hospitals/:id/status', protect, adminOnly, updateHospitalStatus);
router.delete('/Admin/hospitals/:id', protect, adminOnly, deleteHospital);

// Requests audit
router.get('/Admin/all-requests', protect, adminOnly, getAllRequests);
router.get('/Admin/requests', protect, adminOnly, getAllRequests); // alias
router.delete('/Admin/requests/:id', protect, adminOnly, deleteRequest);

// Inbox messages
router.get('/Admin/messages', protect, adminOnly, getMessages);
router.delete('/Admin/messages/:id', protect, adminOnly, deleteMessage);

// Admin forgot & reset password placeholders
router.post('/Admin/forgot-password', (req, res) => {
  res.json({ success: true, message: 'Recovery email dispatched to administrator' });
});
router.post('/Admin/reset-password', (req, res) => {
  res.json({ success: true, message: 'Administrator security password reset successful' });
});

export default router;
