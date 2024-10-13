import React, { useState } from 'react';

interface AdminLoginPopupProps {
  onLogin: (username: string, password: string) => void;
}

const AdminLoginPopup: React.FC<AdminLoginPopupProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
    <video
      autoPlay
      loop
      muted
      className="absolute z-0 w-full h-full object-cover"
    >
      <source src="/video/starseffect.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-transparent border border-zinc-400/50 backdrop-blur-sm p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 border rounded bg-transparent border-zinc-400/50 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded bg-transparent border-zinc-400/50 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-transparent text-white p-2 rounded-xl border border-zinc-400/50 hover:border-zinc-400/90 hover:bg-zinc-400/10 transition-all duration-300"
          >
            Let me in
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default AdminLoginPopup;
