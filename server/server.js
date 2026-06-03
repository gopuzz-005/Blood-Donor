import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './router.js';
import User from './models/User.js';
import Hospital from './models/Hospital.js';
import bcrypt from 'bcryptjs';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({ origin: '*' })); // Allow all origins for seamless developer testing
app.use(express.json());

// Main Router Endpoint Mount
app.use('/', router);

// Catch-All Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Seed data function to ensure instant professional ecosystem visual states!
const seedSystemRecords = async () => {
  try {
    // 1. Seed default Approved Hospitals with pre-loaded stocks so visual widgets load beautifully!
    const hospCount = await Hospital.countDocuments();
    if (hospCount === 0) {
      console.log('Seeding mock approved hospitals for visual data...');
      
      const cityHospPassword = await bcrypt.hash('hospital123', 10);
      await Hospital.create({
        hospitalName: 'City General Hospital',
        email: 'cityhospital@gmail.com',
        password: cityHospPassword,
        phone: '9876543210',
        address: '123 Health Ave, NY',
        status: 'Approved',
        inventory: [
          { group: 'A+', units: 25 },
          { group: 'A-', units: 5 },
          { group: 'B+', units: 35 },
          { group: 'B-', units: 2 },
          { group: 'AB+', units: 12 },
          { group: 'AB-', units: 1 },
          { group: 'O+', units: 45 },
          { group: 'O-', units: 8 }
        ]
      });

      const stMaryPassword = await bcrypt.hash('hospital123', 10);
      await Hospital.create({
        hospitalName: "St. Mary's Clinic",
        email: 'stmary@gmail.com',
        password: stMaryPassword,
        phone: '9876543211',
        address: '456 Clinic Lane, NY',
        status: 'Approved',
        inventory: [
          { group: 'A+', units: 10 },
          { group: 'A-', units: 2 },
          { group: 'B+', units: 20 },
          { group: 'B-', units: 1 },
          { group: 'AB+', units: 5 },
          { group: 'AB-', units: 0 },
          { group: 'O+', units: 30 },
          { group: 'O-', units: 4 }
        ]
      });

      const mercyHospPassword = await bcrypt.hash('hospital123', 10);
      await Hospital.create({
        hospitalName: 'Mercy Medical Center',
        email: 'mercy@gmail.com',
        password: mercyHospPassword,
        phone: '9876543212',
        address: '789 Care Road, NY',
        status: 'Pending', // Pending approval so Admin can test approving!
        inventory: [
          { group: 'A+', units: 0 },
          { group: 'A-', units: 0 },
          { group: 'B+', units: 0 },
          { group: 'B-', units: 0 },
          { group: 'AB+', units: 0 },
          { group: 'AB-', units: 0 },
          { group: 'O+', units: 0 },
          { group: 'O-', units: 0 }
        ]
      });
      console.log('Approved and Pending Hospitals seeded successfully!');
    }

    // 2. Seed default Donor / Patient users to speed up developer logs!
    const userCount = await User.countDocuments({ role: 'donor' });
    if (userCount === 0) {
      console.log('Seeding mock donor user account...');
      const donorPassword = await bcrypt.hash('donor123', 10);
      await User.create({
        fullName: 'John Doe',
        email: 'johndoe@gmail.com',
        password: donorPassword,
        phone: '9876543200',
        bloodGroup: 'O+',
        age: 26,
        gender: 'Male',
        weight: 72,
        address: '77 Broad Street, NY',
        donationCount: 2,
        role: 'donor'
      });
      console.log('Default Donor John Doe seeded successfully! Credentials: johndoe@gmail.com / donor123');
    }
  } catch (error) {
    console.error('Record Seeding Error:', error.message);
  }
};

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedSystemRecords();
});
