'use client'

import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthProvider';
import { format } from 'date-fns';
import Link from 'next/link';

interface MonthlyReport {
  id: string;
  month: string;
  totalIncome: number;
  totalExpenses: number;
  netResult: number;
}

const MonthlyReportList: React.FC = () => {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
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
      const dailyReports = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Aggregate daily reports into monthly reports
      const monthlyReports: { [key: string]: MonthlyReport } = {};
      dailyReports.forEach((report: any) => {
        const month = format(report.date.toDate(), 'yyyy-MM');
        if (!monthlyReports[month]) {
          monthlyReports[month] = {
            id: month,
            month: month,
            totalIncome: 0,
            totalExpenses: 0,
            netResult: 0
          };
        }
        monthlyReports[month].totalIncome += report.income;
        monthlyReports[month].totalExpenses += report.expenses;
        monthlyReports[month].netResult += (report.income - report.expenses);
      });

      setReports(Object.values(monthlyReports));
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
      <h2 className="text-2xl font-semibold mb-4 text-primary-800 dark:text-primary-100">Monthly Reports</h2>
      {reports.length === 0 ? (
        <p className="text-primary-600 dark:text-primary-300">No reports found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-200 dark:divide-primary-600">
            <thead className="bg-primary-50 dark:bg-primary-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Total Income</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Total Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Net Result</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-primary-700 divide-y divide-primary-200 dark:divide-primary-600">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                    {format(new Date(report.month), 'MMMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                    {formatCurrency(report.totalIncome)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                    {formatCurrency(report.totalExpenses)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-800 dark:text-primary-100">
                    {formatCurrency(report.netResult)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/report/monthly-report/${report.month}`} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                      View Details
                    </Link>
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

export default MonthlyReportList;