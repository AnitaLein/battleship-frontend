'use client';
import React, { useEffect, useRef, useState } from 'react';

interface CameraProps {
  onPhotoTaken?: (photo: string) => void; // Callback when photo captured
}

const Camera: React.FC<CameraProps> = ({ onPhotoTaken }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const openCamera = async () => {
    setCameraError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera error', err);
      if (err.name === 'NotAllowedError') {
        setCameraError('Bitte erlaube den Kamerazugriff in deinem Browser.');
      } else {
        setCameraError('Kamera konnte nicht geöffnet werden. ' + err.message);
      }
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/png');
    setPhoto(dataUrl);
    onPhotoTaken?.(dataUrl);
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    return () => closeCamera();
  }, []);

  return (
    <div className="mb-4">
      {!stream && (
        <button
          type="button"
          onClick={openCamera}
          className="w-full py-2 mb-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
        >
          Kamera öffnen
        </button>
      )}

      {stream && (
        <div className="mb-3">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-md bg-black"
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={takePhoto}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
            >
              Foto aufnehmen
            </button>
            <button
              type="button"
              onClick={closeCamera}
              className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Kamera schließen
            </button>
          </div>
        </div>
      )}

      {cameraError && (
        <p className="text-red-300 text-sm mb-2">{cameraError}</p>
      )}

      {photo && (
        <div className="mb-4">
          <p className="text-white text-sm mb-2 text-center">Vorschau:</p>
          <img
            src={photo}
            alt="Captured"
            className="w-full rounded-md object-cover border border-white/20"
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setPhoto(null)}
              className="flex-1 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition"
            >
              Neu aufnehmen
            </button>
            <button
              type="button"
              onClick={() => {
                closeCamera();
                onPhotoTaken?.(photo);
              }}
              className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
            >
              Foto verwenden
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Camera;
