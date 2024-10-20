'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import MonthlyReportDetail from '@/app/components/MonthlyReportDetail';

export default function MonthlyReportPage() {
  const params = useParams();
  const month = params?.month as string;

  console.log('MonthlyReportPage - Received month:', month);

  console.log('Page params:', params);
  console.log('Month from params:', month);

  if (!month) {
    return <div className="min-h-screen bg-primary-100 dark:bg-primary-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-100">Error</h1>
        <p className="mt-4 text-primary-600 dark:text-primary-300">No month specified. Please select a month from the monthly reports list.</p>
      </div>
    </div>;
  }

  return <MonthlyReportDetail month={month} />;
}