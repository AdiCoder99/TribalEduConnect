import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Helper to generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'mota_sih_hackathon_super_secret_key_2026', {
    expiresIn: '7d'
  });
};

// 1. REGISTER USER
export const register = async (req, res) => {
  const { name, email, password, phone, stCertificateNo, state } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'STUDENT',
      stCertificateNo,
      state
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        stCertificateNo: user.stCertificateNo,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. LOGIN USER
export const login = async (req, res) => {
  const { email, role, password } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ success: false, error: 'Please provide email, role, and password.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        stCertificateNo: user.stCertificateNo
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. GET CURRENT LOGGED-IN USER
export const me = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

export default router;