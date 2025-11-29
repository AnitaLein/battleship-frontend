'use client';
import React, { useState, useEffect } from 'react';
import { Snowflake } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Snowfall } from '@/components/snowfall';
import { useImages } from '@/hooks/useImages';
import { usePlayers } from '@/hooks/usePlayers';

const FightPreparation: React.FC = () => {
  const router = useRouter();

  const { loadProfilePicture } = useImages();
  const { loadOwnPlayer,getAllEnemies } = usePlayers();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [enemies, setEnemies] = useState<any[]>([]);

  // Session check
  useEffect(() => {
    const userId = sessionStorage.getItem('id');
    if (!userId) router.replace('/login');
  }, [router]);

  // Load profile and enemies
  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = sessionStorage.getItem('id');
        if (!userId) {
          setError('Keine Benutzer-ID gefunden.');
          setLoading(false);
          return;
        }

        const [profileNameRes, profilePicRes, enemiesRes] = await Promise.all([
          loadOwnPlayer(userId),
          loadProfilePicture(),
          getAllEnemies(userId),
        ]);

        if (profilePicRes?.url) setProfilePic(profilePicRes.url);
        setProfileName(profileNameRes);
        setEnemies(Array.isArray(enemiesRes) ? enemiesRes : []);
      } catch (err) {
        console.error(err);
        setError('Fehler beim Laden der Daten.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [loadOwnPlayer, loadProfilePicture, getAllEnemies]);

  return (
    <> 
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 p-6">
      <Snowfall />

      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Kampfvorbereitung, {profileName ?? ''}!
        </h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profilbild"
              className="w-32 h-32 rounded-full border-2 border-white/50 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-white/50 bg-white/10 flex items-center justify-center">
              <Snowflake className="w-10 h-10 text-white/50 animate-spin-slow" />
            </div>
          )}
        </div>

        <h3 className="text-xl text-white font-semibold text-center mb-4">Feindliche Spieler</h3>

        {/* Loading / Error */}
        {loading ? (
          <div className="flex flex-col items-center mb-4">
            <Snowflake className="w-12 h-12 text-white animate-spin-slow mb-2" />
            <p className="text-white/80">Lade Feinde...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : enemies.length === 0 ? (
          <p className="text-center text-white/70">Keine Gegner gefunden.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2">
            {enemies.map((enemy, idx) => (
              <div
                key={idx}
                className="bg-white/10 p-4 rounded-xl shadow border border-white/20 flex items-center gap-4 hover:bg-white/20 transition"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <Snowflake className="w-8 h-8 text-white/60" />
                </div>
                <div>
                  <p className="text-white font-bold">{enemy.name}</p>
                  <p className="text-white/70 text-sm">Level: {enemy.level ?? '-'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="w-full py-3 mt-6 bg-red-600 text-white rounded-xl hover:bg-red-500 transition duration-200"
          onClick={() => router.push('/attack')}
        >
          Angriff starten
        </button>
      </div>
    </div>
    </>
  );
};

export default FightPreparation;
