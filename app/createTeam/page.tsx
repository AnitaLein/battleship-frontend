'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Snowflake } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { useAuth } from '@/hooks/useAuth';
import { useImages } from '@/hooks/useImages';
import { Snowfall } from '@/components/snowfall';

function CreateTeam() {
  const router = useRouter();
  const { createTeam } = useAuth();
  const { storeProfilePicture } = useImages();  // ✅ USE IMAGE HOOK HERE

  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: string }>({
    text: '',
    type: '',
  });

  const webcamRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    const userId = sessionStorage.getItem('id');
    if (!userId) router.replace('/login');
  }, [router]);

  const openCamera = () => {
    setCameraOpen(true);
    setImgSrc(null);
  };

  const closeCamera = () => setCameraOpen(false);

  const capture = () => {
    if (!webcamRef.current) return;
    const imageSrc = (webcamRef.current as any).getScreenshot();
    setImgSrc(imageSrc);
    setCameraOpen(false);
  };

  const removePicture = () => {
    setImgSrc(null);
    setCameraOpen(true);
  };

  // ===========================================
  // ✅ USE storeProfilePicture FROM useImages()
  // ===========================================
  const uploadToBackend = async (userId: string) => {
    if (!imgSrc) return;

    const base64 = imgSrc.split(',')[1];
    console.log(base64)
    try {
      await storeProfilePicture(userId, base64);

      setMessage({
        text: 'Bild erfolgreich hochgeladen!',
        type: 'success',
      });
    } catch (err) {
      console.error(err);
      setMessage({
        text: 'Upload fehlgeschlagen',
        type: 'error',
      });
    }
  };

  // TEAM CREATION FLOW
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName) {
      setError('Teamname darf nicht leer sein.');
      return;
    }

    const userId = sessionStorage.getItem('id');
    if (!userId) {
      setError('Benutzer-ID fehlt.');
      return;
    }

    const result = await createTeam(teamName, userId);
    console.log('Team creation result:', result)
    console.log(result)
    const uploadResult = await uploadToBackend(userId);
    console.log(result)
    console.log(uploadResult)
    if (!result) {
      setError('Team konnte nicht erstellt werden.');
      return;
    }

   const today = new Date()
   const currentMonthNumber = today.getMonth() + 1; // 1-12
   
   if (currentMonthNumber != 12) {
    router.push('prepare');
   } else {
     router.push('/main');
   }


  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 p-6 overflow-hidden">
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">

        <div className="flex justify-center mb-6">
          <Snowflake className="w-12 h-12 text-white animate-spin-slow" />
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-4">
          A-ho-ho-hoy!
        </h2>

        <div className="my-4 flex flex-col items-center">

          {!cameraOpen && !imgSrc && (
            <div
              onClick={openCamera}
              className="w-64 h-64 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center cursor-pointer hover:bg-white/30 transition"
            >
              <p className="text-white text-sm opacity-80">Nimmt ein Teamfoto auf!</p>
            </div>
          )}

          {cameraOpen && (
            <div className="flex flex-col items-center">
              {typeof window !== 'undefined' && (
                <div className="w-64 h-64 rounded-full overflow-hidden">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: 'user' }}
                    className="object-cover w-full h-full transform scale-x-[-1]"
                  />
                </div>
              )}

              <div className="flex gap-3 mt-3">
                <button
                  onClick={capture}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg"
                >
                  Foto aufnehmen
                </button>

                <button
                  onClick={closeCamera}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg"
                >
                  Kamera schließen
                </button>
              </div>
            </div>
          )}

          {imgSrc && (
            <div className="flex flex-col items-center mt-4">
              <img src={imgSrc} className="object-cover w-64 h-64 rounded-full transform scale-x-[-1]" />

              <button
                onClick={removePicture}
                className="mt-3 bg-yellow-500 text-white py-2 px-4 rounded-lg"
              >
                Bild löschen / Neu aufnehmen
              </button>
            </div>
          )}
        </div>

        {message.text && (
          <div
            className={`mt-4 p-3 rounded-lg text-center ${
              message.type === 'success'
                ? 'bg-green-600/30 text-green-200'
                : 'bg-red-600/30 text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleCreateTeam} className="mt-6">
          <input
            type="text"
            placeholder="Name eurer Schiffsbesatzung"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition duration-200"
          >
            Team erstellen
          </button>

          {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
        </form>

      </div>
    </div>
  );
}

export default function CreateTeamPage() {
  return <CreateTeam />;
}
