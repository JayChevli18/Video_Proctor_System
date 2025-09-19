import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { logger } from '@/utils/logger';
import { computerVisionService } from '@/services/computerVisionService';
import { IDetectionResult, IVideoMetadata } from '@/types';

// Set FFmpeg path
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

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
      
      // Extract frames from video
      const frames = await this.extractFrames(filePath);
      
      // Process each frame with computer vision
      const allDetections: IDetectionResult[] = [];
      
      for (const frame of frames) {
        try {
          const frameDetections = await computerVisionService.processFrame(frame);
          allDetections.push(...frameDetections);
          
          // Small delay to prevent overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (frameError) {
          logger.error('Error processing frame:', frameError);
          // Continue processing other frames even if one fails
        }
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
   * Extract frames from video using FFmpeg
   */
  private async extractFrames(videoPath: string): Promise<Buffer[]> {
    return new Promise((resolve, reject) => {
      const frames: Buffer[] = [];
      const tempDir = path.join(process.cwd(), 'temp', 'frames');
      
      // Create temp directory if it doesn't exist
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Get video duration first
      ffmpeg.ffprobe(videoPath, (err: any, metadata: any) => {
        if (err) {
          logger.error('Error getting video metadata:', err);
          reject(err);
          return;
        }

        const duration = metadata.format.duration || 0;
        const frameInterval = Math.max(1, Math.floor(duration / 10)); // Extract 10 frames evenly distributed

        ffmpeg(videoPath)
          .fps(1 / frameInterval) // Extract 1 frame every frameInterval seconds
          .outputOptions(['-frames:v 10']) // Limit to 10 frames
          .format('image2')
          .output(path.join(tempDir, 'frame_%03d.jpg'))
          .on('end', () => {
            // Read all extracted frames
            const frameFiles = fs.readdirSync(tempDir)
              .filter(file => file.startsWith('frame_') && file.endsWith('.jpg'))
              .sort();

            for (const frameFile of frameFiles) {
              const framePath = path.join(tempDir, frameFile);
              const frameBuffer = fs.readFileSync(framePath);
              frames.push(frameBuffer);
              
              // Clean up individual frame file
              fs.unlinkSync(framePath);
            }

            // Clean up temp directory
            if (fs.existsSync(tempDir)) {
              fs.rmdirSync(tempDir);
            }

            logger.info(`Extracted ${frames.length} frames from ${videoPath}`);
            resolve(frames);
          })
          .on('error', (err: any) => {
            logger.error('Error extracting frames:', err);
            reject(err);
          })
          .run();
      });
    });
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
