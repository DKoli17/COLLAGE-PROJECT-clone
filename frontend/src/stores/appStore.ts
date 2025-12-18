import { create } from 'zustand';
import { Discount, VendorDiscount } from '../types';

interface AppState {
  verificationStatus: 'not-verified' | 'pending' | 'verified';
  discounts: Discount[];
  vendorDiscounts: VendorDiscount[];
  setVerificationStatus: (status: 'not-verified' | 'pending' | 'verified') => void;
  markDiscountAsUsed: (id: string, code: string) => void;
  addVendorDiscount: (discount: Omit<VendorDiscount, 'id' | 'createdAt' | 'usageCount' | 'totalViews'>) => void;
  updateVendorDiscount: (id: string, updates: Partial<VendorDiscount>) => void;
  deleteVendorDiscount: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  verificationStatus: 'not-verified',
  vendorDiscounts: [
    {
      id: 'v1',
      vendorId: 'vendor1',
      brand: 'Tech Gadgets Pro',
      discount: '25% off',
      description: 'Get 25% off on all laptops and accessories for students',
      category: 'Technology',
      expiryDays: 30,
      isExpired: false,
      isUsed: false,
      termsAndConditions: 'Valid student ID required',
      createdAt: new Date().toISOString(),
      usageCount: 45,
      totalViews: 230,
      isActive: true,
    },
    {
      id: 'v2',
      vendorId: 'vendor1',
      brand: 'Fashion Forward',
      discount: '30% off',
      description: 'Exclusive student discount on all clothing and footwear',
      category: 'Fashion',
      expiryDays: 15,
      isExpired: false,
      isUsed: false,
      termsAndConditions: 'Cannot be combined with other offers',
      createdAt: new Date().toISOString(),
      usageCount: 78,
      totalViews: 310,
      isActive: true,
    },
    {
      id: 'v3',
      vendorId: 'vendor1',
      brand: 'Pizza Paradise',
      discount: 'Buy 1 Get 1',
      description: 'Buy one large pizza, get one medium free for students',
      category: 'Food',
      expiryDays: 5,
      isExpired: false,
      isUsed: false,
      termsAndConditions: 'Dine-in only',
      createdAt: new Date().toISOString(),
      usageCount: 120,
      totalViews: 450,
      isActive: true,
    },
  ],
  discounts: [
    {
      id: '1',
      brand: 'Apple',
      discount: '15% off',
      description: 'Get 15% off on MacBooks, iPads, and accessories',
      category: 'Technology',
      expiryDays: 45,
      isExpired: false,
      isUsed: false,
    },
    {
      id: '2',
      brand: 'Spotify',
      discount: '50% off',
      description: 'Premium subscription at half price for students',
      category: 'Entertainment',
      expiryDays: 90,
      isExpired: false,
      isUsed: false,
    },
    {
      id: '3',
      brand: 'Nike',
      discount: '20% off',
      description: 'Exclusive student discount on all footwear and apparel',
      category: 'Fashion',
      expiryDays: 30,
      isExpired: false,
      isUsed: false,
    },
    {
      id: '4',
      brand: 'Chipotle',
      discount: 'Free drink',
      description: 'Free fountain drink with any entrée purchase',
      category: 'Food',
      expiryDays: 15,
      isExpired: false,
      isUsed: false,
    },
    {
      id: '5',
      brand: 'Adobe',
      discount: '60% off',
      description: 'Creative Cloud All Apps plan for students',
      category: 'Technology',
      expiryDays: 60,
      isExpired: false,
      isUsed: false,
    },
    {
      id: '6',
      brand: 'Amazon Prime',
      discount: '50% off',
      description: 'Prime Student membership with exclusive benefits',
      category: 'Entertainment',
      expiryDays: 120,
      isExpired: false,
      isUsed: false,
    },
  ],
  setVerificationStatus: (status) => set({ verificationStatus: status }),
  markDiscountAsUsed: (id, code) =>
    set((state) => ({
      discounts: state.discounts.map((d) =>
        d.id === id ? { ...d, isUsed: true, code } : d
      ),
    })),
  
  addVendorDiscount: (discount) =>
    set((state) => ({
      vendorDiscounts: [
        ...state.vendorDiscounts,
        {
          ...discount,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          usageCount: 0,
          totalViews: 0,
        },
      ],
    })),

  updateVendorDiscount: (id, updates) =>
    set((state) => ({
      vendorDiscounts: state.vendorDiscounts.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),

  deleteVendorDiscount: (id) =>
    set((state) => ({
      vendorDiscounts: state.vendorDiscounts.filter((d) => d.id !== id),
    })),
}));
