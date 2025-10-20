// Fichier: /client/src/App.jsx (MODIFIÉ)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout'; // <-- AJOUT

// Components
import PrivateRoute from './components/PrivateRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkspaceDetailPage from './pages/WorkspaceDetailPage';
import ProjectBoardPage from './pages/ProjectBoardPage';
import AcceptInvitationPage from './pages/AcceptInvitationPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Routes Publiques */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
          
          {/* --- NOUVELLE STRUCTURE POUR LES ROUTES PRIVÉES --- */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}> {/* Le Layout englobe les pages */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/workspaces/:workspaceId" element={<WorkspaceDetailPage />} />
              <Route path="/projects/:projectId" element={<ProjectBoardPage />} />
            </Route>
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;