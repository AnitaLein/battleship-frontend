'use client';
import React, { useState, useEffect } from 'react';
import { Gift, Lock, LogIn, Loader2, Snowflake } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

interface InputFieldProps {
  Icon: React.ComponentType<any>;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

// --- Snowfall Component ---
const Snowfall: React.FC = () => {
  const [flakes, setFlakes] = useState<{ id: number; left: string; size: string; duration: string }[]>([]);

  useEffect(() => {
    const createFlake = () => {
      const id = Math.random();
      const left = Math.random() * 100 + '%';
      const size = Math.random() * 8 + 4 + 'px'; // 4–12px snowflakes
      const duration = Math.random() * 5 + 5 + 's'; // 5–10s fall
      setFlakes((prev) => [...prev.slice(-70), { id, left, size, duration }]);
    };
    const interval = setInterval(createFlake, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full opacity-70 animate-fall"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDuration: flake.duration,
          }}
        ></div>
      ))}

      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0.1;
          }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

// --- Main App ---
function LoginContent() {
  const router = useRouter();
  const { login, teamCreated } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: string }>({ text: '', type: '' });

  // ✅ Make function async to use await
 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleLogin called');
    if (!username || !password) {
      setError('Anmeldename und Passwort dürfen nicht leer sein.');
      return;
    }
    const res = await login(username, password);
    try {
      sessionStorage.setItem('id', res.id);
    } catch (err) {
      console.error('Failed to save session storage', err);
    }
    console.log('Login response received:', res);
    if (res.id) {
      console.log(res.id)
      const checkIfTeamExists = await teamCreated(res.id)
      console.log(checkIfTeamExists)
      if (checkIfTeamExists) {
        router.push('/main')
      } else {
        router.push('/createTeam')
      }
  
    } else {
      setError('Falscher Anmeldename oder Passwort.');
    }

  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 p-6 overflow-hidden">
      <Snowfall />
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
        <div className="flex justify-center mb-6">
          <Snowflake className="w-12 h-12 text-white animate-spin-slow" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-8">Advenzkalender Anmeldung</h2>
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg text-center ${
              message.type === 'success' ? 'bg-green-600/30 text-green-200' : 'bg-red-600/30 text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Benutzername" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 mb-4 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50" />
          <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-4 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50" />
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-red-600 text-white rounded-xl hover:bg-red-500 transition duration-200"
          >
            Login
          </button>
          {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return <LoginContent />;
}
