import express from 'express';
import {
  generateReport,
  getReportByInterview,
  getReports
} from '@/controllers/reportController';
import { protect } from '@/middleware/auth';

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
  .get(getReports);

router.route('/generate/:interviewId')
  .post(generateReport);

router.route('/interview/:interviewId')
  .get(getReportByInterview);

export default router;
