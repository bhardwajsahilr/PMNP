import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { BarangaySelectionPage } from './pages/BarangaySelectionPage';
import { DashboardLayout } from './pages/DashboardLayout';
import { DashboardHome } from './pages/DashboardHome';
import { AdministrationPage } from './pages/AdministrationPage';
import { LnapPage } from './pages/LnapPage';
import { LncStatusPage } from './pages/LncStatusPage';
import { GrievanceIntakePage } from './pages/GrievanceIntakePage';
import { FeedbackFormPage } from './pages/FeedbackFormPage';
export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/select-barangay" element={<BarangaySelectionPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="administration" element={<AdministrationPage />} />
            <Route
              path="lnap"
              element={<Navigate to="/dashboard/lnap/status" replace />} />
            
            <Route path="lnap/status" element={<LnapPage />} />
            <Route path="lnap/lnc-status" element={<LncStatusPage />} />
            <Route
              path="esmf"
              element={<Navigate to="/dashboard/esmf/grievance" replace />} />
            
            <Route path="esmf/grievance" element={<GrievanceIntakePage />} />
            <Route path="esmf/feedback" element={<FeedbackFormPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>);

}