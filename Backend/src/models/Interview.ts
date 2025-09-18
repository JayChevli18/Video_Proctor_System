import mongoose, { Document, Schema } from 'mongoose';
import { IInterview, IDetectionEvent } from '@/types';

const DetectionEventSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['focus_lost', 'face_absent', 'multiple_faces', 'phone_detected', 'notes_detected', 'device_detected'],
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  description: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, { _id: true });

const InterviewSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  interviewer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidate: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 480 // 8 hours max
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  videoUrl: {
    type: String
  },
  detectionEvents: [DetectionEventSchema],
  integrityScore: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Index for better query performance
InterviewSchema.index({ interviewer: 1, scheduledAt: 1 });
InterviewSchema.index({ candidate: 1, status: 1 });
InterviewSchema.index({ status: 1 });

export const Interview = mongoose.model<IInterview>('Interview', InterviewSchema);
