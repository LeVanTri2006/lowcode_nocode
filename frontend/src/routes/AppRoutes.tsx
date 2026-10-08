import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { WF01Page } from '../pages/WF01/WF01Page';
import { WF02Page } from '../pages/WF02/WF02Page';
import { WF03Page } from '../pages/WF03/WF03Page';
import { WF04Page } from '../pages/WF04/WF04Page';
import { WF05Page } from '../pages/WF05/WF05Page';
import { WF06Page } from '../pages/WF06/WF06Page';
import { WF07Page } from '../pages/WF07/WF07Page';
import { WF08Page } from '../pages/WF08/WF08Page';
import { WF09Page } from '../pages/WF09/WF09Page';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/wf01" element={<WF01Page />} />
        <Route path="/wf02" element={<WF02Page />} />
        <Route path="/wf03" element={<WF03Page />} />
        <Route path="/wf04" element={<WF04Page />} />
        <Route path="/wf05" element={<WF05Page />} />
        <Route path="/wf06" element={<WF06Page />} />
        <Route path="/wf07" element={<WF07Page />} />
        <Route path="/wf08" element={<WF08Page />} />
        <Route path="/wf09" element={<WF09Page />} />
        <Route path="/wf10" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
