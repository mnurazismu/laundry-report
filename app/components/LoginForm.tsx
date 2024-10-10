'use client'

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ActivityIndicator from './ActivityIndicator';
import Modal from './Modal';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsModalOpen(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000); // 3 seconds delay
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Add a delay before redirecting
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000); // 500ms delay
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 border rounded bg-primary-100 dark:bg-primary-600 text-primary-800 dark:text-primary-100"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 border rounded bg-primary-100 dark:bg-primary-600 text-primary-800 dark:text-primary-100"
        />
        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
        <button 
          type="submit" 
          className="w-full p-2 bg-primary-500 hover:bg-primary-600 text-white rounded transition duration-300 ease-in-out transform hover:scale-105 flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator /> : 'Login'}
        </button>
        <p className="text-center text-black dark:text-primary-300">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary-500 hover:underline">
            Register here
          </Link>
        </p>
      </form>
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <h2 className="text-xl font-bold mb-2">Login Successful!</h2>
        <p>You have successfully logged in. Click close to go to the dashboard.</p>
      </Modal>
    </>
  );
};

export default LoginForm;