'use client';
import React, { useState, useEffect } from 'react';
import { Gift, Lock, LogIn, Loader2, Snowflake } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

interface InputFieldProps {
  Icon: React.ComponentType<any>;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

// --- Snowfall Component ---
const Snowfall: React.FC = () => {
  const [flakes, setFlakes] = useState<{ id: number; left: string; size: string; duration: string }[]>([]);

  useEffect(() => {
    const createFlake = () => {
      const id = Math.random();
      const left = Math.random() * 100 + '%';
      const size = Math.random() * 8 + 4 + 'px'; // 4–12px snowflakes
      const duration = Math.random() * 5 + 5 + 's'; // 5–10s fall
      setFlakes((prev) => [...prev.slice(-70), { id, left, size, duration }]);
    };
    const interval = setInterval(createFlake, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full opacity-70 animate-fall"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDuration: flake.duration,
          }}
        ></div>
      ))}

      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0.1;
          }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

// --- Main App ---
function CreateTeam() {
  const router = useRouter();

  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: string }>({ text: '', type: '' });

  // ✅ Make function async to use await
 const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleCreateTeam called');
    if (!teamName) {
      setError('Teamname darf nicht leer sein.');
      return;
    }
    //const res = await createTeam(teamName);
    //console.log('Create Team response received:', res);
      router.push('/main');
      setError('Fehler beim Erstellen des Teams.');
  };

const videoRef = React.useRef<HTMLVideoElement | null>(null);
const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
const [stream, setStream] = useState<MediaStream | null>(null);
const [photo, setPhoto] = useState<string | null>(null);
const [cameraError, setCameraError] = useState<string | null>(null);

// Start camera
const openCamera = async () => {
    setCameraError(null);
    try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        setStream(s);
        if (videoRef.current) {
            videoRef.current.srcObject = s;
            await videoRef.current.play();
        }
    } catch (err: any) {
        console.error('Camera error', err);
        setCameraError('Kamera konnte nicht geöffnet werden. Erlaube den Kamerazugriff im Browser.');
    }
};

// Take photo from video stream
const takePhoto = () => {
    setCameraError(null);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
        setCameraError('Kamera nicht verfügbar.');
        return;
    }
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        setCameraError('Canvas-Kontext nicht verfügbar.');
        return;
    }
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/png');
    setPhoto(dataUrl);
};

// Stop camera
const closeCamera = () => {
    if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
    }
};

// Cleanup on unmount
useEffect(() => {
    return () => {
        if (stream) {
            stream.getTracks().forEach((t) => t.stop());
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 p-6 overflow-hidden">
        <Snowfall />
        <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex justify-center mb-6">
                <Snowflake className="w-12 h-12 text-white animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-4">A-ho-ho-hoy!</h2>

            {/* Camera UI */}
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
                        <video ref={videoRef} className="w-full rounded-md bg-black" playsInline muted />
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

                {cameraError && <p className="text-red-300 text-sm mb-2">{cameraError}</p>}

                {photo && (
                    <div className="mb-4">
                        <p className="text-white text-sm mb-2 text-center">Vorschau:</p>
                        <img src={photo} alt="Captured" className="w-full rounded-md object-cover border border-white/20" />
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
                                    // keep photo (could attach to form submission)
                                    closeCamera();
                                    setMessage({ text: 'Foto gespeichert (nur lokal).', type: 'success' });
                                }}
                                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
                            >
                                Foto verwenden
                            </button>
                        </div>
                    </div>
                )}

                {/* Hidden canvas used to capture the image */}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {message.text && (
                <div
                    className={`mb-6 p-4 rounded-lg text-center ${
                        message.type === 'success' ? 'bg-green-600/30 text-green-200' : 'bg-red-600/30 text-red-200'
                    }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleCreateTeam}>
                <input
                    type="text"
                    placeholder="Name eurer Schiffsbesatzung"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full p-3 mb-4 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                    type="submit"
                    className="w-full py-3 mt-4 bg-red-600 text-white rounded-xl hover:bg-red-500 transition duration-200"
                >
                    Team erstellen
                </button>
                {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
            </form>
        </div>
    </div>
);
};

export default function CreateTeamPage() {
  return <CreateTeam />;
}
