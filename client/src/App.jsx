import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkspaceDetailPage from './pages/WorkspaceDetailPage';
import PrivateRoute from './components/PrivateRoute';
import ProjectBoardPage from './pages/ProjectBoardPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          

          <Route element={<PrivateRoute />}>
            <Route path="/workspaces/:workspaceId" element={<WorkspaceDetailPage />} />
          </Route>
          <Route element={<PrivateRoute />}>
          <Route path="/projects/:projectId" element={<ProjectBoardPage />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;