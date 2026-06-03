import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role = 'donor') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'supersecretlifedropkeyjwt987!', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (donor/recipient)
// @route   POST /Donor/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      bloodGroup,
      age,
      gender,
      weight,
      address,
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      bloodGroup,
      age: Number(age),
      gender,
      weight: weight ? Number(weight) : undefined,
      address,
      role: req.body.role || 'donor', 
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        age: user.age,
        gender: user.gender,
        weight: user.weight,
        address: user.address,
        donationCount: user.donationCount,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /Donor/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        age: user.age,
        gender: user.gender,
        weight: user.weight,
        address: user.address,
        donationCount: user.donationCount,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /Donor/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = req.user;

    if (user) {
      res.json({
        _id: user._id,
        fullName: user.fullName || user.hospitalName,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        age: user.age,
        gender: user.gender,
        weight: user.weight,
        address: user.address,
        donationCount: user.donationCount,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /Donor/update-profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = req.user;

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.phone = req.body.phone || user.phone;
      user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
      user.age = req.body.age ? Number(req.body.age) : user.age;
      user.gender = req.body.gender || user.gender;
      user.weight = req.body.weight ? Number(req.body.weight) : user.weight;
      user.address = req.body.address || user.address;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        bloodGroup: updatedUser.bloodGroup,
        age: updatedUser.age,
        gender: updatedUser.gender,
        weight: updatedUser.weight,
        address: updatedUser.address,
        donationCount: updatedUser.donationCount,
        role: updatedUser.role,
        token: generateToken(updatedUser._id, updatedUser.role),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password Request
// @route   POST /Donor/forgot-password, POST /User/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // In a fully integrated production setup, SMTP or SMS dispatch would occur here.
    // For this professional mock integration, we log the action and notify success.
    console.log(`Password reset requested for user: ${email}`);
    res.json({ success: true, message: 'Password recovery instructions dispatched' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
};
