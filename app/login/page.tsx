import PublicRoute from '../components/PublicRoute';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-100 to-primary-200 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-primary-700 p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4 text-primary-800 dark:text-primary-100">Login to Laundry Report</h1>
          <LoginForm />
        </div>
      </div>
    </PublicRoute>
  );
}