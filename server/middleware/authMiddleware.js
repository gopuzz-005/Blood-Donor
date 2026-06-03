import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretlifedropkeyjwt987!');

      // Set user / hospital / admin metadata
      if (decoded.role === 'admin') {
        req.user = { _id: 'admin_id', role: 'admin', fullName: 'Administrator', email: decoded.email };
        return next();
      } else if (decoded.role === 'hospital') {
        const hospital = await Hospital.findById(decoded.id).select('-password');
        if (!hospital) {
          return res.status(401).json({ message: 'Not authorized, hospital not found' });
        }
        if (hospital.status !== 'Approved') {
          return res.status(403).json({ message: 'Hospital account is not approved by Administrator' });
        }
        req.hospital = hospital;
        req.user = hospital; // for compatibility in polymorphic queries
        return next();
      } else {
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.user = user;
        return next();
      }
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, administrator only' });
  }
};

export { protect, adminOnly };
