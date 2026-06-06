import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import AppLayout from './components/layouts/AppLayout';
import DocsLayout from './components/layouts/DocsLayout';

// Public Pages
import Landing from './pages/Landing';
import About from './pages/About';
import Login from './pages/Login';
import IamLogin from './pages/IamLogin';
import AuthCallback from './pages/AuthCallback';

// Docs Pages
import DocsIntro from './pages/docs/DocsIntro';
import InstanceGuide from './pages/docs/InstanceGuide';
import UserGuide from './pages/docs/UserGuide';

// Zegion Pages
import ZegionIntro from './pages/zegion/ZegionIntro';
import ZegionDashboard from './pages/zegion/Dashboard';
import ZegionSetupGuide from './pages/zegion/SetupGuide';
import ZegionFinOps from './pages/zegion/FinOps';

// Velzard Pages
import VelzardIntro from './pages/velzard/VelzardIntro';
import VelzardFinOps from './pages/velzard/FinOps';
import VelzardDashboard from './pages/velzard/Dashboard';
import VelzardSetupGuide from './pages/velzard/SetupGuide';



export default function App() {
  return (
    <Router>
      <Routes>
        {/* Quality of Life Redirects */}
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Iam-login-page" element={<IamLogin />} />
          <Route path="/authcallback" element={<AuthCallback />} />
        </Route>

        {/* Documentation Routes */}
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<DocsIntro />} />
          <Route path="instance-guide" element={<InstanceGuide />} />
          <Route path="user-guide" element={<UserGuide />} />
        </Route>

        {/* Core Application Routes (Zegion & Velzard) */}
        <Route element={<AppLayout />}>
          
          {/* Zegion: Ephemeral Preview Environments (--zg-purple-core) */}
          <Route path="/zegion">
            <Route index element={<ZegionIntro />} />
            <Route path="dashboard/:owner?/:repo?" element={<ZegionDashboard />} />
            <Route path="setup-guide" element={<ZegionSetupGuide />} />
            <Route path="finops" element={<ZegionFinOps />} />
          </Route>

          {/* Velzard: High-Availability Production Clusters (--vz-gold-core) */}
          <Route path="/velzard">
            <Route index element={<VelzardIntro />} />
            <Route path="dashboard" element={<VelzardDashboard />} />
            <Route path="finops" element={<VelzardFinOps />} />
            <Route path="setup-guide" element={<VelzardSetupGuide />} />
          </Route>

        </Route>

        {/* Fallback 404 handler */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}