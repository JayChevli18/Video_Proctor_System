import express from 'express';
import {
  getInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview,
  startInterview,
  endInterview,
  addDetectionEvent,
  uploadInterviewVideo,
  processFrameRealtime
} from '@/controllers/interviewController';
import { protect, authorize } from '@/middleware/auth';
import { upload } from '@/services/videoProcessingService';

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
  .get(getInterviews)
  .post(authorize('interviewer', 'admin'), createInterview);

router.route('/:id')
  .get(getInterview)
  .put(authorize('interviewer', 'admin'), updateInterview)
  .delete(authorize('interviewer', 'admin'), deleteInterview);

router.route('/:id/start')
  .put(authorize('interviewer', 'admin'), startInterview);

router.route('/:id/end')
  .put(authorize('interviewer', 'admin'), endInterview);

router.route('/:id/detection')
  .post(authorize('interviewer', 'admin'), addDetectionEvent);

// MVP endpoints for uploading and real-time frame processing
router.route('/:id/upload')
  .post(authorize('interviewer', 'admin'), upload.single('video'), uploadInterviewVideo);

router.route('/:id/frame')
  .post(authorize('interviewer', 'admin'), processFrameRealtime);

export default router;
