import supabase from '../db.js';

// Discount model functions for Supabase
export class Discount {
  // Create a new discount
  static async create(discountData) {
    // Calculate expiry date if not provided
    let expiryDate = discountData.expiryDate;
    if (!expiryDate && discountData.expiryDays) {
      expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + discountData.expiryDays);
    }

    // Check if expired
    const isExpired = expiryDate && expiryDate < new Date();

    const { data, error } = await supabase
      .from('discounts')
      .insert([{
        vendor_id: discountData.vendorId,
        brand: discountData.brand?.trim(),
        discount: discountData.discount?.trim(),
        description: discountData.description,
        category: discountData.category || 'other',
        code: discountData.code?.trim()?.toUpperCase(),
        terms_and_conditions: discountData.termsAndConditions,
        expiry_days: discountData.expiryDays || 30,
        expiry_date: expiryDate?.toISOString(),
        is_active: discountData.isActive !== undefined ? discountData.isActive : true,
        is_expired: isExpired || false,
        usage_count: discountData.usageCount || 0,
        total_views: discountData.totalViews || 0,
        image: discountData.image,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return this.transformData(data);
  }

  // Find discount by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.transformData(data);
  }

  // Find discounts with query
  static async find(query = {}, options = {}) {
    let queryBuilder = supabase.from('discounts').select('*');

    // Apply filters
    if (query.vendorId) {
      queryBuilder = queryBuilder.eq('vendor_id', query.vendorId);
    }
    if (query.category) {
      queryBuilder = queryBuilder.eq('category', query.category);
    }
    if (query.isActive !== undefined) {
      queryBuilder = queryBuilder.eq('is_active', query.isActive);
    }
    if (query.isExpired !== undefined) {
      queryBuilder = queryBuilder.eq('is_expired', query.isExpired);
    }
    if (query.code) {
      queryBuilder = queryBuilder.eq('code', query.code.toUpperCase());
    }

    // Apply sorting
    if (options.sort) {
      Object.entries(options.sort).forEach(([field, order]) => {
        const dbField = this.transformFieldName(field);
        queryBuilder = queryBuilder.order(dbField, { ascending: order === 1 });
      });
    } else {
      queryBuilder = queryBuilder.order('created_at', { ascending: false });
    }

    // Apply pagination
    if (options.skip) {
      queryBuilder = queryBuilder.range(options.skip, options.skip + (options.limit || 10) - 1);
    } else if (options.limit) {
      queryBuilder = queryBuilder.limit(options.limit);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data.map(item => this.transformData(item));
  }

  // Find one discount
  static async findOne(query) {
    const results = await this.find(query, { limit: 1 });
    return results.length > 0 ? results[0] : null;
  }

  // Update discount by ID
  static async findByIdAndUpdate(id, updateData, options = {}) {
    const transformedData = this.transformUpdateData(updateData);

    const { data, error } = await supabase
      .from('discounts')
      .update({
        ...transformedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.transformData(data);
  }

  // Delete discount by ID
  static async findByIdAndDelete(id) {
    const { data, error } = await supabase
      .from('discounts')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.transformData(data);
  }

  // Count documents
  static async countDocuments(query = {}) {
    let queryBuilder = supabase.from('discounts').select('*', { count: 'exact', head: true });

    // Apply filters
    if (query.vendorId) {
      queryBuilder = queryBuilder.eq('vendor_id', query.vendorId);
    }
    if (query.category) {
      queryBuilder = queryBuilder.eq('category', query.category);
    }
    if (query.isActive !== undefined) {
      queryBuilder = queryBuilder.eq('is_active', query.isActive);
    }
    if (query.isExpired !== undefined) {
      queryBuilder = queryBuilder.eq('is_expired', query.isExpired);
    }

    const { count, error } = await queryBuilder;
    if (error) throw error;
    return count;
  }

  // Increment usage count
  static async incrementUsageCount(id) {
    const { data, error } = await supabase.rpc('increment_discount_usage', { discount_id: id });
    if (error) throw error;
    return data;
  }

  // Transform database row to match Mongoose-like structure
  static transformData(data) {
    if (!data) return null;

    return {
      _id: data.id,
      id: data.id,
      vendorId: data.vendor_id,
      brand: data.brand,
      discount: data.discount,
      description: data.description,
      category: data.category,
      code: data.code,
      termsAndConditions: data.terms_and_conditions,
      expiryDays: data.expiry_days,
      expiryDate: data.expiry_date,
      isActive: data.is_active,
      isExpired: data.is_expired,
      usageCount: data.usage_count,
      totalViews: data.total_views,
      image: data.image,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  // Transform update data to match database column names
  static transformUpdateData(updateData) {
    const transformed = {};

    if (updateData.vendorId !== undefined) transformed.vendor_id = updateData.vendorId;
    if (updateData.brand !== undefined) transformed.brand = updateData.brand?.trim();
    if (updateData.discount !== undefined) transformed.discount = updateData.discount?.trim();
    if (updateData.description !== undefined) transformed.description = updateData.description;
    if (updateData.category !== undefined) transformed.category = updateData.category;
    if (updateData.code !== undefined) transformed.code = updateData.code?.trim()?.toUpperCase();
    if (updateData.termsAndConditions !== undefined) transformed.terms_and_conditions = updateData.termsAndConditions;
    if (updateData.expiryDays !== undefined) transformed.expiry_days = updateData.expiryDays;
    if (updateData.expiryDate !== undefined) transformed.expiry_date = updateData.expiryDate?.toISOString();
    if (updateData.isActive !== undefined) transformed.is_active = updateData.isActive;
    if (updateData.isExpired !== undefined) transformed.is_expired = updateData.isExpired;
    if (updateData.usageCount !== undefined) transformed.usage_count = updateData.usageCount;
    if (updateData.totalViews !== undefined) transformed.total_views = updateData.totalViews;
    if (updateData.image !== undefined) transformed.image = updateData.image;

    return transformed;
  }

  // Transform field name to database column name
  static transformFieldName(field) {
    const fieldMap = {
      vendorId: 'vendor_id',
      termsAndConditions: 'terms_and_conditions',
      expiryDays: 'expiry_days',
      expiryDate: 'expiry_date',
      isActive: 'is_active',
      isExpired: 'is_expired',
      usageCount: 'usage_count',
      totalViews: 'total_views',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };
    return fieldMap[field] || field;
  }
}
