import { useRef, useCallback, useState } from 'react';

export function useWebcam() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startWebcam = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamOn(true);
      }
    } catch (err) {
      setError('Failed to access camera');
      console.error('Webcam error:', err);
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsWebcamOn(false);
    }
  }, []);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !isWebcamOn) {
      return null;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      return null;
    }

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    context.drawImage(videoRef.current, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [isWebcamOn]);

  return {
    videoRef,
    isWebcamOn,
    error,
    startWebcam,
    stopWebcam,
    captureFrame
  };
}
