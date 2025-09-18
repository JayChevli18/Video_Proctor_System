import { Response } from 'express';
import { Interview } from '@/models/Interview';
import { logger } from '@/utils/logger';
import { io } from '@/server';
import { IAuthRequest, IDetectionEvent, IDetectionResult } from '@/types';
import { upload as videoUpload, videoProcessingService } from '@/services/videoProcessingService';
import { computerVisionService } from '@/services/computerVisionService';
import { detectionStateService } from '@/services/detectionStateService';

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Private
export const getInterviews = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    let query: any = {};

    // Filter by role
    if (req?.user?.role === 'interviewer') {
      query.interviewer = req?.user?._id;
    } else if (req?.user?.role === 'candidate') {
      query.candidate = req?.user?._id;
    }

    const interviews = await Interview.find(query)
      .populate('interviewer', 'name email')
      .populate('candidate', 'name email')
      .sort({ scheduledAt: -1 });

    res.json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error) {
    logger.error('Get interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single interview
// @route   GET /api/interviews/:id
// @access  Private
export const getInterview = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const interview = await Interview.findById(req.params.id as string)
      .populate('interviewer', 'name email')
      .populate('candidate', 'name email');

    if (!interview) {
      res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
      return;
    }

    // Check if user has access to this interview
    if (req?.user?.role === 'interviewer' && interview.interviewer.toString() !== req?.user?._id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview'
      });
      return;
    }

    if (req?.user?.role === 'candidate' && interview.candidate.toString() !== req?.user?._id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview'
      });
      return;
    }

    res.json({
      success: true,
      data: interview
    });
  } catch (error) {
    logger.error('Get interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new interview
// @route   POST /api/interviews
// @access  Private (Interviewer/Admin only)
export const createInterview = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    // Add user to req.body
    (req as any).body.interviewer = req?.user?._id;

    const interview = await Interview.create((req as any).body);

    // Populate the created interview
    const populatedInterview = await Interview.findById(interview._id)
      .populate('interviewer', 'name email')
      .populate('candidate', 'name email');

    res.status(201).json({
      success: true,
      data: populatedInterview
    });
  } catch (error) {
    logger.error('Create interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private
export const updateInterview = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    let interview = await Interview.findById(req?.params?.id);

    if (!interview) {
      res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
      return;
    }

    // Check authorization
    if ((req?.user?.role === 'interviewer') && interview.interviewer.toString() !== req?.user?._id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this interview'
      });
      return;
    }

    interview = await Interview.findByIdAndUpdate(req?.params?.id, req?.body, {
      new: true,
      runValidators: true,
    }).populate('interviewer', 'name email').populate('candidate', 'name email');

    res.json({
      success: true,
      data: interview
    });
  } catch (error) {
    logger.error('Update interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private
export const deleteInterview = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const interview = await Interview.findById(req?.params?.id);

    if (!interview) {
      res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
      return;
    }

    // Check authorization
    if ((req?.user?.role === 'interviewer') && interview.interviewer.toString() !== req?.user?._id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this interview'
      });
      return;
    }

    await interview.deleteOne();

    res.json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    logger.error('Delete interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Start interview
// @route   PUT /api/interviews/:id/start
// @access  Private
export const startInterview = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const interview = await Interview.findById(req?.params?.id);

    if (!interview) {
      res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
      return;
    }

    // Check authorization
    if (interview.interviewer.toString() !== req?.user?._id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to start this interview'
      });
      return;
    }

    interview.status = 'in-progress';
    await interview.save();

    // Emit event to all clients in the interview room
    io.to(req?.params?.id).emit('interview-started', {
      interviewId: req?.params?.id,
      status: 'in-progress',
      startedAt: new Date()
    });

    res.json({
      success: true,
      data: interview
    });
  } catch (error) {
    logger.error('Start interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    End interview
// @route   PUT /api/interviews/:id/end
// @access  Private
export const endInterview = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const interview = await Interview.findById(req?.params?.id);

    if (!interview) {
      res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
      return;
    }

    // Check authorization
    if (interview.interviewer.toString() !== req?.user?._id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to end this interview'
      });
      return;
    }

    interview.status = 'completed';
    await interview.save();

    // Emit event to all clients in the interview room
    io.to(req?.params?.id).emit('interview-ended', {
      interviewId: req?.params?.id,
      status: 'completed',
      endedAt: new Date()
    });

    res.json({
      success: true,
      data: interview
    });
  } catch (error) {
    logger.error('End interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add detection event
// @route   POST /api/interviews/:id/detection
// @access  Private
export const addDetectionEvent = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const interview = await Interview.findById(req?.params?.id);

    if (!interview) {
      res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
      return;
    }

    const detectionEvent: IDetectionEvent = {
      type: req.body.type,
      timestamp: new Date(req.body.timestamp),
      duration: req.body.duration,
      confidence: req.body.confidence,
      description: req.body.description,
      severity: req.body.severity || 'medium'
    };

    interview.detectionEvents.push(detectionEvent);

    // Calculate integrity score based on detection events
    let deductions = 0;
    interview.detectionEvents.forEach(event => {
      switch (event.type) {
        case 'focus_lost':
          deductions += 2;
          break;
        case 'face_absent':
          deductions += 5;
          break;
        case 'multiple_faces':
          deductions += 10;
          break;
        case 'phone_detected':
          deductions += 15;
          break;
        case 'notes_detected':
          deductions += 20;
          break;
        case 'device_detected':
          deductions += 10;
          break;
      }
    });

    interview.integrityScore = Math.max(0, 100 - deductions);
    await interview.save();

    // Emit real-time detection event
    io.to(req.params.id).emit('detection-event', {
      interviewId: req.params.id,
      event: detectionEvent,
      integrityScore: interview.integrityScore
    });

    res.json({
      success: true,
      data: detectionEvent,
      integrityScore: interview.integrityScore
    });
  } catch (error) {
    logger.error('Add detection event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper: recompute integrity score based on all detection events
const recomputeIntegrity = (events: IDetectionEvent[]): number => {
  let deductions = 0;
  events.forEach(event => {
    switch (event.type) {
      case 'focus_lost':
        deductions += 2; break;
      case 'face_absent':
        deductions += 5; break;
      case 'multiple_faces':
        deductions += 10; break;
      case 'phone_detected':
        deductions += 15; break;
      case 'notes_detected':
        deductions += 20; break;
      case 'device_detected':
        deductions += 10; break;
    }
  });
  return Math.max(0, 100 - deductions);
};

// Helper: persist detection events and emit socket updates
const persistAndEmitDetections = async (
  interviewId: string,
  newEvents: IDetectionResult[]
): Promise<{ saved: IDetectionEvent[]; integrityScore: number }> => {
  const interview = await Interview.findById(interviewId);
  if (!interview) {
    throw new Error('Interview not found');
  }

  const savedEvents: IDetectionEvent[] = [];
  for (const d of newEvents) {
    const detectionEvent: IDetectionEvent = {
      type: d.type,
      timestamp: d.timestamp || new Date(),
      duration: d.duration || 0,
      confidence: d.confidence,
      description: d.description,
      severity: d.severity || 'medium'
    };
    interview.detectionEvents.push(detectionEvent);
    savedEvents.push(detectionEvent);

    // Emit per-event for realtime UI
    io.to(interviewId).emit('detection-event', {
      interviewId,
      event: detectionEvent
    });
  }

  interview.integrityScore = recomputeIntegrity(interview.detectionEvents);
  await interview.save();

  return { saved: savedEvents, integrityScore: interview.integrityScore };
};

// @desc    Upload an interview video and process it (MVP)
// @route   POST /api/interviews/:id/upload
// @access  Private (Interviewer/Admin)
export const uploadInterviewVideo = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      res.status(404).json({ success: false, message: 'Interview not found' });
      return;
    }

    // Basic authorization: interviewer who owns or admin
    if (req?.user?.role === 'interviewer' && interview.interviewer.toString() !== req?.user?._id) {
      res.status(403).json({ success: false, message: 'Not authorized to upload for this interview' });
      return;
    }

    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ success: false, message: 'No video file uploaded' });
      return;
    }

    logger.info(`Processing uploaded video ${file.path} for interview ${req.params.id}`);
    const detections = await videoProcessingService.processVideo(file.path, req.params.id);

    // Apply MVP temporal logic once over the batch
    const thresholded = detectionStateService.processDetections(req.params.id, detections as IDetectionResult[]);

    const { saved, integrityScore } = await persistAndEmitDetections(req.params.id, thresholded);

    res.status(200).json({
      success: true,
      message: 'Video processed',
      count: saved.length,
      integrityScore,
      data: saved
    });
  } catch (error) {
    logger.error('Upload interview video error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Process a single frame in real-time (MVP)
// @route   POST /api/interviews/:id/frame
// @access  Private (Interviewer/Admin)
export const processFrameRealtime = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      res.status(404).json({ success: false, message: 'Interview not found' });
      return;
    }

    // Basic authorization: interviewer who owns or admin
    if (req?.user?.role === 'interviewer' && interview.interviewer.toString() !== req?.user?._id) {
      res.status(403).json({ success: false, message: 'Not authorized to process frames for this interview' });
      return;
    }

    const { frameBase64, duration = 1 } = req.body as { frameBase64: string; duration?: number };
    if (!frameBase64) {
      res.status(400).json({ success: false, message: 'frameBase64 is required' });
      return;
    }

    // Convert base64 (optionally with data URL prefix) to Buffer
    const base64 = (frameBase64 as string).includes(',') ? frameBase64.split(',')[1] : frameBase64;
    const buffer = Buffer.from(base64, 'base64');

    const detections = await computerVisionService.processFrame(buffer);

    // Add per-frame duration to focus/face events for temporal logic
    const withDurations = (detections || []).map(d => ({ ...d, duration: d.type === 'focus_lost' || d.type === 'face_absent' ? duration : d.duration }));

    const thresholded = detectionStateService.processDetections(req.params.id, withDurations);

    const { saved, integrityScore } = await persistAndEmitDetections(req.params.id, thresholded);

    res.json({ success: true, count: saved.length, integrityScore, data: saved });
  } catch (error) {
    logger.error('Process frame realtime error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
