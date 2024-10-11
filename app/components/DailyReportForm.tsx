"use client";

import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthProvider";
import ActivityIndicator from "./ActivityIndicator";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";
import Swal from "sweetalert2";

// Buat tema kustom untuk DatePicker
const theme = createTheme({
  palette: {
    primary: {
      main: "#3B82F6", // Sesuaikan dengan warna primary Anda
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#60A5FA", // Warna border saat hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3B82F6", // Warna border saat fokus
          },
        },
      },
    },
  },
});

const DailyReportForm: React.FC = () => {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [previousBalance, setPreviousBalance] = useState("");
  const [result, setResult] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs().subtract(1, "day"));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const [activeInput, setActiveInput] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreviousBalance = async () => {
      if (!user) return;
      const reportsRef = collection(db, "dailyReports");
      const q = query(
        reportsRef,
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const lastReport = querySnapshot.docs[0].data();
        setPreviousBalance(lastReport.result.toString());
      }
    };

    fetchPreviousBalance();
  }, [user]);

  useEffect(() => {
    const incomeValue = parseFloat(income) || 0;
    const expensesValue = parseFloat(expenses) || 0;
    const previousBalanceValue = parseFloat(previousBalance) || 0;
    const calculatedResult = previousBalanceValue + incomeValue - expensesValue;
    setResult(calculatedResult.toFixed(2));
  }, [income, expenses, previousBalance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !date) {
      setError("You must be logged in and select a date to submit a report");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, "dailyReports"), {
        userId: user.uid,
        date: date.toDate(),
        income: parseFloat(income),
        expenses: parseFloat(expenses),
        previousBalance: parseFloat(previousBalance),
        result: parseFloat(result),
        createdAt: serverTimestamp(),
      });
      setIncome("");
      setExpenses("");
      setPreviousBalance("");
      setResult("");

      // Menggunakan SweetAlert2 untuk menampilkan pesan sukses
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Daily report submitted successfully!",
        confirmButtonColor: "#3B82F6", // Sesuaikan dengan warna tema Anda
      });
    } catch (error) {
      console.error(error);

      // Menggunakan SweetAlert2 untuk menampilkan pesan error
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to submit report. Please try again.",
        confirmButtonColor: "#3B82F6", // Sesuaikan dengan warna tema Anda
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "mt-1 block px-4 py-3 w-full rounded-md bg-primary-100 dark:bg-primary-600 text-primary-800 dark:text-primary-100 border-primary-300 dark:border-primary-500 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50";
  const labelClass = (inputId: string) =>
    `block text-sm font-medium ${
      activeInput === inputId
        ? "text-blue-500"
        : "text-primary-800 dark:text-primary-100"
    }`;

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className={labelClass("date")}>
              Date
            </label>
            <DatePicker
              value={date}
              onChange={(newDate) => setDate(newDate)}
              maxDate={dayjs()}
              format="DD/MM/YYYY"
              sx={{
                width: "100%",
                "& .MuiInputBase-root": {
                  borderRadius: "0.375rem",
                  backgroundColor: "rgb(219 234 254)",
                  color: "rgb(30 64 175)",
                  "&:hover": {
                    backgroundColor: "rgb(191 219 254)",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgb(147 197 253)",
                },
                "& .MuiIconButton-root": {
                  color: "rgb(30 64 175)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgb(59 130 246)",
                },
              }}
            />
          </div>
          <div>
            <label htmlFor="income" className={labelClass("income")}>
              Income
            </label>
            <input
              type="number"
              id="income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              onFocus={() => setActiveInput("income")}
              onBlur={() => setActiveInput(null)}
              required
              step="0.01"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="expenses" className={labelClass("expenses")}>
              Expenses
            </label>
            <input
              type="number"
              id="expenses"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              onFocus={() => setActiveInput("expenses")}
              onBlur={() => setActiveInput(null)}
              required
              step="0.01"
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="previousBalance"
              className={labelClass("previousBalance")}
            >
              Previous Balance
            </label>
            <input
              type="number"
              id="previousBalance"
              value={previousBalance}
              onChange={(e) => setPreviousBalance(e.target.value)}
              onFocus={() => setActiveInput("previousBalance")}
              onBlur={() => setActiveInput(null)}
              required
              step="0.01"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="result" className={labelClass("result")}>
              Result
            </label>
            <input
              type="number"
              id="result"
              value={result}
              readOnly
              className="mt-1 px-4 py-3 block w-full rounded-md bg-primary-200 dark:bg-primary-700 text-primary-800 dark:text-primary-100 border-primary-300 dark:border-primary-500"
            />
          </div>
          {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 bg-primary-500 hover:bg-primary-600 text-white rounded transition duration-300 ease-in-out transform hover:scale-105 flex justify-center items-center"
          >
            {isLoading ? <ActivityIndicator /> : "Submit Daily Report"}
          </button>
        </form>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DailyReportForm;
