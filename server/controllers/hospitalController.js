import Hospital from '../models/Hospital.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role = 'hospital') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'supersecretlifedropkeyjwt987!', {
    expiresIn: '30d',
  });
};

// @desc    Register a new hospital
// @route   POST /hospital/register
// @access  Public
const registerHospital = async (req, res) => {
  try {
    const { hospitalName, email, password, phone, address } = req.body;

    const hospitalExists = await Hospital.findOne({ email });

    if (hospitalExists) {
      return res.status(400).json({ message: 'Hospital already registered with this email' });
    }

    const hospital = await Hospital.create({
      hospitalName,
      email,
      password,
      phone,
      address,
      status: 'Pending', // Pending admin approval by default
    });

    if (hospital) {
      res.status(201).json({
        _id: hospital._id,
        hospitalName: hospital.hospitalName,
        email: hospital.email,
        phone: hospital.phone,
        address: hospital.address,
        status: hospital.status,
      });
    } else {
      res.status(400).json({ message: 'Invalid hospital data provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth hospital & get token
// @route   POST /hospital/login
// @access  Public
const loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hospital = await Hospital.findOne({ email });

    if (hospital && (await hospital.matchPassword(password))) {
      // Access restriction based on status
      if (hospital.status === 'Pending') {
        return res.status(403).json({
          message: 'Your hospital registration is currently pending Administrator approval.',
        });
      }

      if (hospital.status === 'Rejected') {
        return res.status(403).json({
          message: 'Your hospital registration has been rejected. Please contact support.',
        });
      }

      res.json({
        _id: hospital._id,
        hospitalName: hospital.hospitalName,
        email: hospital.email,
        phone: hospital.phone,
        address: hospital.address,
        status: hospital.status,
        role: 'hospital',
        token: generateToken(hospital._id, 'hospital'),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hospital profile
// @route   GET /hospital/profile
// @access  Private (Hospital)
const getHospitalProfile = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.hospital._id);

    if (hospital) {
      res.json({
        _id: hospital._id,
        hospitalName: hospital.hospitalName,
        email: hospital.email,
        phone: hospital.phone,
        address: hospital.address,
        status: hospital.status,
      });
    } else {
      res.status(404).json({ message: 'Hospital not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update hospital profile
// @route   PUT /hospital/update-profile
// @access  Private (Hospital)
const updateHospitalProfile = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.hospital._id);

    if (hospital) {
      hospital.hospitalName = req.body.hospitalName || hospital.hospitalName;
      hospital.phone = req.body.phone || hospital.phone;
      hospital.address = req.body.address || hospital.address;

      if (req.body.password) {
        hospital.password = req.body.password;
      }

      const updatedHospital = await hospital.save();

      res.json({
        _id: updatedHospital._id,
        hospitalName: updatedHospital.hospitalName,
        email: updatedHospital.email,
        phone: updatedHospital.phone,
        address: updatedHospital.address,
        status: updatedHospital.status,
        role: 'hospital',
        token: generateToken(updatedHospital._id, 'hospital'),
      });
    } else {
      res.status(404).json({ message: 'Hospital not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hospital inventory
// @route   GET /hospital/inventory
// @access  Private (Hospital)
const getHospitalInventory = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.hospital._id);

    if (hospital) {
      res.json({
        inventory: hospital.inventory,
      });
    } else {
      res.status(404).json({ message: 'Hospital not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update specific blood group stock in hospital inventory
// @route   PUT /hospital/inventory
// @access  Private (Hospital)
const updateHospitalInventory = async (req, res) => {
  try {
    const { group, units } = req.body; // e.g. { group: "A+", units: 5 } (adjustment value)
    
    if (!group || units === undefined) {
      return res.status(400).json({ message: 'Please provide blood group and units' });
    }

    const hospital = await Hospital.findById(req.hospital._id);

    if (hospital) {
      // Find the inventory item
      const item = hospital.inventory.find((inv) => inv.group === group);

      if (item) {
        // Calculate new units value ensuring it is not negative
        const newUnits = item.units + Number(units);
        if (newUnits < 0) {
          return res.status(400).json({ message: `Cannot reduce units below 0. Current units: ${item.units}` });
        }
        item.units = newUnits;
        await hospital.save();
        res.json({
          message: `Successfully updated ${group} inventory. New units: ${item.units}`,
          inventory: hospital.inventory,
        });
      } else {
        res.status(404).json({ message: `Blood group ${group} not found in inventory` });
      }
    } else {
      res.status(404).json({ message: 'Hospital not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Hospital Forgot Password Request
// @route   POST /hospital/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const hospital = await Hospital.findOne({ email });

    if (!hospital) {
      return res.status(404).json({ message: 'No hospital account found with this email' });
    }

    console.log(`Password reset requested for hospital: ${email}`);
    res.json({ success: true, message: 'Password recovery instructions dispatched' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  registerHospital,
  loginHospital,
  getHospitalProfile,
  updateHospitalProfile,
  getHospitalInventory,
  updateHospitalInventory,
  forgotPassword,
};
