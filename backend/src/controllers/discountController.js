import { Discount } from '../models/Discount.js';
import { User } from '../models/User.js';

export const createDiscount = async (req, res) => {
  try {
    const { brand, discount, description, category, code, termsAndConditions, expiryDays, image } = req.body;
    const vendorId = req.user.userId;

    if (!brand || !discount || !description || !termsAndConditions) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if vendor is verified
    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== 'vendor') {
      return res.status(403).json({
        success: false,
        message: 'Only verified vendors can create discounts',
      });
    }

    const discountDoc = await Discount.create({
      vendorId,
      brand,
      discount,
      description,
      category,
      code,
      termsAndConditions,
      expiryDays: expiryDays || 30,
      image,
    });

    res.status(201).json({
      success: true,
      message: 'Discount created successfully',
      discount: discountDoc,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating discount',
    });
  }
};

export const getAllDiscounts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true, isExpired: false };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const discounts = await Discount.find(query)
      .populate('vendorId', 'name email companyName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Discount.countDocuments(query);

    res.status(200).json({
      success: true,
      count: discounts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      discounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching discounts',
    });
  }
};

export const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      { $inc: { totalViews: 1 } },
      { new: true }
    ).populate('vendorId', 'name email companyName');

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found',
      });
    }

    res.status(200).json({
      success: true,
      discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching discount',
    });
  }
};

export const getVendorDiscounts = async (req, res) => {
  try {
    const vendorId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const discounts = await Discount.find({ vendorId })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Discount.countDocuments({ vendorId });

    res.status(200).json({
      success: true,
      count: discounts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      discounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching vendor discounts',
    });
  }
};

export const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.user.userId;
    const updates = req.body;

    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found',
      });
    }

    if (discount.vendorId.toString() !== vendorId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this discount',
      });
    }

    const updatedDiscount = await Discount.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: 'Discount updated successfully',
      discount: updatedDiscount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating discount',
    });
  }
};

export const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.user.userId;

    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found',
      });
    }

    if (discount.vendorId.toString() !== vendorId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this discount',
      });
    }

    await Discount.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Discount deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting discount',
    });
  }
};

export const redeemDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.userId;

    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found',
      });
    }

    if (discount.isExpired || !discount.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This discount is no longer available',
      });
    }

    // Check if already used
    const alreadyUsed = discount.usedBy.some((usage) => usage.studentId.toString() === studentId);
    if (alreadyUsed) {
      return res.status(400).json({
        success: false,
        message: 'You have already redeemed this discount',
      });
    }

    discount.usageCount += 1;
    discount.usedBy.push({
      studentId,
      usedAt: new Date(),
    });

    await discount.save();

    res.status(200).json({
      success: true,
      message: 'Discount redeemed successfully',
      discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error redeeming discount',
    });
  }
};
