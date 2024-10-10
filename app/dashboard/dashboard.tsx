"use client";

import Link from "next/link";
import { useAuth } from "../components/AuthProvider";
import SignOut from "../components/SignOut";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-primary-100 dark:bg-primary-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-100">
            Welcome back, {user?.name || "User"}!
          </h1>
          <SignOut />
        </div>

        <p className="text-xl mb-8 text-primary-700 dark:text-primary-200">
          What would you like to do today?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard
            title="Daily Report"
            description="View and analyze your daily laundry operations"
            icon="📅"
            href="/dashboard/daily-report"
          />
          <FeatureCard
            title="Weekly Report"
            description="Get insights into your weekly performance"
            icon="📊"
            href="/dashboard/weekly-report"
          />
          <FeatureCard
            title="Monthly Report"
            description="Analyze long-term trends and monthly statistics"
            icon="📈"
            href="/dashboard/monthly-report"
          />
          <FeatureCard
            title="Generate Invoice"
            description="Create and manage invoices for your customers"
            icon="📄"
            href="/dashboard/generate-invoice"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  href,
}) => {
  return (
    <Link href={href} className="block">
      <div className="bg-white dark:bg-primary-200 p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-primary-700 dark:text-primary-100">
          {title}
        </h3>
        <p className="text-primary-600 dark:text-primary-300">{description}</p>
      </div>
    </Link>
  );
};
