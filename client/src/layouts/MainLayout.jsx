// src/layouts/MainLayout.jsx

import { Outlet } from 'react-router-dom';
import Header from '../components/Header'; // We will update Header next

const MainLayout = () => {
  return (
    // Use the new 'background' color for the entire page
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto p-6">
        {/* This <Outlet> is where React Router will render the active page */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default MainLayout;