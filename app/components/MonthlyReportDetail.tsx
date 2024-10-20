import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/app/components/AuthProvider";
import { format, subDays } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface DailyReport {
  id: string;
  date: Date;
  income: number;
  expenses: number;
  balance: number;
}

interface MonthlyReportDetailProps {
  month: string;
}

const MonthlyReportDetail: React.FC<MonthlyReportDetailProps> = ({ month }) => {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      if (!user || !month) {
        console.log("User or month is missing:", { user, month });
        setIsLoading(false);
        return;
      }

      const [year, monthIndex] = month.split("-").map(Number);
      const startDate = new Date(year, monthIndex - 1, 1);
      const endDate = new Date(year, monthIndex, 0);

      console.log("Date range:", { startDate, endDate });

      

      // Fetch the balance from the day before the start of the month
      const previousDayDate = subDays(startDate, 1);
      console.log("Previous day date:", previousDayDate);
      const previousDayQuery = query(
        collection(db, "dailyReports"),
        where("userId", "==", user.uid),
        where("date", "<=", previousDayDate),
        orderBy("date", "desc"),
        limit(1)
      );

      const previousDaySnapshot = await getDocs(previousDayQuery);
      let initialBalance = 0;
      if (!previousDaySnapshot.empty) {
        initialBalance = previousDaySnapshot.docs[0].data().previousBalance || 0;
      }

      const reportsRef = collection(db, "dailyReports");
      const q = query(
        reportsRef,
        where("userId", "==", user.uid),
        where("date", ">=", startDate),
        where("date", "<=", endDate),
        orderBy("date", "asc")
      );

      try {
        const querySnapshot = await getDocs(q);
        console.log("Query snapshot size:", querySnapshot.size);

        let runningBalance = initialBalance;
        const fetchedReports: DailyReport[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const dailyResult = data.income - data.expenses;
          runningBalance += dailyResult;
          return {
            id: doc.id,
            date: data.date.toDate(),
            income: data.income,
            expenses: data.expenses,
            balance: runningBalance,
          };
        });

        console.log("Fetched reports:", fetchedReports);
        setReports(fetchedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [user, month]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(
      `Monthly Report - ${format(new Date(month), "MMMM yyyy")}`,
      14,
      15
    );

    const tableColumn = [
      "Date",
      "Income",
      "Expenses",
      "Daily Result",
      "Balance",
    ];
    const tableRows = reports.map((report) => [
      format(report.date, "dd/MM/yyyy"),
      formatCurrency(report.income),
      formatCurrency(report.expenses),
      formatCurrency(report.income - report.expenses),
      formatCurrency(report.balance),
    ]);

    const totalIncome = reports.reduce((sum, report) => sum + report.income, 0);
    const totalExpenses = reports.reduce(
      (sum, report) => sum + report.expenses,
      0
    );
    const netResult = totalIncome - totalExpenses;
    const finalBalance =
      reports.length > 0 ? reports[reports.length - 1].balance : 0;

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [242, 242, 242] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 30;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Monthly Summary:", 14, finalY + 10);

    (doc as any).autoTable({
      head: [
        ["", "Total Income", "Total Expenses", "Net Result", "Final Balance"],
      ],
      body: [
        [
          "",
          formatCurrency(totalIncome),
          formatCurrency(totalExpenses),
          formatCurrency(netResult),
          formatCurrency(finalBalance),
        ],
      ],
      startY: finalY + 15,
      theme: "grid",
      styles: { fontSize: 10, fontStyle: "bold" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      bodyStyles: { fillColor: [200, 220, 255] },
    });

    doc.save(`monthly-report-${month}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const totalIncome = reports.reduce((sum, report) => sum + report.income, 0);
  const totalExpenses = reports.reduce(
    (sum, report) => sum + report.expenses,
    0
  );
  const netResult = totalIncome - totalExpenses;
  const finalBalance =
    reports.length > 0 ? reports[reports.length - 1].balance : 0;

  return (
    <div className="min-h-screen bg-primary-100 dark:bg-primary-800 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-100">
            Monthly Report - {format(new Date(month), "MMMM yyyy")}
          </h1>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            Download PDF
          </button>
        </div>

        <div className="bg-white dark:bg-primary-700 p-6 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-200 dark:divide-primary-600">
            <thead className="bg-primary-50 dark:bg-primary-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Expenses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Daily Result
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-primary-700 divide-y divide-primary-200 dark:divide-primary-600">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                    {format(report.date, "dd/MM/yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                    {formatCurrency(report.income)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                    {formatCurrency(report.expenses)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-800 dark:text-primary-100">
                    {formatCurrency(report.income - report.expenses)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-800 dark:text-primary-100">
                    {formatCurrency(report.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-primary-50 dark:bg-primary-800 font-bold">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                  Monthly Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                  {formatCurrency(totalIncome)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                  {formatCurrency(totalExpenses)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                  {formatCurrency(netResult)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-800 dark:text-primary-100">
                  {formatCurrency(finalBalance)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReportDetail;
