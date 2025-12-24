import { supabase } from '../db.js';

// User model functions for Supabase
export class User {
  // Create a new user
  static async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        name: userData.name.trim(),
        role: userData.role || 'student',
        university: userData.university?.trim(),
        company_name: userData.companyName?.trim(),
        company_registration: userData.companyRegistration?.trim(),
        is_verified: userData.isVerified || false,
        verification_status: userData.verificationStatus || 'pending',
        verification_method: userData.verificationMethod || 'email',
        verification_code: userData.verificationCode,
        verification_code_expires: userData.verificationCodeExpires,
        student_id_url: userData.studentIdUrl,
        sheer_id_verification_id: userData.sheerIdVerificationId,
        verification_token: userData.verificationToken,
        verification_token_expires: userData.verificationTokenExpires,
        profile_picture: userData.profilePicture,
        phone_number: userData.phoneNumber?.trim(),
        address: userData.address?.trim(),
        city: userData.city?.trim(),
        state: userData.state?.trim(),
        zip_code: userData.zipCode?.trim(),
        is_active: userData.isActive !== undefined ? userData.isActive : true,
        last_login: userData.lastLogin,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return this.transformData(data);
  }

  // Find user by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.transformData(data);
  }

  // Find user by email
  static async findOne(query) {
    let queryBuilder = supabase.from('users').select('*');

    if (query.email) {
      queryBuilder = queryBuilder.eq('email', query.email.toLowerCase());
    }

    const { data, error } = await queryBuilder.single();

    if (error) return null;
    return this.transformData(data);
  }

  // Find user by email and select password (for authentication)
  static async findOneWithPassword(query) {
    let queryBuilder = supabase.from('users').select('*');

    if (query.email) {
      queryBuilder = queryBuilder.eq('email', query.email.toLowerCase());
    }

    const { data, error } = await queryBuilder.single();

    if (error) return null;
    return this.transformData(data, true); // Include password
  }

  // Update user by ID
  static async findByIdAndUpdate(id, updateData, options = {}) {
    const transformedData = this.transformUpdateData(updateData);

    const { data, error } = await supabase
      .from('users')
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

  // Transform database row to match Mongoose-like structure
  static transformData(data, includePassword = false) {
    if (!data) return null;

    return {
      _id: data.id,
      id: data.id,
      email: data.email,
      password: includePassword ? data.password : undefined,
      name: data.name,
      role: data.role,
      university: data.university,
      companyName: data.company_name,
      companyRegistration: data.company_registration,
      isVerified: data.is_verified,
      verificationStatus: data.verification_status,
      verificationMethod: data.verification_method,
      verificationCode: data.verification_code,
      verificationCodeExpires: data.verification_code_expires,
      studentIdUrl: data.student_id_url,
      sheerIdVerificationId: data.sheer_id_verification_id,
      verificationToken: data.verification_token,
      verificationTokenExpires: data.verification_token_expires,
      profilePicture: data.profile_picture,
      phoneNumber: data.phone_number,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zip_code,
      isActive: data.is_active,
      lastLogin: data.last_login,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  // Transform update data to match database column names
  static transformUpdateData(updateData) {
    const transformed = {};

    if (updateData.email !== undefined) transformed.email = updateData.email.toLowerCase().trim();
    if (updateData.password !== undefined) transformed.password = updateData.password;
    if (updateData.name !== undefined) transformed.name = updateData.name.trim();
    if (updateData.role !== undefined) transformed.role = updateData.role;
    if (updateData.university !== undefined) transformed.university = updateData.university?.trim();
    if (updateData.companyName !== undefined) transformed.company_name = updateData.companyName?.trim();
    if (updateData.companyRegistration !== undefined) transformed.company_registration = updateData.companyRegistration?.trim();
    if (updateData.isVerified !== undefined) transformed.is_verified = updateData.isVerified;
    if (updateData.verificationStatus !== undefined) transformed.verification_status = updateData.verificationStatus;
    if (updateData.verificationMethod !== undefined) transformed.verification_method = updateData.verificationMethod;
    if (updateData.verificationCode !== undefined) transformed.verification_code = updateData.verificationCode;
    if (updateData.verificationCodeExpires !== undefined) transformed.verification_code_expires = updateData.verificationCodeExpires;
    if (updateData.studentIdUrl !== undefined) transformed.student_id_url = updateData.studentIdUrl;
    if (updateData.sheerIdVerificationId !== undefined) transformed.sheer_id_verification_id = updateData.sheerIdVerificationId;
    if (updateData.verificationToken !== undefined) transformed.verification_token = updateData.verificationToken;
    if (updateData.verificationTokenExpires !== undefined) transformed.verification_token_expires = updateData.verificationTokenExpires;
    if (updateData.profilePicture !== undefined) transformed.profile_picture = updateData.profilePicture;
    if (updateData.phoneNumber !== undefined) transformed.phone_number = updateData.phoneNumber?.trim();
    if (updateData.address !== undefined) transformed.address = updateData.address?.trim();
    if (updateData.city !== undefined) transformed.city = updateData.city?.trim();
    if (updateData.state !== undefined) transformed.state = updateData.state?.trim();
    if (updateData.zipCode !== undefined) transformed.zip_code = updateData.zipCode?.trim();
    if (updateData.isActive !== undefined) transformed.is_active = updateData.isActive;
    if (updateData.lastLogin !== undefined) transformed.last_login = updateData.lastLogin;

    return transformed;
  }
}
