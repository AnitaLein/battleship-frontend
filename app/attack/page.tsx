'use client';

import React, { useState, useEffect } from 'react';
import { Snowflake } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePlayers } from '@/hooks/usePlayers';
import { EnemyCard } from '@/components/enemyCard';
import { useAttacks } from '@/hooks/useAttacks';

function CreateTeam() {
  const router = useRouter();
  const { getAllEnemies } = usePlayers();
  const { postAttack } = useAttacks();

  const [selectedEnemy, setSelectedEnemy] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enemies, setEnemies] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [targetField, setTargetField] = useState('');

  useEffect(() => {
    const userId = sessionStorage.getItem('id');
    if (!userId) {
      router.replace('/login'); // or router.push('/login')
    }
  }, [router]);
  // ✅ Load enemies once
  useEffect(() => {
    if (loaded) return;
    setLoaded(true);

    const loadEnemies = async () => {
      try {
        const userId = sessionStorage.getItem('id');
        if (!userId) {
          setError('Benutzer-ID fehlt.');
          return;
        }

        const data = await getAllEnemies(userId);
        if (Array.isArray(data)) {
          setEnemies(data);
        } else if (data?.enemies) {
          setEnemies(data.enemies);
        } else {
          setEnemies([]);
        }
      } catch (err) {
        console.error(err);
        setError('Fehler beim Laden der Gegner.');
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
      setError('Bitte gib ein Zielfeld ein (z.B. A1, C5).');
      return;
    }

    try {
      const userId = sessionStorage.getItem('id');
      if (!userId) {
        setError('Benutzer-ID fehlt.');
        return;
      }

      const res = await postAttack(userId, selectedEnemy, targetField);
      console.log('Attack result:', res);

      router.push('/main'); // redirect after attack
    } catch (err) {
      console.error(err);
      setError('Fehler beim Angriff.');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 p-6 overflow-hidden">
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
        <div className="flex justify-center mb-6">
          <Snowflake className="w-12 h-12 text-white animate-spin-slow" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Starte einen neuen Angriff!
        </h2>

        <h3 className="text-xl font-bold text-white text-center mb-4">
          Wähle deinen Gegner:
        </h3>

        {/* Enemies list */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {enemies.length > 0 ? (
            enemies.map((enemy) => (
              <EnemyCard
                key={enemy}
                name={enemy}
                selected={selectedEnemy === enemy}
                onClick={() => setSelectedEnemy(enemy)}
              />
            ))
          ) : (
            <p className="text-white text-center w-full">
              Keine Gegner gefunden...
            </p>
          )}
        </div>

        <form onSubmit={handleAttackTeam}>
          <input
            type="text"
            placeholder="Welches Feld greift ihr an?"
            value={targetField}
            onChange={(e) => setTargetField(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <p className="text-white text-center w-full">
            Beispiel Schreibweise: A1, C5,...
          </p>
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
