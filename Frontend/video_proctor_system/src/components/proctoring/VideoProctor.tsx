'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { processFrame, addDetectionEvent } from '@/store/slices/interviewSlice';
import { useWebcam } from '@/hooks/useWebcam';
import { socketService } from '@/lib/socket';
import { 
  Video, 
  VideoOff, 
  Play, 
  Square, 
  AlertTriangle,
  Eye,
  EyeOff,
  Users,
  Smartphone,
  Book,
  Monitor
} from 'lucide-react';
import { DetectionEvent } from '@/types';
import toast from 'react-hot-toast';

interface VideoProctorProps {
  interviewId: string;
}

export default function VideoProctor({ interviewId }: VideoProctorProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { detectionEvents, realTimeIntegrityScore } = useSelector((state: RootState) => state.interviews);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionHistory, setDetectionHistory] = useState<DetectionEvent[]>([]);
  
  const { 
    videoRef, 
    isWebcamOn, 
    startWebcam, 
    stopWebcam, 
    captureFrame 
  } = useWebcam();
  
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Socket connection for real-time updates
  useEffect(() => {
    socketService.connect();
    socketService.joinInterview(interviewId);

    socketService.onDetectionEvent((data) => {
      if (data.interviewId === interviewId) {
        dispatch(addDetectionEvent(data.event));
        setDetectionHistory(prev => [data.event, ...prev.slice(0, 9)]);
        
        // Show toast notification
        toast.error(`Detection: ${data.event.description}`, {
          duration: 3000,
        });
      }
    });

    return () => {
      socketService.offDetectionEvent();
      socketService.leaveInterview(interviewId);
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
      }
    };
  }, [interviewId, dispatch]);

  const startProctoring = useCallback(async () => {
    try {
      await startWebcam();
      setIsRecording(true);
      
      // Start frame processing
      processingIntervalRef.current = setInterval(async () => {
        if (videoRef.current && isWebcamOn) {
          const frameData = captureFrame();
          if (frameData) {
            setIsProcessing(true);
            try {
              await dispatch(processFrame({
                id: interviewId,
                frameData: { frameBase64: frameData, duration: 1 }
              }));
            } catch (error) {
              console.error('Frame processing error:', error);
            } finally {
              setIsProcessing(false);
            }
          }
        }
      }, 1000); // Process every second
      
      toast.success('Proctoring started');
    } catch (error) {
      toast.error('Failed to start proctoring');
    }
  }, [startWebcam, videoRef, isWebcamOn, captureFrame, dispatch, interviewId]);

  const stopProctoring = useCallback(() => {
    stopWebcam();
    setIsRecording(false);
    
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }
    
    // Leave the interview room
    socketService.leaveInterview(interviewId);
    
    toast.success('Proctoring stopped');
  }, [stopWebcam, interviewId]);

  const getDetectionIcon = (type: DetectionEvent['type']) => {
    switch (type) {
      case 'focus_lost':
        return <EyeOff className="h-4 w-4" />;
      case 'face_absent':
        return <Users className="h-4 w-4" />;
      case 'multiple_faces':
        return <Users className="h-4 w-4" />;
      case 'phone_detected':
        return <Smartphone className="h-4 w-4" />;
      case 'notes_detected':
        return <Book className="h-4 w-4" />;
      case 'device_detected':
        return <Monitor className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: DetectionEvent['severity']) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Video Feed */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Video Feed</h3>
              <div className="flex items-center space-x-2">
                {!isRecording ? (
                  <button
                    onClick={startProctoring}
                    disabled={isProcessing}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Proctoring
                  </button>
                ) : (
                  <button
                    onClick={stopProctoring}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop Proctoring
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              {isWebcamOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <VideoOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Camera is off</p>
                  </div>
                </div>
              )}
              
              {isProcessing && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  Processing...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detection Panel */}
      <div className="space-y-6">
        {/* Integrity Score */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrity Score</h3>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              realTimeIntegrityScore >= 90 
                ? 'text-green-600' 
                : realTimeIntegrityScore >= 70 
                ? 'text-yellow-600' 
                : 'text-red-600'
            }`}>
              {realTimeIntegrityScore}%
            </div>
            <p className="text-sm text-gray-600">
              {realTimeIntegrityScore >= 90 
                ? 'Excellent' 
                : realTimeIntegrityScore >= 70 
                ? 'Good' 
                : 'Needs Attention'}
            </p>
          </div>
        </div>

        {/* Real-time Detections */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Live Detections</h3>
          </div>
          <div className="p-4">
            {detectionHistory.length > 0 ? (
              <div className="space-y-3">
                {detectionHistory.map((event, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${getSeverityColor(event.severity)}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {getDetectionIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.description}</p>
                        <p className="text-xs opacity-75">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                        <p className="text-xs opacity-75">
                          Confidence: {(event.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No detections yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Detection Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Focus Lost:</span>
              <span className="text-sm font-medium">
                {detectionEvents.filter(e => e.type === 'focus_lost').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Face Absent:</span>
              <span className="text-sm font-medium">
                {detectionEvents.filter(e => e.type === 'face_absent').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Multiple Faces:</span>
              <span className="text-sm font-medium">
                {detectionEvents.filter(e => e.type === 'multiple_faces').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Phone Detected:</span>
              <span className="text-sm font-medium">
                {detectionEvents.filter(e => e.type === 'phone_detected').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Notes Detected:</span>
              <span className="text-sm font-medium">
                {detectionEvents.filter(e => e.type === 'notes_detected').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Device Detected:</span>
              <span className="text-sm font-medium">
                {detectionEvents.filter(e => e.type === 'device_detected').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
