import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { TripListPage } from './pages/TripListPage';
import { TripDetailPage } from './pages/TripDetailPage';
import { StorybookPage } from './pages/StorybookPage';
import { DemoPage } from './pages/DemoPage';
import { DemoTripsPage } from './pages/DemoTripsPage';
import { DemoDetailPage } from './pages/DemoDetailPage';
import { DemoStorybookPage } from './pages/DemoStorybookPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 데모 페이지 (인증 불필요) */}
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/demo-trips" element={<DemoTripsPage />} />
          <Route path="/demo-detail" element={<DemoDetailPage />} />
          <Route path="/demo-storybook" element={<DemoStorybookPage />} />
          
          {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* 실제 서비스 페이지 (인증 필요) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TripListPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/trip/:id"
            element={
              <ProtectedRoute>
                <TripDetailPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/trip/:id/storybook"
            element={
              <ProtectedRoute>
                <StorybookPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/demo" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
