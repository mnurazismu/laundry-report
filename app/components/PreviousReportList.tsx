'use client'

import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { DailyReport } from '../types/report';
import { useAuth } from './AuthProvider';

const PreviousReportsList: React.FC = () => {
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
        });
      });
      setReports(fetchedReports);
      setIsLoading(false);
    };

    fetchReports();
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
    </div>;
  }

  return (
    <div className="bg-white dark:bg-primary-700 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-primary-800 dark:text-primary-100">Previous Reports</h2>
      {reports.length === 0 ? (
        <p className="text-primary-600 dark:text-primary-300">No reports found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-200 dark:divide-primary-600">
            <thead className="bg-primary-50 dark:bg-primary-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Income</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Previous Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Result</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-primary-700 divide-y divide-primary-200 dark:divide-primary-600">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                    {report.date instanceof Date ? report.date.toLocaleDateString('id-ID') : report.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                    {formatCurrency(report.income)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                    {formatCurrency(report.expenses)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                    {formatCurrency(report.previousBalance || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-800 dark:text-primary-100">
                    {formatCurrency(report.result || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PreviousReportsList;