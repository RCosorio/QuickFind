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
  const { isAuthenticated, user, businessAccount } = useAuth();
  
  console.log("ProtectedRoute check:", { 
    isAuthenticated, 
    hasUser: !!user, 
    hasBusinessAccount: !!businessAccount, 
    requiresBusinessRole 
  });
  
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // For business dashboard, check if we have a business account
  if (requiresBusinessRole && !businessAccount) {
    console.log("Business account required but not found, redirecting to dashboard");
    return <Navigate to="/login" replace />;
  }
  
  // For regular dashboard, redirect business accounts to business dashboard
  if (!requiresBusinessRole && businessAccount) {
    console.log("User has a business account, redirecting to business dashboard");
    return <Navigate to="/business-dashboard" replace />;
  }
  
  console.log("Rendering protected content for:", {
    user: user?.email,
    businessAccount: businessAccount?.email
  });
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
