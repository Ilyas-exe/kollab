// src/pages/DashboardPage.jsx

import { useAuth } from '../context/AuthContext';
import DashboardClientView from '../components/DashboardClientView';
import DashboardFreelancerView from '../components/DashboardFreelancerView';

const DashboardPage = () => {
  const { user, loading } = useAuth();

  console.log('🏠 DashboardPage - Loading:', loading, 'User:', user);

  // If the user data is still loading, show a loading message
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-text-secondary">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  console.log('🎯 Rendering dashboard for role:', user.role);

  // Check the user's role and render the appropriate component
  return (
    <div>
      {user.role === 'Client' ? <DashboardClientView /> : <DashboardFreelancerView />}
    </div>
  );
};

export default DashboardPage;