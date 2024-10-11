'use client'

import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '@/app/components/AuthProvider';
import { db } from '@/app/lib/firebase';
import DailyReportForm from '@/app/components/DailyReportForm';

interface DailyReport {
  id: string;
  date: Date;
  income: number;
  expenses: number;
  previousBalance: number;
  result: number;
  createdAt: Date;
}

const DailyReportsPage: React.FC = () => {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;
      const reportsRef = collection(db, 'dailyReports');
      const q = query(
        reportsRef,
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedReports: DailyReport[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedReports.push({
          id: doc.id,
          date: data.date.toDate(),
          income: data.income,
          expenses: data.expenses,
          previousBalance: data.previousBalance,
          result: data.result,
          createdAt: data.createdAt.toDate(),
        });
      });
      setReports(fetchedReports);
      setIsLoading(false);
    };

    fetchReports();
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 shadow-md">
      <h1 className="text-2xl text-center font-bold mb-4 border-b border-blue-300 dark:border-blue-500 pb-1">Daily Reports</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Submit New Report</h2>
        <DailyReportForm />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Previous Reports</h2>
        {reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          <ul className="space-y-4">
            {reports.map((report) => (
              <li key={report.id} className="border p-4 rounded-md">
                <p>Date: {report.date.toLocaleDateString()}</p>
                <p>Income: ${report.income.toFixed(2)}</p>
                <p>Expenses: ${report.expenses.toFixed(2)}</p>
                <p>Previous Balance: ${report.previousBalance.toFixed(2)}</p>
                <p>Result: ${report.result.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DailyReportsPage;