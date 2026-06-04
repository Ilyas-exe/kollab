// src/layouts/MainLayout.jsx

import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const MainLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-wrap py-8">
        {/* Render children if provided, otherwise use Outlet for nested routes */}
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default MainLayout;