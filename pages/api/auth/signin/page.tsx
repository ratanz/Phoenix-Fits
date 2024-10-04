'use client'

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('credentials', { username, password, callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 rounded"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Sign In
          </button>
        </form>
        <button
          onClick={() => signIn('google')}
          className="w-full bg-red-500 text-white p-2 rounded mt-4"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
}