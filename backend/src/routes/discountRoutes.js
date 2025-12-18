import express from 'express';
import {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  getVendorDiscounts,
  updateDiscount,
  deleteDiscount,
  redeemDiscount,
} from '../controllers/discountController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllDiscounts);
router.get('/:id', getDiscountById);
router.post('/', authenticate, createDiscount);
router.get('/vendor/my-discounts', authenticate, getVendorDiscounts);
router.put('/:id', authenticate, updateDiscount);
router.delete('/:id', authenticate, deleteDiscount);
router.post('/:id/redeem', authenticate, redeemDiscount);

export default router;
