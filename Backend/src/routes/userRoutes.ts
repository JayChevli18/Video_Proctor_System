import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole
} from '@/controllers/userController';
import { protect, authorize } from '@/middleware/auth';

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/role/:role')
  .get(getUsersByRole);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('admin'), deleteUser);

export default router;
