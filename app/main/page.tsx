'use client';
import React, { useState } from 'react';
import { Gift, Lock, LogIn, Loader2, Snowflake } from 'lucide-react'; // Using Gift for email now!

interface InputFieldProps {
  Icon: React.ComponentType<any>;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Declare InputField outside of App to avoid creating components during render
const InputField: React.FC<InputFieldProps> = ({ Icon, type, value, onChange, placeholder, disabled = false }) => (
  <div className="relative mb-6">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Icon className="w-5 h-5 text-red-400" /> {/* Christmas red for icons */}
    </div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-red-300 text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-white/70 disabled:opacity-75 disabled:cursor-not-allowed shadow-inner"
    />
  </div>
);

// Main App Component
const App: React.FC = () => {
  const MOCK_EMAIL = 'santa@northpole.com';
  const MOCK_PASSWORD = 'hohoho';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: string }>({ text: '', type: '' }); // type: 'success' | 'error'
  
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: 'Please fill in both naughty list (email) and nice list (password).', type: 'error' });
      return;
    }
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    // Simulate an API call delay
    setTimeout(() => {
      setIsLoading(false);
      if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
        setMessage({
          text: 'Login successful! Merry Christmas from the North Pole!',
          type: 'success',
        });
        // Clear inputs on success
        setEmail('');
        setPassword('');
      } else {
        setMessage({
          text: 'Invalid festive credentials. Try ' + MOCK_EMAIL + ' / ' + MOCK_PASSWORD,
          type: 'error',
        });
      }
    }, 2000); // 2-second delay
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
        <div className="flex justify-center mb-6">
          <Snowflake className="w-12 h-12 text-white animate-spin-slow" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-8">North Pole Login</h2>
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg text-center ${
              message.type === 'success' ? 'bg-green-600/30 text-green-200' : 'bg-red-600/30 text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;