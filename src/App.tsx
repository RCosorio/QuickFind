import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import BusinessLogin from './pages/BusinessLogin';
import BusinessRegister from './pages/BusinessRegister';
import Dashboard from './pages/Dashboard';
import BusinessDashboard from './pages/BusinessDashboard';

const NotFound = () => <div className="p-8 text-center"><h1 className="text-3xl">404 - Page Not Found</h1></div>;

// Protected route component
const ProtectedRoute = ({ children, requiresBusinessRole = false }: { children: React.ReactElement, requiresBusinessRole?: boolean }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiresBusinessRole && user?.role !== 'business') {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (!requiresBusinessRole && user?.role !== 'student') {
    return <Navigate to="/business-dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/business-login" element={<BusinessLogin />} />
          <Route path="/business-register" element={<BusinessRegister />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/business-dashboard" 
            element={
              <ProtectedRoute requiresBusinessRole>
                <BusinessDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
