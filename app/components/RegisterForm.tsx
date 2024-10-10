'use client'

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
      });

      router.push('/dashboard');
    } catch (error) {
      setError('Failed to register. Please try again.');
      console.error(error);
    }
  };

  return (
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
      <button type="submit" className="w-full p-2 bg-primary-500 hover:bg-primary-600 text-white rounded transition duration-300 ease-in-out transform hover:scale-105">
        Register
      </button>
      <p className="text-center text-black dark:text-primary-300">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-500 hover:underline">
          Login here
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;