import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from './dashboard';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}