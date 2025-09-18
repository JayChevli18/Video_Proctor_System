import { IDetectionResult } from '@/types';

// Minimal in-memory temporal logic per interview to enforce thresholds
// - Focus lost only emitted when cumulative away time > 5s
// - Face absent only emitted when cumulative absence time > 10s
// Note: This is MVP state kept in-memory; for multi-instance deployments use a shared store (e.g., Redis)

class DetectionStateService {
  private focusAwaySeconds: Map<string, number> = new Map();
  private faceAbsentSeconds: Map<string, number> = new Map();

  reset(interviewId: string): void {
    this.focusAwaySeconds.delete(interviewId);
    this.faceAbsentSeconds.delete(interviewId);
  }

  // Process raw detections for a single frame or batch and generate thresholded events
  processDetections(interviewId: string, detections: IDetectionResult[]): IDetectionResult[] {
    const results: IDetectionResult[] = [];

    // Aggregate durations from current detections
    const focusEvent = detections.find(d => d.type === 'focus_lost');
    const faceAbsentEvent = detections.find(d => d.type === 'face_absent');

    // Update focus away cumulative seconds
    if (focusEvent) {
      const prev = this.focusAwaySeconds.get(interviewId) || 0;
      const next = prev + (focusEvent.duration || 0);
      this.focusAwaySeconds.set(interviewId, next);
      // Emit only when crossing 5s threshold
      if (prev < 5 && next >= 5) {
        results.push({ ...focusEvent, duration: next, description: 'Focus lost for more than 5 seconds (MVP threshold)' });
        // After emitting, reset to avoid repeated alerts in MVP
        this.focusAwaySeconds.set(interviewId, 0);
      }
    } else {
      // If no focus lost in this cycle, decay/reset
      this.focusAwaySeconds.set(interviewId, 0);
    }

    // Update face absence cumulative seconds
    if (faceAbsentEvent) {
      const prev = this.faceAbsentSeconds.get(interviewId) || 0;
      const next = prev + (faceAbsentEvent.duration || 0);
      this.faceAbsentSeconds.set(interviewId, next);
      if (prev < 10 && next >= 10) {
        results.push({ ...faceAbsentEvent, duration: next, description: 'Face absent for more than 10 seconds (MVP threshold)' });
        this.faceAbsentSeconds.set(interviewId, 0);
      }
    } else {
      this.faceAbsentSeconds.set(interviewId, 0);
    }

    // Pass-through other detections directly (multiple faces, devices, notes, phone)
    for (const d of detections) {
      if (d.type !== 'focus_lost' && d.type !== 'face_absent') {
        results.push(d);
      }
    }

    return results;
  }
}

export const detectionStateService = new DetectionStateService();
