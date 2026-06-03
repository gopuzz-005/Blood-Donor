import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const inventorySchema = new mongoose.Schema({
  group: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  units: {
    type: Number,
    default: 0,
  },
});

const hospitalSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Approved', 'Rejected'],
    },
    inventory: {
      type: [inventorySchema],
      default: () => [
        { group: 'A+', units: 0 },
        { group: 'A-', units: 0 },
        { group: 'B+', units: 0 },
        { group: 'B-', units: 0 },
        { group: 'AB+', units: 0 },
        { group: 'AB-', units: 0 },
        { group: 'O+', units: 0 },
        { group: 'O-', units: 0 },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
hospitalSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
hospitalSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;
