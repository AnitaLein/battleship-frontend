'use client';

import { useRouter } from 'next/navigation';
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Snowflake } from 'lucide-react';
import { useImages } from '@/hooks/useImages';
import { Snowfall } from '@/components/snowfall';

export default function AttackResultPage() {
  const router = useRouter();

  // =====================
  // CLIENT-ONLY STATE
  // =====================
  const [params, setParams] = useState<URLSearchParams | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const webcamRef = useRef<Webcam | null>(null);
  const { storeAttackPicture } = useImages();

  // =====================
  // PARSE QUERY PARAMETERS
  // =====================
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const searchParams = new URLSearchParams(window.location.search);
    setParams(searchParams);
  }, []);

  // =====================
  // REDIRECT IF NO USER
  // =====================
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userId = sessionStorage.getItem('id');
    if (!userId) router.replace('/login');
  }, [router]);

  if (!params) return <div>Lädt...</div>;

  const hit = params.get('hit') === 'true';
  const field = params.get('field');
  const target = params.get('target');
  const attackId = params.get('attackId');
  const sunk = params.get('sunk') === 'true';

  // =====================
  // CAMERA HANDLERS
  // =====================
  const capture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setCameraOpen(false);
  };

  const removePicture = () => {
    setImgSrc(null);
    setCameraOpen(true);
  };

  const closeCamera = () => setCameraOpen(false);

  const uploadAttackPicture = async (userId: string, attackId: string) => {
    if (!imgSrc) return;
    const base64 = imgSrc.split(',')[1];
    try {
      await storeAttackPicture(userId, base64, attackId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-purple-900 to-red-900 text-white p-6">
      <Snowfall />
      <Snowflake className="w-16 h-16 text-white animate-spin-slow mb-6" />

      <h1 className="text-4xl font-bold mb-4">Angriff auf {field}</h1>
      <h2 className={`text-4xl font-extrabold mb-8 ${hit ? 'text-green-400' : 'text-red-400'}`}>
        {!hit ? 'Daneben!' : sunk ? 'Treffer und versenkt!' : 'Treffer!'}
      </h2>

      {hit && (
        <div className="my-4 flex flex-col items-center">
          {/* CAMERA BUTTON */}
          {!cameraOpen && !imgSrc && (
            <div
              onClick={() => setCameraOpen(true)}
              className="w-64 h-64 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center cursor-pointer hover:bg-white/30 transition"
            >
              <p className="text-white text-sm opacity-80">Kamera öffnen</p>
            </div>
          )}

          {/* CAMERA */}
          {cameraOpen && typeof window !== 'undefined' && (
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-2">Zeigt uns euer Gewinnerlächeln</h3>
              <div className="w-64 h-64 rounded-full overflow-hidden">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: 'user' }}
                  className="object-cover w-full h-full transform scale-x-[-1]"
                />
              </div>

              <div className="flex gap-3 mt-3">
                <button onClick={capture} className="bg-green-600 text-white py-2 px-4 rounded-lg">
                  Foto aufnehmen
                </button>
                <button onClick={closeCamera} className="bg-red-600 text-white py-2 px-4 rounded-lg">
                  Kamera schließen
                </button>
              </div>
            </div>
          )}

          {/* PICTURE TAKEN */}
          {imgSrc && (
            <div className="flex flex-col items-center mt-4">
              <img src={imgSrc} className="object-cover w-64 h-64 rounded-full" />
              <button onClick={removePicture} className="mt-3 bg-yellow-500 text-white py-2 px-4 rounded-lg transform scale-x-[-1]">
                Bild löschen / Neu aufnehmen
              </button>
            </div>
          )}

          {/* UPLOAD BUTTON */}
          <button
            onClick={async () => {
              const userId = sessionStorage.getItem('id');
              if (userId && attackId) {
                await uploadAttackPicture(userId, attackId);
              }
              router.push('/main');
            }}
            className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Bild hochladen
          </button>
        </div>
      )}

      {!hit && (
        <button
          onClick={() => router.push('/main')}
          className="mt-6 px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md"
        >
          Zurück
        </button>
      )}
    </div>
  );
}