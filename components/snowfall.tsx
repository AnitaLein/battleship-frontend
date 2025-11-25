
import React, { useState, useEffect } from 'react';


export const Snowfall: React.FC = () => {
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