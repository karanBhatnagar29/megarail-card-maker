import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Header from "./components/Layout/Header";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import CreateCardPage from "./pages/CreateCardPage";
import CardsListPage from "./pages/CardsListPage";
import CardViewPage from "./pages/CardViewPage";
import EditCardPage from "./pages/EditCardPage";
import NotFound from "./pages/NotFound";
import VerifyCardPage from "./pages/VeryCardPage"; // ✅ NEW PAGE
import { authApi } from "./lib/api";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// ✅ wrapper to decide when to show header
const AppLayout = ({
  isAuthenticated,
  handleAuthChange,
}: {
  isAuthenticated: boolean;
  handleAuthChange: () => void;
}) => {
  const location = useLocation();

  // ✅ hide header for verify route
  const hideHeader = location.pathname.startsWith("/verify/");

  return (
    <div className="min-h-screen bg-background">
      {!hideHeader && (
        <Header
          isAuthenticated={isAuthenticated}
          onAuthChange={handleAuthChange}
        />
      )}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={<LandingPage isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/login"
          element={<LoginPage onLogin={handleAuthChange} />}
        />
  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* ✅ PUBLIC QR VERIFY PAGE (no header) */}
        <Route path="/verify/:id" element={<VerifyCardPage />} />

        {/* Protected Routes */}
        <Route
          path="/create"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CreateCardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cards"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CardsListPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ Card view (admin/staff page - header visible) */}
        <Route path="/card/:id" element={<CardViewPage />} />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EditCardPage />
            </ProtectedRoute>
          }
        />
   <Route
          path="/reset-password"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authApi.isAuthenticated()
  );

  const handleAuthChange = () => {
    setIsAuthenticated(authApi.isAuthenticated());
  };

  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout
            isAuthenticated={isAuthenticated}
            handleAuthChange={handleAuthChange}
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
