'use client'

import React, { useState } from 'react';
import DailyReportForm from '@/app/components/DailyReportForm';
import PreviousReportsList from '@/app/components/PreviousReportList';

const DailyReportsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-primary-100 dark:bg-primary-800 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-100">Daily Reports</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            {showForm ? 'Close Form' : 'Add New Report'}
          </button>
        </div>
        
        {showForm && (
          <div className="bg-white dark:bg-primary-700 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-primary-800 dark:text-primary-100">Submit New Report</h2>
            <DailyReportForm />
          </div>
        )}
        
        <PreviousReportsList />
      </div>
    </div>
  );
};

export default DailyReportsPage;