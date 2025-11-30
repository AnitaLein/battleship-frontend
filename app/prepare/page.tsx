'use client';
import React, { useState, useEffect } from 'react';
import { Snowflake } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Snowfall } from '@/components/snowfall';
import { useImages } from '@/hooks/useImages';
import { usePlayers } from '@/hooks/usePlayers';
import { EnemyCard } from '@/components/enemyCard';

const FightPreparation: React.FC = () => {
  const router = useRouter();

  const { loadProfilePicture, loadEnemyProfilePicture } = useImages();
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
        const profileNameRes = await loadOwnPlayer(userId);
        const enemiesRes = await getAllEnemies(userId)
  
        const enemyData = await Promise.all(
          enemiesRes.map(async (enemy: any) => {
            if (enemy.name == "") return null;
            const enemyProfilePic = await loadEnemyProfilePicture(userId, enemy);
            if (enemyProfilePic && enemyProfilePic.url) {
              return { enemy, enemyProfilePic };
            } else {
              return { enemy, enemyProfilePic: null };
            }
          })
        );
        setEnemies(Array.isArray(enemyData) ? enemyData : []);
        setProfileName(profileNameRes);
      } catch (err) {
        console.error(err);
        setError('Fehler beim Laden der Daten.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [loadOwnPlayer, loadProfilePicture, getAllEnemies,loadEnemyProfilePicture]);

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
    <> 
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 p-6">
      <Snowfall />

      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Der Kampf geht im Dezember los, {profileName ?? ''}!
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

        <h3 className="text-xl text-white font-semibold text-center mb-4">Deine Gegner:</h3>

        {/* Loading / Error */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
        {enemies.length > 0 ? (
          enemies.map((enemyObj) => (
            enemyObj.enemyProfilePic ? (
            <EnemyCard
              key={enemyObj.enemy}
              name={enemyObj.enemy}
              imageSrc={enemyObj.enemyProfilePic.url}
            />
          ) : <></>
        ))) : (
          <p className="text-white text-center w-full">
            Keine Gegner gefunden...
          </p>
        )}

        </div>

      </div>
    </div>
    </>
  );
};

export default FightPreparation;
