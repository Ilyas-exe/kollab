// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout
import MainLayout from './layouts/MainLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkspaceDetailPage from './pages/WorkspaceDetailPage';
import ProjectBoardPage from './pages/ProjectBoardPage';
import AcceptInvitationPage from './pages/AcceptInvitationPage';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Landing page first */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/accept-invitation" element={<AcceptInvitationPage />} />

          {/* This is the new structure for Private Routes */}
          <Route 
            path="/dashboard" 
            element={<PrivateRoute><MainLayout><DashboardPage /></MainLayout></PrivateRoute>} 
          />
          <Route 
            path="/workspaces/:workspaceId" 
            element={<PrivateRoute><MainLayout><WorkspaceDetailPage /></MainLayout></PrivateRoute>} 
          />
          <Route 
            path="/projects/:projectId" 
            element={<PrivateRoute><MainLayout><ProjectBoardPage /></MainLayout></PrivateRoute>} 
          />
          <Route 
            path="/projects/:projectId/invoices" 
            element={<PrivateRoute><MainLayout><ProjectBoardPage initialTab="invoices" /></MainLayout></PrivateRoute>} 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;