import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PublicFeedPage from "./pages/PublicFeedPage";
import WatchHistoryPage from "./pages/WatchHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import VideoDetailPage from "./pages/VideoDetailPage";
import OTPVerificationPage from "./pages/OTPVerificationPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Public routes without layout */}
        <Route path="/" element={<PublicFeedPage />} />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />
        <Route
          path="/verify-otp"
          element={
            !user ? (
              <AuthLayout>
                <OTPVerificationPage />
              </AuthLayout>
            ) : (
              <Navigate to="/profile" />
            )
          }
        />

        <Route
          path="/forgot-password"
          element={
            !user ? (
              <AuthLayout>
                <ForgotPasswordPage />
              </AuthLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/reset-password"
          element={
            !user ? (
              <AuthLayout>
                <ResetPasswordPage />
              </AuthLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Global Layout Wrapper */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="/feed" element={<PublicFeedPage />} />

          <Route
            path="/watch-history"
            element={
              <ProtectedRoute>
                <WatchHistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/watch/:id" element={<VideoDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
