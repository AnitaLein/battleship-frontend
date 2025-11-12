'use client';
import React, { useState, useEffect } from 'react';
import { Snowflake } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Camera from '../../components/camera';
import { useAuth } from '@/hooks/useAuth';

function CreateTeam() {
  const router = useRouter();
  const {createTeam } = useAuth();
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: string }>({
    text: '',
    type: '',
  });
  const [photo, setPhoto] = useState<string | null>(null);

    useEffect(() => {
      const userId = sessionStorage.getItem('id');
      if (!userId) {
        router.replace('/login'); // or router.push('/login')
      }
    }, [router]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) {
      setError('Teamname darf nicht leer sein.');
      return;
    }
    const userId = sessionStorage.getItem('id');
    console.log(userId)
    if (!userId) {
      setError('Benutzer-ID fehlt.');
      return;
    }
    const res = await createTeam(teamName, userId)
    if(!res){
      router.push('/main')
    }

    //router.push('/main');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 p-6 overflow-hidden">
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
        <div className="flex justify-center mb-6">
          <Snowflake className="w-12 h-12 text-white animate-spin-slow" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-4">A-ho-ho-hoy!</h2>

        {/* Camera Component */}
        <Camera onPhotoTaken={(dataUrl) => setPhoto(dataUrl)} />

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg text-center ${
              message.type === 'success'
                ? 'bg-green-600/30 text-green-200'
                : 'bg-red-600/30 text-red-200'
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
}

export default function CreateTeamPage() {
  return <CreateTeam />;
}
