import { Response } from 'express';
import { User } from '@/models/User';
import { logger } from '@/utils/logger';

import { IAuthRequest } from '@/types';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password');

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Check authorization
    if (req?.user?.role !== 'admin' && req?.user?._id !== req?.params?.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this user'
      });
      return;
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Check authorization
    if (req?.user?.role !== 'admin' && req?.user?._id !== req?.params?.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
      return;
    }

    // Don't allow password updates through this route
    if (req.body.password) {
      delete req.body.password;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get users by role
// @route   GET /api/users/role/:role
// @access  Private
export const getUsersByRole = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.params;
    
    if (!['interviewer', 'candidate', 'admin'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
      return;
    }

    const users = await User.find({ role }).select('-password');

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    logger.error('Get users by role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
