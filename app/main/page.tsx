'use client';
import React, { useState } from 'react';
import { Gift, Lock, LogIn, Loader2, Snowflake } from 'lucide-react'; // Using Gift for email now!
import { useAttacks } from '../../hooks/useAttacks';


// Main App Component
const App: React.FC = () => {

  const [message, setMessage] = useState<{ text: string; type: string }>({ text: '', type: '' }); // type: 'success' | 'error'
  const attacks = useAttacks();
React.useEffect(() => {
    const selector = 'button.bg-red-600[type="submit"]';
    const btn = document.querySelector(selector) as HTMLButtonElement | null;
    if (!btn) return;

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        // redirect to the desired route
        window.location.href = '/attack';
    };

    btn.addEventListener('click', handleClick);
    return () => btn.removeEventListener('click', handleClick);
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
              <h2 className="text-2xl font-bold text-white text-center mb-8">Vergangene Angriffe</h2>
        <div className="mb-6">
          {attacks && attacks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white/5 rounded-lg divide-y divide-white/10">
            <thead>
              <tr className="text-left text-sm text-white/80">
                <th className="px-4 py-3">Angreifer</th>
                <th className="px-4 py-3">Verteidiger</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Treffer</th>
                <th className="px-4 py-3">Datum</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/6">
              {attacks.map((att: any, idx: number) => (
                <tr key={att?.id ?? idx} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white/90">{att?.id ?? '-'}</td>
                  <td className="px-4 py-3 text-white/90">{att?.attacker ?? att?.from ?? '-'}</td>
                  <td className="px-4 py-3 text-white/90">{att?.target ?? att?.to ?? '-'}</td>
                  <td className="px-4 py-3 text-white/90">{att?.result ?? att?.outcome ?? '-'}</td>
                  <td className="px-4 py-3 text-white/90">
                {att?.createdAt ? new Date(att.createdAt).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Snowflake className="w-12 h-12 text-white animate-spin-slow mb-3" />
              <p className="text-sm text-white/80">Keine Angriffe vorhanden</p>
            </div>
          )}
        </div>
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

export default App;