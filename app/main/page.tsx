'use client';
import React, { useState, useEffect } from 'react';
import { Snowflake } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAttacks } from '@/hooks/useAttacks';

const AttackHistory: React.FC = () => {
  const [attacks, setAttacks] = useState<any[]>([]);
  const {getAllAttacks} = useAttacks();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        console.log(userId)
        const data = await getAllAttacks(userId);
        setAttacks(Array.isArray(data) ? data : []);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
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
          <div className="w-full overflow-x-hidden">
          <table className="w-full table-auto bg-white/5 rounded-lg divide-y divide-white/10">
            <thead>
              <tr className="text-left text-sm text-white/80">
                <th className="px-2 py-3">Angreifer</th>
                <th className="px-2 py-3">Verteidiger</th>
                <th className="px-2 py-3">Position</th>
                <th className="px-2 py-3">Treffer</th>
                <th className="px-2 py-3">Datum</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/6">
              {attacks.map((att, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="px-2 py-3 text-white/90">{att.userName ?? '-'}</td>
                  <td className="px-2 py-3 text-white/90">{att.targetName ?? '-'}</td>
                  <td className="px-2 py-3 text-white/90">{att.targetPos ?? '-'}</td>
                  <td className="px-2 py-3 text-white/90">{att.isHit === null ? '-' : att.isHit ? '✅ Ja' : '❌ Nein'}</td>
                  <td className="px-2 py-3 text-white/90">{att.date ?? '-'}</td>
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
    </div>
  );
};

export default AttackHistory;
