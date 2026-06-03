import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    units: {
      type: Number,
      required: true,
    },
    urgency: {
      type: String,
      default: 'Moderate',
      enum: ['Moderate', 'Urgent', 'Critical', 'moderate', 'critical'],
    },
    hospitalName: {
      type: String,
      required: true,
    },
    hospitalAddress: {
      type: String,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    neededBy: {
      type: Date,
    },
    reason: {
      type: String,
    },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Scheduled', 'Fulfilled', 'Cancelled', 'Completed', 'pending', 'scheduled', 'fulfilled', 'cancelled', 'completed'],
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'requesterType',
    },
    requesterType: {
      type: String,
      required: true,
      enum: ['User', 'Hospital'],
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    donationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model('Request', requestSchema);

export default Request;
