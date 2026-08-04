import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { HouseFloorPlan } from './components/3D/HouseFloorPlan';
import { DeviceGrid } from './components/Devices/DeviceGrid';
import { RoomManagement } from './components/Rooms/RoomManagement';
import { SecurityPanel } from './components/Security/SecurityPanel';
import { RuleEngine } from './components/Automation/RuleEngine';
import { ScheduleManager } from './components/Schedules/ScheduleManager';
import { EnergyAnalytics } from './components/Energy/EnergyAnalytics';
import { VoiceControl } from './components/Voice/VoiceControl';
import { ActivityReports } from './components/Reports/ActivityReports';
import { AdminPanel } from './components/Admin/AdminPanel';
import { AuthModal } from './components/Auth/AuthModal';
import { ToastContainer } from './components/Toast/ToastContainer';

const MainContent = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 w-full min-w-0">
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'floorplan' && <HouseFloorPlan />}
      {activeTab === 'devices' && <DeviceGrid />}
      {activeTab === 'rooms' && <RoomManagement />}
      {activeTab === 'security' && <SecurityPanel />}
      {activeTab === 'automation' && <RuleEngine />}
      {activeTab === 'schedules' && <ScheduleManager />}
      {activeTab === 'energy' && <EnergyAnalytics />}
      {activeTab === 'voice' && <VoiceControl />}
      {activeTab === 'reports' && <ActivityReports />}
      {activeTab === 'admin' && <AdminPanel />}
    </main>
  );
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 overflow-x-hidden">
        <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pb-12 flex flex-col lg:flex-row gap-6">
          <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          <MainContent />
        </div>
        <AuthModal />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
