import { User } from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching users',
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user',
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['student', 'vendor', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'User role updated',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating user role',
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'User verified successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying user',
    });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'User deactivated',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deactivating user',
    });
  }
};
