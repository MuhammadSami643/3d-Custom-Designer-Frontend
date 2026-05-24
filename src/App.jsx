import React from 'react';
import { useCustomizerStore } from './store/useCustomizerStore';
import Header from './components/Header';
import Landing from './components/Landing';
import ThreeViewer from './components/ThreeViewer';
import CustomizePanel from './components/CustomizePanel';
import RosterTable from './components/RosterTable';
import QuoteDashboard from './components/QuoteDashboard';
import Auth from './components/Auth';

export default function App() {
  const store = useCustomizerStore();

  React.useEffect(() => {
    store.fetchProducts();
    if (store.token) {
      store.fetchUserDesigns();
    }
  }, [store.token]);

  const renderActiveView = () => {
    switch (store.activeView) {
      case 'landing':
        return <Landing />;
      case 'dashboard':
        return <QuoteDashboard />;
      case 'login':
      case 'register':
        return <Auth />;
      case 'customizer':
        return (
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 overflow-hidden h-[calc(100vh-64px)]">
            {/* Left Configurator Panel */}
            <div className="lg:col-span-1 h-full">
              <CustomizePanel />
            </div>

            {/* Center 3D Viewport Panel */}
            <div className="lg:col-span-2 h-full relative">
              <ThreeViewer />
            </div>

            {/* Right Roster Grid Panel */}
            <div className="lg:col-span-1 h-full">
              <RosterTable />
            </div>
          </div>
        );
      default:
        return <Landing />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark text-brand-text font-sans">
      <Header />
      {renderActiveView()}
    </div>
  );
}
