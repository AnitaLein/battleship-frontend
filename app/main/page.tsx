'use client';
import React, { useState, useEffect, use } from 'react';
import { Snowflake } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAttacks } from '@/hooks/useAttacks';
import { useImages } from '@/hooks/useImages';
import { Snowfall } from '@/components/snowfall';
import { usePlayers } from '@/hooks/usePlayers';

const AttackHistory: React.FC = () => {
  const [attacks, setAttacks] = useState<any[]>([]);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAllAttacks } = useAttacks();
  const {storeProfilePicture, loadProfilePicture, loadAttackPicture} = useImages();
  const [selectedAttackImg, setSelectedAttackImg] = useState<string | null>(null);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const { loadOwnPlayer } = usePlayers();
  const [profileName, setProfileName] = useState<string | null>(null);
  const [attackLoader, setAttackLoader] = useState(false);

  
  const router = useRouter();

  // Check for user session
  useEffect(() => {
    const userId = sessionStorage.getItem('id');
    if (!userId) {
      router.replace('/login');
    }
  }, [router]);

  // Load attack history
  useEffect(() => {
    const loadAttacks = async () => {
      try {
        const userId = sessionStorage.getItem('id');
        if (!userId) {
          setError('Keine Benutzer-ID gefunden.');
          setLoading(false);
          return;
        }
        const data = await getAllAttacks(userId);
        console.log(data);
        if(!data.success){
          setError('Keine vergangenen Angriffe');
        } else {
          const attacksWithPics = await Promise.all(data.data.map(async (attack : any) => {
          if (attack.isHit) {
            const attackPic = await loadAttackPicture(userId, attack.id);
            return { ...attack, attackPic };
          } else return attack;
        }));
        setAttacks(Array.isArray(attacksWithPics) ? attacksWithPics : []);
        }
      } catch (err) {
        console.error(err);
        setError('Fehler beim Laden der Angriffe.');
      } finally {
        setLoading(false);
      }
    };
    loadAttacks();
  }, []);

  // Redirect button logic
  useEffect(() => {
    const btn = document.querySelector('button.bg-red-600[type="submit"]');
    if (!btn) return;

    const handleClick = (e: Event) => {
      e.preventDefault();
      router.push('/attack');
    };

    btn.addEventListener('click', handleClick);
    return () => btn.removeEventListener('click', handleClick);
  }, [router]);


  // Load profle name
useEffect(() => {
  const fetchProfileName = async () => {
    const userId = sessionStorage.getItem('id');

    if (!userId) {
      setError('Keine Benutzer-ID gefunden.');
      setLoading(false);
      return;
    }

    const profileName = await loadOwnPlayer(userId);
    setProfileName(profileName);
  };

  fetchProfileName();
}, [loadOwnPlayer]);

  // Load profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      const picData = await loadProfilePicture();
      if (picData && picData.url) {
        setProfilePic(picData.url);
      }
    };
    fetchProfilePicture();
  }, [loadProfilePicture]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 p-6">
      <Snowfall />
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          A-ho-ho-hoi {profileName ?? ''} !
        </h2>
        {/* Profile picture */}
        <div className="flex flex-col items-center mb-6">
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profilbild"
              className="w-30 h-30 rounded-full border-2 border-white/50 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-white/50 bg-white/10 flex items-center justify-center">
              <Snowflake className="w-10 h-10 text-white/50 animate-spin-slow" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-8">Vergangene Angriffe</h2>

        {/* Loading or error state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <Snowflake className="w-12 h-12 text-white animate-spin-slow mb-3" />
            <p className="text-sm text-white/80">Lade Angriffe...</p>
          </div>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : attacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <Snowflake className="w-12 h-12 text-white animate-spin-slow mb-3" />
            <p className="text-sm text-white/80">Keine Angriffe vorhanden</p>
          </div>
        ) : (
          <div className="w-full max-h-80 overflow-y-auto overflow-x-hidden">
  <table className="w-full table-auto bg-white/5 rounded-md divide-y divide-white/10">
    <thead>
      <tr className="text-left text-xs text-white/70">
        <th className="px-1 py-2">Angreifer</th>
        <th className="px-1 py-2">Verteidiger</th>
        <th className="px-1 py-2">Feld</th>
        <th className="px-1 py-2">Treffer</th>
        <th className="px-1 py-2">Tag</th>
        <th className="px-1 py-2">Versenkt</th>
      </tr>
    </thead>

    <tbody className="text-xs divide-y divide-white/5">
      {attacks.map((att, idx) => (
        <tr key={idx} className="hover:bg-white/5">
          <td className="px-1 py-2 text-white/90">
            {att.attackPic?.url ? (
              <img
                src={att.attackPic.url}
                alt="Angriffsbild"
                className="w-15 h-15 rounded-full border-2 border-white/50 object-cover cursor-pointer"
                onClick={() => setModalImg(att.attackPic.url)}
              />
            ) : (
              att.userName ?? '-'
            )}
          </td>
          <td className="px-1 py-2 text-white/90">{att.targetName ?? '-'}</td>
          <td className="px-1 py-2 text-white/90">{att.targetPos ?? '-'}</td>
          <td className="px-1 py-2 text-white/90">
            {att.isHit === null ? '-' : att.isHit ? '✅' : '❌'}
          </td>
          <td className="px-1 py-2 text-white/90">{att.date ?? '-'}</td>
          <td className="px-1 py-2 text-white/90">
            {att.isSunk === null ? '-' : att.isSunk ? '⚓' : '❌'}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        )}

        <button
          type="submit"
          className="w-full py-3 mt-4 bg-red-600 text-white rounded-xl hover:bg-red-500 transition duration-200"
        >
          Angriff starten
        </button>
      </div>
      {modalImg && (
  <div 
    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    onClick={() => setModalImg(null)}
  >
    <img
      src={modalImg}
      className="max-w-[100%] max-h-[100%] rounded-xl shadow-xl"
      alt="Preview"
    />
  </div>
)}

    </div>
  );
};

export default AttackHistory;
