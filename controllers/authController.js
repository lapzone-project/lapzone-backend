import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here', {
    expiresIn: '30d'
  });
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  console.log('Login attempt, body:', req.body);
  const { email, password } = req.body || {};

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ msg: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Create a new staff account
// @route   POST /api/users/create-staff
// @access  Private/Owner
export const createStaff = async (req, res) => {
  console.log('Request Body:', req.body);
  const { name, email, password } = req.body || {};

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'STAFF'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(400).json({ msg: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get all staff members
// @route   GET /api/users/staffs
// @access  Private/Owner
export const getStaffs = async (req, res) => {
  try {
    const staffs = await User.find({ role: 'STAFF' }).select('-password');
    res.json(staffs);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Delete a staff account
// @route   DELETE /api/users/:id
// @access  Private/Owner
export const deleteStaff = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user && user.role === 'STAFF') {
      await User.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Staff removed' });
    } else {
      res.status(404).json({ msg: 'Staff not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};
