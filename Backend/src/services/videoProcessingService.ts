import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { logger } from '@/utils/logger';
import { computerVisionService } from '@/services/computerVisionService';
import { IDetectionResult, IVideoMetadata } from '@/types';

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `video-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Accept video files
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600') // 100MB default
  }
});

export class VideoProcessingService {
  private processingQueue: Map<string, boolean> = new Map();

  /**
   * Process uploaded video file
   */
  async processVideo(filePath: string, interviewId: string): Promise<IDetectionResult[]> {
    if (this.processingQueue.get(interviewId)) {
      throw new Error('Video is already being processed for this interview');
    }

    this.processingQueue.set(interviewId, true);

    try {
      logger.info(`Starting video processing for interview ${interviewId}`);
      
      // In a real implementation, this would:
      // 1. Extract frames from video
      // 2. Process each frame with computer vision
      // 3. Aggregate results
      
      // For now, we'll simulate processing
      const allDetections: IDetectionResult[] = [];
      
      // Simulate processing multiple frames
      for (let i = 0; i < 10; i++) {
        const frameDetections = await computerVisionService.processFrame(Buffer.from('mock-frame-data'));
        allDetections.push(...frameDetections);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      logger.info(`Video processing completed for interview ${interviewId}. Found ${allDetections.length} detections.`);
      
      return allDetections;
    } catch (error) {
      logger.error(`Video processing error for interview ${interviewId}:`, error);
      throw error;
    } finally {
      this.processingQueue.delete(interviewId);
    }
  }

  /**
   * Extract frames from video (placeholder)
   */
  private async extractFrames(videoPath: string): Promise<Buffer[]> {
    // In real implementation, this would use FFmpeg or similar
    // to extract frames from the video
    logger.info(`Extracting frames from ${videoPath}`);
    
    // Return mock frame data
    return Array(10).fill(0).map(() => Buffer.from('mock-frame-data'));
  }

  /**
   * Clean up temporary files
   */
  async cleanupFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`Cleaned up file: ${filePath}`);
      }
    } catch (error) {
      logger.error(`Error cleaning up file ${filePath}:`, error);
    }
  }

  /**
   * Get video metadata
   */
  async getVideoMetadata(filePath: string): Promise<IVideoMetadata> {
    try {
      const stats = fs.statSync(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    } catch (error) {
      logger.error(`Error getting video metadata for ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Check if video is being processed
   */
  isProcessing(interviewId: string): boolean {
    return this.processingQueue.has(interviewId);
  }
}

// Export singleton instance
export const videoProcessingService = new VideoProcessingService();
