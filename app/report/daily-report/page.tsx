'use client'

import DailyReportForm from '@/app/components/DailyReportForm';
import PreviousReportsList from '@/app/components/PreviousReportList';
import React from 'react';
const DailyReportsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary-100 dark:bg-primary-800 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-100">Daily Reports</h1>
        <div className="bg-white dark:bg-primary-700 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-primary-800 dark:text-primary-100">Submit New Report</h2>
          <DailyReportForm />
        </div>
        <PreviousReportsList />
      </div>
    </div>
  );
};

export default DailyReportsPage;