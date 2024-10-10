'use client'

import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const SignOut: React.FC = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button onClick={handleSignOut} className="p-2 bg-red-500 text-white rounded">
      Sign Out
    </button>
  );
};

export default SignOut;