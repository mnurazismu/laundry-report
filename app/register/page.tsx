import PublicRoute from '../components/PublicRoute';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-100 to-primary-200 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-primary-700 p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4 text-primary-800 dark:text-primary-100">Register for Laundry Report</h1>
          <RegisterForm />
        </div>
      </div>
    </PublicRoute>
  );
}