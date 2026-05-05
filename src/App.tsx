/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Routes, Route } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { LogsPage } from './pages/LogsPage';
import { TracesPage } from './pages/TracesPage';
import { MetricsPage } from './pages/MetricsPage';
import { ServiceMapPage } from './pages/ServiceMapPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/logs" element={
          <ProtectedRoute>
            <Layout>
              <LogsPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/traces" element={
          <ProtectedRoute>
            <Layout>
              <TracesPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/metrics" element={
          <ProtectedRoute>
            <Layout>
              <MetricsPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/service-map" element={
          <ProtectedRoute>
            <Layout>
              <ServiceMapPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/data-sources" element={
          <ProtectedRoute>
            <Layout>
              <DataSourcesPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

