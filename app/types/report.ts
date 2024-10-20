import { Timestamp } from 'firebase/firestore';

export interface DailyReport {
  id: string;
  date: Date | string;
  income: number;
  expenses: number;
  previousBalance?: number;
  result?: number;
  balance?: number;
}

export interface MonthlyReport {
  id: string;
  month: string;
  totalIncome: number;
  totalExpenses: number;
  netResult: number;
}

export interface FirestoreDailyReport {
  id: string;
  date: Timestamp;
  income: number;
  expenses: number;
  previousBalance: number;
  result: number;
  userId: string;
}