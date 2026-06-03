import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
import Request from '../models/Request.js';
import Message from '../models/Message.js';
import jwt from 'jsonwebtoken';

const generateToken = (email, role = 'admin') => {
  return jwt.sign({ email, role }, process.env.JWT_SECRET || 'supersecretlifedropkeyjwt987!', {
    expiresIn: '30d',
  });
};

// @desc    Admin secure login
// @route   POST /Admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Standard credential seed checks
    if (email === 'admin@lifeline.com' && password === 'adminpassword123') {
      res.json({
        _id: 'admin_root_id',
        fullName: 'System Administrator',
        email: 'admin@lifeline.com',
        role: 'admin',
        token: generateToken('admin@lifeline.com', 'admin'),
      });
    } else {
      res.status(401).json({ message: 'Invalid Admin Credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard aggregated stats
// @route   GET /Admin/stats
// @access  Private (Admin Only)
const getStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments({ role: 'donor' });
    const donorsCount = await User.countDocuments({ role: 'donor', donationCount: { $gt: 0 } });
    const hospitalsCount = await Hospital.countDocuments();
    const requestsCount = await Request.countDocuments();

    // Map month activity trends for requests over the last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRequests = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = months[d.getMonth()];
      const year = d.getFullYear();
      
      const startOfMonth = new Date(year, d.getMonth(), 1);
      const endOfMonth = new Date(year, d.getMonth() + 1, 0, 23, 59, 59);

      const count = await Request.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      });

      monthlyRequests.push({ name: monthName, requests: count });
    }

    // Dynamic blood distributions aggregation across approved hospitals
    const approvedHospitals = await Hospital.find({ status: 'Approved' });
    const distributionMap = { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0 };

    approvedHospitals.forEach((hosp) => {
      hosp.inventory.forEach((inv) => {
        if (distributionMap[inv.group] !== undefined) {
          distributionMap[inv.group] += inv.units;
        }
      });
    });

    const bloodDistribution = Object.keys(distributionMap).map((key) => ({
      name: key,
      value: distributionMap[key],
    }));

    res.json({
      counts: {
        users: usersCount,
        donors: donorsCount || usersCount, // fallback to total users
        hospitals: hospitalsCount,
        requests: requestsCount,
      },
      monthlyRequests,
      bloodDistribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (donors)
// @route   GET /Admin/users, GET /Admin/donors
// @access  Private (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'donor' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /Admin/users/:id
// @access  Private (Admin Only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await User.deleteOne({ _id: req.params.id });
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all hospitals list
// @route   GET /Admin/hospitals
// @access  Private (Admin Only)
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({}).select('-password');
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/Reject a pending hospital registration
// @route   PUT /Admin/hospitals/:id/status
// @access  Private (Admin Only)
const updateHospitalStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value provided' });
    }

    const hospital = await Hospital.findById(req.params.id);

    if (hospital) {
      hospital.status = status;
      await hospital.save();
      res.json({ message: `Hospital status updated to ${status}`, hospital });
    } else {
      res.status(404).json({ message: 'Hospital record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete hospital clinic record
// @route   DELETE /Admin/hospitals/:id
// @access  Private (Admin Only)
const deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (hospital) {
      await Hospital.deleteOne({ _id: req.params.id });
      res.json({ message: 'Hospital deleted successfully' });
    } else {
      res.status(404).json({ message: 'Hospital not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all blood requests
// @route   GET /Admin/all-requests
// @access  Private (Admin Only)
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find({})
      .populate('requesterId', 'fullName hospitalName phone')
      .sort({ createdAt: -1 });

    const formattedRequests = requests.map(req => {
      const obj = req.toObject();
      obj.requester = {
        fullName: obj.requesterId?.fullName || obj.requesterId?.hospitalName || 'Unknown',
        mobile: obj.requesterId?.phone || ''
      };
      return obj;
    });

    res.json(formattedRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blood request
// @route   DELETE /Admin/requests/:id
// @access  Private (Admin Only)
const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json({ message: 'Request removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all user contact message entries
// @route   GET /Admin/messages
// @access  Private (Admin Only)
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /Admin/messages/:id
// @access  Private (Admin Only)
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      await Message.deleteOne({ _id: req.params.id });
      res.json({ message: 'Message deleted successfully' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save public contact message
// @route   POST /api/contact
// @access  Public
const postContactMessage = async (req, res) => {
  try {
    const { name, sender, email, subject, message } = req.body;
    
    // Normalizing name / sender
    const senderName = name || sender;
    const senderEmail = email;

    if (!senderName || !senderEmail || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const newMessage = await Message.create({
      sender: senderName,
      email: senderEmail,
      subject: subject || 'General Query',
      message,
    });

    res.status(201).json({ success: true, message: 'Message sent successfully!', data: newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
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
};
