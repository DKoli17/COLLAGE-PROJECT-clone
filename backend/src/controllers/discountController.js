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

    // Note: Supabase doesn't support regex search like MongoDB
    // For now, we'll skip the search functionality or implement it differently
    // if (search) {
    //   query.$or = [
    //     { brand: { $regex: search, $options: 'i' } },
    //     { description: { $regex: search, $options: 'i' } },
    //   ];
    // }

    const discounts = await Discount.find(query, {
      skip: skip,
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    });

    const total = await Discount.countDocuments(query);

    // Add vendor information manually since Supabase doesn't support populate
    const discountsWithVendor = await Promise.all(
      discounts.map(async (discount) => {
        const vendor = await User.findById(discount.vendorId);
        return {
          ...discount,
          vendor: vendor ? {
            name: vendor.name,
            email: vendor.email,
            companyName: vendor.companyName
          } : null
        };
      })
    );

    res.status(200).json({
      success: true,
      count: discounts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      discounts: discountsWithVendor,
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
    // First increment totalViews
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found',
      });
    }

    // Update totalViews
    const updatedDiscount = await Discount.findByIdAndUpdate(req.params.id, {
      totalViews: (discount.totalViews || 0) + 1
    });

    // Add vendor information manually
    const vendor = await User.findById(updatedDiscount.vendorId);
    const discountWithVendor = {
      ...updatedDiscount,
      vendor: vendor ? {
        name: vendor.name,
        email: vendor.email,
        companyName: vendor.companyName
      } : null
    };

    res.status(200).json({
      success: true,
      discount: discountWithVendor,
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

    const discounts = await Discount.find({ vendorId }, {
      skip: skip,
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    });

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

    // Check if already used by querying discount_usage table
    const { data: existingUsage, error: usageError } = await supabase
      .from('discount_usage')
      .select('*')
      .eq('discount_id', id)
      .eq('student_id', studentId)
      .single();

    if (usageError && usageError.code !== 'PGRST116') { // PGRST116 is "not found"
      throw usageError;
    }

    if (existingUsage) {
      return res.status(400).json({
        success: false,
        message: 'You have already redeemed this discount',
      });
    }

    // Add to discount_usage table
    const { error: insertError } = await supabase
      .from('discount_usage')
      .insert([{
        discount_id: id,
        student_id: studentId,
        used_at: new Date().toISOString(),
      }]);

    if (insertError) throw insertError;

    // Increment usage count
    await Discount.findByIdAndUpdate(id, {
      usageCount: (discount.usageCount || 0) + 1
    });

    // Get updated discount
    const updatedDiscount = await Discount.findById(id);

    res.status(200).json({
      success: true,
      message: 'Discount redeemed successfully',
      discount: updatedDiscount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error redeeming discount',
    });
  }
};
