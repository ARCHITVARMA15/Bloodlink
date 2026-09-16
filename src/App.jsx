import { Navigate, Route, Routes } from 'react-router-dom';
import { RequestsProvider } from './context/RequestsContext.jsx';
import { ToastProvider } from './components/Toast/Toast.jsx';
import Landing from './pages/Landing/Landing.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Alerts from './pages/Alerts/Alerts.jsx';
import Donors from './pages/Donors/Donors.jsx';
import Transparency from './pages/Transparency/Transparency.jsx';

export default function App() {
  return (
    <ToastProvider>
      <RequestsProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alerts/:id" element={<Alerts />} />
          <Route path="/alerts" element={<Navigate to="/alerts/req-1" replace />} />
          <Route path="/donors/:id" element={<Donors />} />
          <Route path="/donors" element={<Navigate to="/donors/req-1" replace />} />
          <Route path="/transparency" element={<Transparency />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RequestsProvider>
    </ToastProvider>
  );
}
