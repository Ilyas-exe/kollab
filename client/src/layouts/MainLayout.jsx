// src/layouts/MainLayout.jsx

import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const MainLayout = ({ children }) => {
  return (
    // Use the new 'background' color for the entire page
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto p-6">
        {/* Render children if provided, otherwise use Outlet for nested routes */}
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default MainLayout;