import { User } from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Configure email service (update with your email provider)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate random 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email with code
export const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please sign up first.',
      });
    }

    // Generate verification code
    const code = generateVerificationCode();
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with verification code
    user = await User.findByIdAndUpdate(
      user._id,
      {
        verificationCode: code,
        verificationCodeExpires: expiresIn,
      },
      { new: true }
    );

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Student Verification Code - Student Deals',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Student Deals - Verification Code</h2>
          <p>Hi ${user.name},</p>
          <p>Your verification code is:</p>
          <h1 style="color: #2563eb; font-size: 48px; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </h1>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email',
      email: user.email,
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending verification code',
    });
  }
};

// Verify email with code
export const verifyEmailCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and code are required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if code is valid and not expired
    if (
      !user.verificationCode ||
      user.verificationCode !== code ||
      new Date() > user.verificationCodeExpires
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code',
      });
    }

    // Update user verification status
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        isVerified: true,
        verificationStatus: 'verified',
        verificationMethod: 'email',
        verificationCode: null,
        verificationCodeExpires: null,
        updatedAt: new Date(),
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error verifying email code:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying email code',
    });
  }
};

// Upload student ID document
export const uploadStudentId = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // In production, upload to cloud storage (AWS S3, Cloudinary, etc.)
    // For now, we'll store the file path
    const studentIdUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        studentIdUrl,
        verificationStatus: 'pending',
        verificationMethod: 'student-id',
        updatedAt: new Date(),
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Student ID uploaded successfully. Awaiting verification.',
      user,
    });
  } catch (error) {
    console.error('Error uploading student ID:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading student ID',
    });
  }
};

// Initiate SheerID verification
export const initiateSheerIdVerification = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { affiliationType, affiliationValue } = req.body;

    if (!userId || !affiliationType || !affiliationValue) {
      return res.status(400).json({
        success: false,
        message: 'User ID, affiliation type, and value are required',
      });
    }

    // SheerID API integration
    const sheerIdUrl = 'https://services.sheerid.com/verification/verify';
    const payload = {
      consumerKey: process.env.SHEERID_KEY,
      consumerSecret: process.env.SHEERID_SECRET,
      affiliationType,
      affiliationValue,
      email: req.body.email,
    };

    // Make request to SheerID API
    const response = await fetch(sheerIdUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok || !data.verified) {
      return res.status(400).json({
        success: false,
        message: 'SheerID verification failed',
        details: data.message,
      });
    }

    // Update user as verified
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isVerified: true,
        verificationStatus: 'verified',
        verificationMethod: 'sheerid',
        sheerIdVerificationId: data.verificationId,
        updatedAt: new Date(),
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Verification successful',
      user,
    });
  } catch (error) {
    console.error('Error with SheerID verification:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error with SheerID verification',
    });
  }
};

// Get verification status
export const getVerificationStatus = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const user = await User.findById(userId).select(
      'isVerified verificationStatus verificationMethod studentIdUrl'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      verificationStatus: user.verificationStatus,
      isVerified: user.isVerified,
      verificationMethod: user.verificationMethod,
      studentIdUrl: user.studentIdUrl,
    });
  } catch (error) {
    console.error('Error getting verification status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting verification status',
    });
  }
};

// Admin: Approve student verification
export const approveStudentVerification = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isVerified: true,
        verificationStatus: 'verified',
        updatedAt: new Date(),
      },
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
      message: 'Student verification approved',
      user,
    });
  } catch (error) {
    console.error('Error approving verification:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error approving verification',
    });
  }
};

// Admin: Reject student verification
export const rejectStudentVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        verificationStatus: 'rejected',
        updatedAt: new Date(),
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Optionally send email to user about rejection
    if (reason) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verification Status Update - Student Deals',
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Verification Not Approved</h2>
            <p>Hi ${user.name},</p>
            <p>Your verification was not approved. Reason:</p>
            <p><strong>${reason}</strong></p>
            <p>Please try again with a clearer document.</p>
          </div>
        `,
      };
      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({
      success: true,
      message: 'Student verification rejected',
      user,
    });
  } catch (error) {
    console.error('Error rejecting verification:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error rejecting verification',
    });
  }
};
