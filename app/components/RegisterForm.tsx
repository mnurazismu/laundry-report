'use client'

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ActivityIndicator from './ActivityIndicator';
import Modal from './Modal';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
      });
      setIsModalOpen(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000); // 3 seconds delay
    } catch (error) {
      setError('Failed to register. Please try again.');
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
    }, 1000); // 500ms delay
  };

  return (
    <>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          required
          className="w-full p-2 border rounded bg-primary-100 dark:bg-primary-600 text-primary-800 dark:text-primary-100"
        />
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
          {isLoading ? <ActivityIndicator /> : 'Register'}
        </button>
        <p className="text-center text-black dark:text-primary-300">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-500 hover:underline">
            Login here
          </Link>
        </p>
      </form>
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <h2 className="text-xl font-bold mb-2">Registration Successful!</h2>
        <p>Your account has been created. Click close to go to the dashboard.</p>
      </Modal>
    </>
  );
};

export default RegisterForm;