import { User } from '../models/User.js';
import { Discount } from '../models/Discount.js';

export const getPendingVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor', isVerified: false }).select('-password');

    res.status(200).json({
      success: true,
      count: vendors.length,
      vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching pending vendors',
    });
  }
};

export const verifyVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isVerified: true, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor verified successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying vendor',
    });
  }
};

export const rejectVendor = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Vendor rejected and removed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error rejecting vendor',
    });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const verifiedVendors = await User.countDocuments({ role: 'vendor', isVerified: true });
    const totalDiscounts = await Discount.countDocuments();
    const activeDiscounts = await Discount.countDocuments({ isActive: true, isExpired: false });

    // Calculate total redemptions
    const discounts = await Discount.find();
    const totalRedemptions = discounts.reduce((sum, d) => sum + d.usageCount, 0);
    const totalViews = discounts.reduce((sum, d) => sum + d.totalViews, 0);

    res.status(200).json({
      success: true,
      analytics: {
        users: {
          total: totalUsers,
          students: totalStudents,
          vendors: totalVendors,
          verifiedVendors,
        },
        discounts: {
          total: totalDiscounts,
          active: activeDiscounts,
          totalRedemptions,
          totalViews,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching analytics',
    });
  }
};

export const getVendorAnalytics = async (req, res) => {
  try {
    const vendorId = req.user.userId;

    const vendorDiscounts = await Discount.find({ vendorId });
    const totalDiscounts = vendorDiscounts.length;
    const activeDiscounts = vendorDiscounts.filter((d) => d.isActive && !d.isExpired).length;
    const totalRedemptions = vendorDiscounts.reduce((sum, d) => sum + d.usageCount, 0);
    const totalViews = vendorDiscounts.reduce((sum, d) => sum + d.totalViews, 0);

    // Group by category
    const byCategory = {};
    vendorDiscounts.forEach((discount) => {
      byCategory[discount.category] = (byCategory[discount.category] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      analytics: {
        totalDiscounts,
        activeDiscounts,
        totalRedemptions,
        totalViews,
        averageViews: totalDiscounts > 0 ? (totalViews / totalDiscounts).toFixed(2) : 0,
        averageRedemptions: totalDiscounts > 0 ? (totalRedemptions / totalDiscounts).toFixed(2) : 0,
        byCategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching vendor analytics',
    });
  }
};
