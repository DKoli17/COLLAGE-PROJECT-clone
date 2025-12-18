import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'vendor', 'admin'],
      default: 'student',
    },
    university: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    companyRegistration: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verificationMethod: {
      type: String,
      enum: ['email', 'student-id', 'sheerid'],
      default: 'email',
    },
    verificationCode: String,
    verificationCodeExpires: Date,
    studentIdUrl: {
      type: String,
      default: null,
    },
    sheerIdVerificationId: String,
    verificationToken: String,
    verificationTokenExpires: Date,
    profilePicture: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
