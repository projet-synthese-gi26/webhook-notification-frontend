import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AgencyProvider } from './context/AgencyContext';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import ReservationsPage from './pages/ReservationsPage';

const App: React.FC = () => {
  return (
    <AgencyProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AgencyProvider>
  );
};

export default App;