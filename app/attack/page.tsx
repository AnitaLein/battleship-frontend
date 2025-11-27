'use client';

import React, { useState, useEffect } from 'react';
import { Snowflake } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePlayers } from '@/hooks/usePlayers';
import { EnemyCard } from '@/components/enemyCard';
import { useAttacks } from '@/hooks/useAttacks';
import { ArrowLeft } from 'lucide-react';
import Dropdown from 'react-bootstrap/Dropdown';
import CoordinateSelector from '@/components/positionDropDown';
import { useImages } from '@/hooks/useImages';
import { Snowfall } from '@/components/snowfall';


function CreateTeam() {
  const router = useRouter();
  const { getAllEnemies } = usePlayers();
  const { postAttack } = useAttacks();
  const { loadEnemyProfilePicture } = useImages();

  const [selectedEnemy, setSelectedEnemy] = useState('');
  const [error, setError] = useState<string | null>(null);
  type EnemyWithPic = { enemy: string; enemyProfilePic: { url?: string } | null };
  const [enemies, setEnemies] = useState<EnemyWithPic[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [targetField, setTargetField] = useState('');

  useEffect(() => { setTimeout(() => {
    const userId = sessionStorage.getItem('id');
    if (!userId) {
      router.replace('/login'); // or router.push('/login')
    }
  }, 1000); }, [router]);
  // ✅ Load enemies once
  useEffect(() => {
    if (loaded) return;

    const loadEnemies = async () => {
      try {
        const userId = sessionStorage.getItem('id');
        if (!userId) {
          setError('Benutzer-ID fehlt.');
          return;
        }
        const data = await getAllEnemies(userId);
        const enemyData = await Promise.all(
          data.map(async (enemy: any) => {
            const enemyProfilePic = await loadEnemyProfilePicture(userId, enemy);
            if (enemyProfilePic && enemyProfilePic.url) {
              return { enemy, enemyProfilePic };
            } else {
              return { enemy, enemyProfilePic: null };
            }
          })
        );
        setEnemies(Array.isArray(enemyData) ? enemyData : []);
      } catch (err) {
        console.error(err);
        setError('Fehler beim Angriff.');
      } finally {
        // mark as loaded after the async work completes to avoid synchronous setState in effect
        setLoaded(true);
      }
    };

    loadEnemies();
  }, [loaded, getAllEnemies]);

  // ✅ Handle attack submission
  const handleAttackTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedEnemy) {
      setError('Bitte wähle einen Gegner aus.');
      return;
    }

    if (!targetField.trim()) {
      setError('Bitte gib ein Zielfeld ein');
      return;
    }

    try {
      const userId = sessionStorage.getItem('id');
      if (!userId) {
        setError('Benutzer-ID fehlt.');
        return;
      }

      const res = await postAttack(userId, selectedEnemy, targetField);
      if(!res.success){
        setError(res.message);
        return;
      }
      router.push(`/attackResponse?hit=${res.isHit}&field=${targetField}&target=${selectedEnemy}&sunk=${res.isSunk}&attackId=${res.id}`);
    } catch (err) {
      console.error(err);
      setError('Fehler beim Angriff.');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 p-6 overflow-hidden">
      <Snowfall />
      <div className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
        <div className="flex justify-center mb-6">
          <div className='absolute top-5 left-5'>
          <button
              type="button"
              onClick={() => router.push('/main')}
              className="w-10 py-2 mt-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
          </button>    
          </div>
          <Snowflake className="w-12 h-12 text-white animate-spin-slow" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Starte einen neuen Angriff!
        </h2>

        <h3 className="text-xl font-bold text-white text-center mb-4">
          Wähle deinen Gegner:
        </h3>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
        {enemies.length > 0 ? (
          enemies.map((enemyObj) => (
            enemyObj.enemyProfilePic ? (
            <EnemyCard
              key={enemyObj.enemy}
              name={enemyObj.enemy}
              selected={selectedEnemy === enemyObj.enemy}
              onClick={() => setSelectedEnemy(enemyObj.enemy)}
              imageSrc={enemyObj.enemyProfilePic}
            />
          ) : (
            <div key={enemyObj.enemy} className="w-20 h-20 rounded-full border-2 border-white/50 bg-white/10 flex items-center justify-center">
              <Snowflake className="w-10 h-10 text-white/50 animate-spin-slow" />
            </div>
          )
        ))) : (
          <p className="text-white text-center w-full">
            Keine Gegner gefunden...
          </p>
        )}

        </div>

        <form className="flex flex-wrap justify-center gap-3 mb-6" onSubmit={handleAttackTeam}>
          <CoordinateSelector setTargetField={setTargetField} />
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-red-600 text-white rounded-xl hover:bg-red-500 transition duration-200"
          >
            Angreifen!
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
