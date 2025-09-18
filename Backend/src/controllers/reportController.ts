import { Request, Response } from 'express';
import { Report } from '@/models/Report';
import { Interview } from '@/models/Interview';
import { logger } from '@/utils/logger';

import { IAuthRequest } from '@/types';

// @desc    Generate report for interview
// @route   POST /api/reports/generate/:interviewId
// @access  Private
export const generateReport = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    const interview = await Interview.findById(req.params.interviewId)
      .populate('interviewer', 'name')
      .populate('candidate', 'name');

    if (!interview) {
      res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
      return;
    }

    // Check authorization: allow interviewer who owns the interview or admin
    if (req.user?.role === 'interviewer' && interview.interviewer.toString() !== req.user?._id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to generate report for this interview'
      });
      return;
    }

    // Check if report already exists
    const existingReport = await Report.findOne({ interview: req.params.interviewId as string });
    if (existingReport) {
      res.json({
        success: true,
        data: existingReport
      });
      return;
    }

    // Calculate statistics
    const detectionEvents = interview.detectionEvents;
    const totalFocusLossEvents = detectionEvents.filter(e => e.type === 'focus_lost').length;
    const totalFaceAbsenceEvents = detectionEvents.filter(e => e.type === 'face_absent').length;
    const totalMultipleFacesEvents = detectionEvents.filter(e => e.type === 'multiple_faces').length;
    const totalPhoneDetections = detectionEvents.filter(e => e.type === 'phone_detected').length;
    const totalNotesDetections = detectionEvents.filter(e => e.type === 'notes_detected').length;
    const totalDeviceDetections = detectionEvents.filter(e => e.type === 'device_detected').length;

    // Calculate deductions
    const deductions = {
      focusLoss: totalFocusLossEvents * 2,
      faceAbsence: totalFaceAbsenceEvents * 5,
      multipleFaces: totalMultipleFacesEvents * 10,
      phoneDetections: totalPhoneDetections * 15,
      notesDetections: totalNotesDetections * 20,
      deviceDetections: totalDeviceDetections * 10
    };

    const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);
    const integrityScore = Math.max(0, 100 - totalDeductions);

    // Calculate interview duration
    const interviewDuration = interview.duration; // in minutes

    // Generate summary
    const summary = generateSummary({
      totalFocusLossEvents,
      totalFaceAbsenceEvents,
      totalMultipleFacesEvents,
      totalPhoneDetections,
      totalNotesDetections,
      totalDeviceDetections,
      integrityScore,
      interviewDuration
    });

    // Generate recommendations
    const recommendations = generateRecommendations({
      totalFocusLossEvents,
      totalFaceAbsenceEvents,
      totalMultipleFacesEvents,
      totalPhoneDetections,
      totalNotesDetections,
      totalDeviceDetections,
      integrityScore
    });

    // Create report
    const report = await Report.create({
      interview: req.params.interviewId,
      candidateName: interview.candidate,
      interviewerName: interview.interviewer,
      interviewDuration,
      totalFocusLossEvents,
      totalFaceAbsenceEvents,
      totalMultipleFacesEvents,
      totalPhoneDetections,
      totalNotesDetections,
      totalDeviceDetections,
      integrityScore,
      deductions,
      summary,
      recommendations
    });

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get report by interview ID
// @route   GET /api/reports/interview/:interviewId
// @access  Private
export const getReportByInterview = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    const report = await Report.findOne({ interview: req.params.interviewId })
      .populate('interview');

    if (!report) {
      res.status(404).json({
        success: false,
        message: 'Report not found'
      });
      return;
    }

    // Check authorization
    const interview = await Interview.findById(req.params.interviewId);
    if (!interview) {
      res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
      return;
    }

    if (req.user?.role === 'interviewer' && interview.interviewer.toString() !== req.user?._id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this report'
      });
      return;
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
export const getReports = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    let query: any = {};

    // Filter by role
    if (req.user.role === 'interviewer') {
      const interviews = await Interview.find({ interviewer: req.user._id }).select('_id');
      query.interview = { $in: interviews.map(i => i._id) };
    }

    const reports = await Report.find(query)
      .populate('interview')
      .sort({ generatedAt: -1 });

    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    logger.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper function to generate summary
const generateSummary = (stats: any): string => {
  const { integrityScore, interviewDuration, totalFocusLossEvents, totalPhoneDetections, totalNotesDetections } = stats;
  
  let summary = `Interview completed with an integrity score of ${integrityScore}/100. `;
  summary += `The interview lasted ${interviewDuration} minutes. `;
  
  if (totalFocusLossEvents > 0) {
    summary += `The candidate lost focus ${totalFocusLossEvents} times during the interview. `;
  }
  
  if (totalPhoneDetections > 0) {
    summary += `A mobile phone was detected ${totalPhoneDetections} times. `;
  }
  
  if (totalNotesDetections > 0) {
    summary += `Notes or books were detected ${totalNotesDetections} times. `;
  }
  
  if (integrityScore >= 90) {
    summary += 'Overall, the candidate maintained good integrity throughout the interview.';
  } else if (integrityScore >= 70) {
    summary += 'The candidate showed some concerning behavior but maintained reasonable integrity.';
  } else {
    summary += 'The candidate showed significant integrity concerns during the interview.';
  }
  
  return summary;
};

// Helper function to generate recommendations
const generateRecommendations = (stats: any): string[] => {
  const recommendations: string[] = [];
  const { integrityScore, totalFocusLossEvents, totalPhoneDetections, totalNotesDetections, totalFaceAbsenceEvents } = stats;
  
  if (totalFocusLossEvents > 5) {
    recommendations.push('Consider additional focus training for the candidate');
  }
  
  if (totalPhoneDetections > 0) {
    recommendations.push('Implement stricter phone detection policies');
  }
  
  if (totalNotesDetections > 0) {
    recommendations.push('Review candidate preparation guidelines regarding study materials');
  }
  
  if (totalFaceAbsenceEvents > 3) {
    recommendations.push('Investigate technical issues or candidate behavior during face absence periods');
  }
  
  if (integrityScore < 70) {
    recommendations.push('Consider additional proctoring measures for future interviews');
    recommendations.push('Review interview environment setup with the candidate');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('No specific recommendations - candidate maintained good integrity');
  }
  
  return recommendations;
};
