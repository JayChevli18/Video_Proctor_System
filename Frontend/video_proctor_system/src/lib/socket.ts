import { io, Socket } from 'socket.io-client';
import { InterviewStartedData, InterviewEndedData, DetectionEventData } from '@/types';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(): Socket {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinInterview(interviewId: string): void {
    if (this.socket) {
      this.socket.emit('join-interview', interviewId);
    }
  }

  leaveInterview(interviewId: string): void {
    if (this.socket) {
      this.socket.emit('leave-interview', interviewId);
    }
  }

  onInterviewStarted(callback: (data: InterviewStartedData) => void): void {
    if (this.socket) {
      this.socket.on('interview-started', callback);
    }
  }

  onInterviewEnded(callback: (data: InterviewEndedData) => void): void {
    if (this.socket) {
      this.socket.on('interview-ended', callback);
    }
  }

  onDetectionEvent(callback: (data: DetectionEventData) => void): void {
    if (this.socket) {
      this.socket.on('detection-event', callback);
    }
  }

  offInterviewStarted(): void {
    if (this.socket) {
      this.socket.off('interview-started');
    }
  }

  offInterviewEnded(): void {
    if (this.socket) {
      this.socket.off('interview-ended');
    }
  }

  offDetectionEvent(): void {
    if (this.socket) {
      this.socket.off('detection-event');
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.isConnected;
  }
}

export const socketService = new SocketService();
export default socketService;
