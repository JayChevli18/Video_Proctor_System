import express from 'express';
import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword
} from '@/controllers/authController';
import { protect } from '@/middleware/auth';
import { validateBody } from '@/middleware/validation';
import { registerSchema, loginSchema, updateUserSchema, updatePasswordSchema } from '@/validation/schemas';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, validateBody(updateUserSchema), updateDetails);
router.put('/updatepassword', protect, validateBody(updatePasswordSchema), updatePassword);

export default router;
