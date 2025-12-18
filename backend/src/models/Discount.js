import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
    },
    discount: {
      type: String,
      required: [true, 'Discount percentage is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['electronics', 'fashion', 'food', 'entertainment', 'education', 'health', 'travel', 'other'],
      default: 'other',
    },
    code: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    termsAndConditions: {
      type: String,
      required: true,
    },
    expiryDays: {
      type: Number,
      default: 30,
    },
    expiryDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    usedBy: [
      {
        studentId: mongoose.Schema.Types.ObjectId,
        usedAt: Date,
      },
    ],
    image: String,
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

// Auto-calculate expiry date before saving
discountSchema.pre('save', function (next) {
  if (!this.expiryDate) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + this.expiryDays);
    this.expiryDate = expiryDate;
  }
  
  if (this.expiryDate < new Date()) {
    this.isExpired = true;
  }
  next();
});

export const Discount = mongoose.model('Discount', discountSchema);
