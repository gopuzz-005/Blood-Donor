import Request from '../models/Request.js';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';

// @desc    Create a blood request (User or Hospital)
// @route   POST /api/requests/create
// @access  Private (User or Hospital)
const createRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      units,
      unitsRequired,
      urgency,
      hospitalName,
      hospitalAddress,
      contactNumber,
      neededBy,
      reason,
    } = req.body;

    // Normalizing units / unitsRequired
    const unitsToRequest = units || unitsRequired;

    if (!patientName || !bloodGroup || !unitsToRequest || !hospitalName || !contactNumber) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    let requesterId;
    let requesterType;

    // Determine if requester is a Hospital or a User
    if (req.hospital) {
      requesterId = req.hospital._id;
      requesterType = 'Hospital';
    } else if (req.user) {
      requesterId = req.user._id;
      requesterType = 'User';
    } else {
      return res.status(401).json({ message: 'Unauthorized session' });
    }

    const request = await Request.create({
      patientName,
      bloodGroup,
      units: Number(unitsToRequest),
      urgency: urgency || 'Moderate',
      hospitalName,
      hospitalAddress: hospitalAddress || '',
      contactNumber,
      neededBy: neededBy ? new Date(neededBy) : null,
      reason: reason || '',
      status: 'Pending',
      requesterId,
      requesterType,
    });

    res.status(201).json({
      message: 'Blood request registered successfully',
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending requests matching the donor's blood type
// @route   GET /api/requests/matching
// @access  Private (User/Donor)
const getMatchingRequests = async (req, res) => {
  try {
    const donor = await User.findById(req.user._id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    // Retrieve pending requests matching the blood group and not created by this user
    const requests = await Request.find({
      bloodGroup: donor.bloodGroup,
      status: 'Pending',
      requesterId: { $ne: donor._id },
    }).sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get donor's scheduled donation history
// @route   GET /api/requests/donor-history
// @access  Private (User/Donor)
const getDonorHistory = async (req, res) => {
  try {
    const history = await Request.find({ donorId: req.user._id }).sort({ updatedAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hospital's posted requests
// @route   GET /api/requests/hospital
// @access  Private (Hospital)
const getHospitalRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      requesterId: req.hospital._id,
      requesterType: 'Hospital',
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Schedule donation for a specific request
// @route   POST /api/requests/schedule/:id
// @access  Private (User/Donor)
const scheduleDonation = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'Request is already claimed or fulfilled' });
    }

    // Schedule the request
    request.status = 'Scheduled';
    request.donorId = req.user._id;
    request.donationDate = new Date();
    await request.save();

    // Increment donor's donation count for profile ranking
    const donor = await User.findById(req.user._id);
    if (donor) {
      donor.donationCount += 1;
      await donor.save();
    }

    // Update hospital's stock if request requester is a hospital!
    // This connects inventory and requests professionally!
    if (request.requesterType === 'Hospital') {
      const hospital = await Hospital.findById(request.requesterId);
      if (hospital) {
        const item = hospital.inventory.find((inv) => inv.group === request.bloodGroup);
        if (item) {
          item.units += request.units; // add donated units to inventory
          await hospital.save();
        }
      }
    }

    res.json({
      message: 'Donation scheduled successfully. Your contribution saved a life!',
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Aggregate all blood inventory from approved hospitals
// @route   GET /api/bloodbank/all-stock
// @access  Public
const getAllStock = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ status: 'Approved' });

    // Pre-initialize groups counts
    const bloodStocks = {
      'A+': { totalUnits: 0, hospitalCount: 0 },
      'A-': { totalUnits: 0, hospitalCount: 0 },
      'B+': { totalUnits: 0, hospitalCount: 0 },
      'B-': { totalUnits: 0, hospitalCount: 0 },
      'AB+': { totalUnits: 0, hospitalCount: 0 },
      'AB-': { totalUnits: 0, hospitalCount: 0 },
      'O+': { totalUnits: 0, hospitalCount: 0 },
      'O-': { totalUnits: 0, hospitalCount: 0 },
    };

    hospitals.forEach((hosp) => {
      hosp.inventory.forEach((inv) => {
        if (bloodStocks[inv.group] !== undefined) {
          bloodStocks[inv.group].totalUnits += inv.units;
          if (inv.units > 0) {
            bloodStocks[inv.group].hospitalCount += 1;
          }
        }
      });
    });

    // Map into array structure expected by BloodBank.jsx frontend component
    const stockArray = Object.keys(bloodStocks).map((group) => {
      const units = bloodStocks[group].totalUnits;
      let status = 'Stable';
      if (units <= 5) {
        status = 'Critical';
      } else if (units <= 15) {
        status = 'Low';
      }

      return {
        group,
        totalUnits: units,
        status,
        hospitalCount: bloodStocks[group].hospitalCount,
      };
    });

    res.json(stockArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's posted requests
// @route   GET /api/requests/my-requests
// @access  Private (User)
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      requesterId: req.user._id,
      requesterType: 'User',
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a blood request directly to a hospital
// @route   POST /api/requests/hospital-request
// @access  Private (User)
const createHospitalRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      units,
      urgency,
      hospitalName,
      hospitalAddress,
      reason,
    } = req.body;

    if (!patientName || !bloodGroup || !units || !hospitalName) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const request = await Request.create({
      patientName,
      bloodGroup,
      units: Number(units),
      urgency: urgency || 'Moderate',
      hospitalName,
      hospitalAddress: hospitalAddress || '',
      contactNumber: req.user.phone, // fallback to user profile phone
      reason: reason || '',
      status: 'Pending',
      requesterId: req.user._id,
      requesterType: 'User',
    });

    res.status(201).json({
      message: 'Request sent to hospital successfully',
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);

    if (request) {
      request.status = status;
      await request.save();
      res.json({ message: `Request status updated to ${status}`, request });
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createRequest,
  getMatchingRequests,
  getDonorHistory,
  getHospitalRequests,
  scheduleDonation,
  getAllStock,
  getMyRequests,
  createHospitalRequest,
  updateRequestStatus,
};
