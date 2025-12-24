import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminStudents } from './components/admin/AdminStudents';
import { AdminVendors } from './components/admin/AdminVendors';
import { AdminOffers } from './components/admin/AdminOffers';
import { AdminVerifications } from './components/admin/AdminVerifications';
import { AdminAnalytics } from './components/admin/AdminAnalytics';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminAppShell } from './components/admin/AdminAppShell';

function App() {
  return (
    <Router>
      <AdminAppShell>
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/vendors" element={<AdminVendors />} />
          <Route path="/admin/offers" element={<AdminOffers />} />
          <Route path="/admin/verifications" element={<AdminVerifications />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/" element={<AdminDashboard />} />
        </Routes>
      </AdminAppShell>
    </Router>
  );
}

export default App;
