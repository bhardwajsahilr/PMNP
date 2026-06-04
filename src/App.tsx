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
import { PlaceholderPage } from './components/PlaceholderPage';
import { AdminDocRepoPage } from './pages/AdminDocRepoPage';
import { ProcAnthropometryPage } from './pages/ProcAnthropometryPage';
import { ProcEquipmentSupplyPage } from './pages/ProcEquipmentSupplyPage';
import { ProcIctEquipmentPage } from './pages/ProcIctEquipmentPage';
import { ProcNutritionCommoditiesPage } from './pages/ProcNutritionCommoditiesPage';
import { ProcPhcSmallEquipPage } from './pages/ProcPhcSmallEquipPage';
import { SbcTargetsPage } from './pages/SbcTargetsPage';
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
            {/* Administration */}
            <Route
              path="administration"
              element={
              <Navigate
                to="/dashboard/administration/pmnp-meetings"
                replace />

              } />
            
            <Route
              path="administration/pmnp-meetings"
              element={<AdministrationPage />} />
            
            <Route
              path="administration/doc-repo"
              element={<AdminDocRepoPage />} />
            

            {/* LNAP */}
            <Route
              path="lnap"
              element={<Navigate to="/dashboard/lnap/mnap-status" replace />} />
            
            <Route
              path="lnap/mnap-status"
              element={
              <PlaceholderPage
                title="MNAP Status"
                subtitle="Municipal Nutrition Action Plan status tracking" />

              } />
            
            <Route path="lnap/status" element={<LnapPage />} />
            <Route
              path="lnap/mnc-status"
              element={
              <PlaceholderPage
                title="MNC Status"
                subtitle="Municipal Nutrition Committee status tracking" />

              } />
            
            <Route
              path="lnap/bnc-status"
              element={
              <PlaceholderPage
                title="BNC Status"
                subtitle="Barangay Nutrition Committee status tracking" />

              } />
            
            <Route path="lnap/lnc-status" element={<LncStatusPage />} />

            {/* ESMF */}
            <Route
              path="esmf"
              element={<Navigate to="/dashboard/esmf/grievance" replace />} />
            
            <Route path="esmf/grievance" element={<GrievanceIntakePage />} />
            <Route path="esmf/feedback" element={<FeedbackFormPage />} />

            {/* Capacity Building */}
            <Route
              path="capacity-building"
              element={
              <Navigate
                to="/dashboard/capacity-building/training-registration"
                replace />

              } />
            
            <Route
              path="capacity-building/training-registration"
              element={
              <PlaceholderPage
                title="Training Registration"
                subtitle="Manage training registration records" />

              } />
            
            <Route
              path="capacity-building/participant-registration"
              element={
              <PlaceholderPage
                title="Participant Registration"
                subtitle="Manage participant registration records" />

              } />
            
            <Route
              path="capacity-building/nphc-targets"
              element={
              <PlaceholderPage
                title="NPHC Targets"
                subtitle="Track NPHC target metrics" />

              } />
            
            <Route
              path="capacity-building/capacity-mapping"
              element={
              <PlaceholderPage
                title="Capacity Mapping"
                subtitle="Map and assess capacity across regions" />

              } />
            
            <Route
              path="capacity-building/doc-repo"
              element={
              <PlaceholderPage
                title="Document Repository"
                subtitle="Capacity Building document repository" />

              } />
            

            {/* Finance */}
            <Route
              path="finance"
              element={<Navigate to="/dashboard/finance/lgu-wfp" replace />} />
            
            <Route
              path="finance/lgu-wfp"
              element={
              <PlaceholderPage
                title="LGU - WFP"
                subtitle="LGU Work and Financial Plan" />

              } />
            
            <Route
              path="finance/lgu-fur"
              element={
              <PlaceholderPage
                title="LGU - FUR"
                subtitle="LGU Fund Utilization Report" />

              } />
            
            <Route
              path="finance/rpmo-wfp"
              element={
              <PlaceholderPage
                title="RPMO WFP"
                subtitle="RPMO Work and Financial Plan" />

              } />
            
            <Route
              path="finance/rpmo-fur"
              element={
              <PlaceholderPage
                title="RPMO FUR"
                subtitle="RPMO Fund Utilization Report" />

              } />
            
            <Route
              path="finance/npmo-wfp"
              element={
              <PlaceholderPage
                title="NPMO WFP"
                subtitle="NPMO Work and Financial Plan" />

              } />
            
            <Route
              path="finance/npmo-fur"
              element={
              <PlaceholderPage
                title="NPMO FUR"
                subtitle="NPMO Fund Utilization Report" />

              } />
            
            <Route
              path="finance/sord"
              element={
              <PlaceholderPage
                title="SORD"
                subtitle="Statement of Receipts and Disbursements" />

              } />
            
            <Route
              path="finance/csf"
              element={
              <PlaceholderPage
                title="CSF"
                subtitle="Consolidated Statement of Funds" />

              } />
            
            <Route
              path="finance/doc-repo"
              element={
              <PlaceholderPage
                title="Document Repository"
                subtitle="Finance document repository" />

              } />
            

            {/* M&E */}
            <Route
              path="me"
              element={
              <Navigate to="/dashboard/me/municipality-profile" replace />
              } />
            
            <Route
              path="me/municipality-profile"
              element={
              <PlaceholderPage
                title="Municipality / Barangay Profile"
                subtitle="Manage municipality and barangay profiles" />

              } />
            
            <Route
              path="me/hf-checklist"
              element={
              <PlaceholderPage
                title="HF Checklist"
                subtitle="Health Facility checklist management" />

              } />
            
            <Route
              path="me/rf-targets"
              element={
              <PlaceholderPage
                title="Result Framework - Targets"
                subtitle="Track result framework targets" />

              } />
            
            <Route
              path="me/rf-baseline"
              element={
              <PlaceholderPage
                title="Result Framework - Baseline"
                subtitle="Manage result framework baseline data" />

              } />
            
            <Route
              path="me/rf-fhsis"
              element={
              <PlaceholderPage
                title="Result Framework - FHSIS"
                subtitle="Field Health Services Information System data" />

              } />
            
            <Route
              path="me/doc-repo"
              element={
              <PlaceholderPage
                title="Document Repository"
                subtitle="M&E document repository" />

              } />
            

            {/* PBG */}
            <Route
              path="pbg"
              element={
              <Navigate
                to="/dashboard/pbg/internal-verification-summary"
                replace />

              } />
            
            <Route
              path="pbg/internal-verification-summary"
              element={
              <PlaceholderPage
                title="Summary Report of Internal Verification"
                subtitle="Internal verification summary reports" />

              } />
            
            <Route
              path="pbg/external-verification-summary"
              element={
              <PlaceholderPage
                title="Summary Report of External Verification"
                subtitle="External verification summary reports" />

              } />
            
            <Route
              path="pbg/internal-verification-tool"
              element={
              <PlaceholderPage
                title="Internal Verification Tool"
                subtitle="Tools for internal verification process" />

              } />
            
            <Route
              path="pbg/external-verification-tool"
              element={
              <PlaceholderPage
                title="External Verification Tool"
                subtitle="Tools for external verification process" />

              } />
            
            <Route
              path="pbg/internal-verification-checklist"
              element={
              <PlaceholderPage
                title="Internal Verification Consolidated Checklist"
                subtitle="Consolidated checklist for internal verification" />

              } />
            
            <Route
              path="pbg/external-verification-checklist"
              element={
              <PlaceholderPage
                title="External Verification Consolidated Checklist"
                subtitle="Consolidated checklist for external verification" />

              } />
            
            <Route
              path="pbg/external-verification-report"
              element={
              <PlaceholderPage
                title="External Verification Report"
                subtitle="External verification report management" />

              } />
            
            <Route
              path="pbg/doc-repo"
              element={
              <PlaceholderPage
                title="Document Repository"
                subtitle="PBG document repository" />

              } />
            

            {/* Procurement */}
            <Route
              path="procurement"
              element={
              <Navigate to="/dashboard/procurement/anthropometry" replace />
              } />
            
            <Route
              path="procurement/anthropometry"
              element={<ProcAnthropometryPage />} />
            
            <Route
              path="procurement/equipment-supply"
              element={<ProcEquipmentSupplyPage />} />
            
            <Route
              path="procurement/ict-equipment"
              element={<ProcIctEquipmentPage />} />
            
            <Route
              path="procurement/nutrition-commodities"
              element={<ProcNutritionCommoditiesPage />} />
            
            <Route
              path="procurement/phc-small-equipments"
              element={<ProcPhcSmallEquipPage />} />
            
            <Route
              path="procurement/doc-repo"
              element={
              <PlaceholderPage
                title="Document Repository"
                subtitle="Procurement document repository" />

              } />
            

            {/* SBC */}
            <Route
              path="sbc"
              element={<Navigate to="/dashboard/sbc/targets" replace />} />
            
            <Route path="sbc/targets" element={<SbcTargetsPage />} />
            <Route
              path="sbc/baseline"
              element={
              <PlaceholderPage
                title="SBC Baseline"
                subtitle="SBC baseline data management" />

              } />
            
            <Route
              path="sbc/result-framework"
              element={
              <PlaceholderPage
                title="SBC Result Framework"
                subtitle="SBC result framework tracking" />

              } />
            
            <Route
              path="sbc/hpg-utilisation"
              element={
              <PlaceholderPage
                title="HPG Utilisation"
                subtitle="Health Promotion Grant utilisation tracking" />

              } />
            
            <Route
              path="sbc/doc-repo"
              element={
              <PlaceholderPage
                title="Document Repository"
                subtitle="SBC document repository" />

              } />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>);

}