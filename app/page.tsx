import Link from "next/link";
import React from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-white dark:bg-primary-200 p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-primary-700 dark:text-primary-100">
        {title}
      </h3>
      <p className="text-primary-600 dark:text-primary-300">{description}</p>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-b from-primary-100 to-primary-200 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-primary-800 dark:text-primary-100">
          Simplify Your Laundry Business
        </h1>
        <p className="text-lg mb-8 text-primary-700 dark:text-primary-200">
          Laundry Report: Boost your efficiency and grow your business with our
          powerful tools.
        </p>
        <Link href="/dashboard">
          <button className="bg-primary-500 hover:bg-primary-600 min-w-80 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
            Get Started
          </button>
        </Link>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon="🧺"
            title="Easy Tracking"
            description="Keep tabs on all your laundry orders effortlessly"
          />
          <FeatureCard
            icon="📊"
            title="Detailed Reports"
            description="Get insights into your laundry business performance"
          />
          <FeatureCard
            icon="🚀"
            title="Boost Efficiency"
            description="Streamline your operations and save time"
          />
        </div>
      </main>

      <footer className="mt-16 text-primary-600 dark:text-primary-300">
        © {new Date().getFullYear()} Laundry Report. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
