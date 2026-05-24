import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { useCustomizerStore } from './store/useCustomizerStore';

import Header from './components/Header';
import Landing from './components/Landing';
import ThreeViewer from './components/ThreeViewer';
import CustomizePanel from './components/CustomizePanel';
import RosterTable from './components/RosterTable';
import QuoteDashboard from './components/QuoteDashboard';
import Auth from './components/Auth';

function CustomizerLayout() {
  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 overflow-hidden h-[calc(100vh-64px)]">

      <div className="lg:col-span-1 h-full">
        <CustomizePanel />
      </div>

      <div className="lg:col-span-2 h-full relative">
        <ThreeViewer />
      </div>

      <div className="lg:col-span-1 h-full">
        <RosterTable />
      </div>

    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = useCustomizerStore((state) => state.token);

  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const fetchProducts = useCustomizerStore((state) => state.fetchProducts);
  const fetchUserDesigns = useCustomizerStore((state) => state.fetchUserDesigns);
  const token = useCustomizerStore((state) => state.token);

  React.useEffect(() => {
    fetchProducts();

    if (token) {
      fetchUserDesigns();
    }
  }, [token]);

  return (
    <Router>

      <div className="flex flex-col min-h-screen bg-brand-dark text-brand-text font-sans">

        <Header />

        <Routes>

          <Route path="/" element={<Landing />} />

          <Route
            path="/login"
            element={
              token
                ? <Navigate to="/dashboard" replace />
                : <Auth mode="login" />
            }
          />

          <Route
            path="/register"
            element={
              token
                ? <Navigate to="/dashboard" replace />
                : <Auth mode="register" />
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <QuoteDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customizer"
            element={<CustomizerLayout />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </div>

    </Router>
  );
};