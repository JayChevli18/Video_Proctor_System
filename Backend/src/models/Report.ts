import mongoose, { Schema } from 'mongoose';
import { IReport } from '@/types';

const ReportSchema: Schema = new Schema({
  interview: {
    type: Schema.Types.ObjectId,
    ref: 'Interview',
    required: true,
    unique: true
  },
  candidateName: {
    type: String,
    required: true
  },
  interviewerName: {
    type: String,
    required: true
  },
  interviewDuration: {
    type: Number,
    required: true,
    min: 0
  },
  totalFocusLossEvents: {
    type: Number,
    default: 0,
    min: 0
  },
  totalFaceAbsenceEvents: {
    type: Number,
    default: 0,
    min: 0
  },
  totalMultipleFacesEvents: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPhoneDetections: {
    type: Number,
    default: 0,
    min: 0
  },
  totalNotesDetections: {
    type: Number,
    default: 0,
    min: 0
  },
  totalDeviceDetections: {
    type: Number,
    default: 0,
    min: 0
  },
  integrityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  deductions: {
    focusLoss: {
      type: Number,
      default: 0
    },
    faceAbsence: {
      type: Number,
      default: 0
    },
    multipleFaces: {
      type: Number,
      default: 0
    },
    phoneDetections: {
      type: Number,
      default: 0
    },
    notesDetections: {
      type: Number,
      default: 0
    },
    deviceDetections: {
      type: Number,
      default: 0
    }
  },
  summary: {
    type: String,
    required: true
  },
  recommendations: [{
    type: String
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
ReportSchema.index({ interview: 1 });
ReportSchema.index({ candidateName: 1 });
ReportSchema.index({ generatedAt: -1 });

export const Report = mongoose.model<IReport>('Report', ReportSchema);
