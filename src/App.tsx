import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Layout/Header";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import CreateCardPage from "./pages/CreateCardPage";
import CardsListPage from "./pages/CardsListPage";
import CardViewPage from "./pages/CardViewPage";
import EditCardPage from "./pages/EditCardPage";
import NotFound from "./pages/NotFound";
import { authApi } from "./lib/api";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authApi.isAuthenticated());

  const handleAuthChange = () => {
    setIsAuthenticated(authApi.isAuthenticated());
  };

  useEffect(() => {
    // Check auth status on mount
    setIsAuthenticated(authApi.isAuthenticated());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Header isAuthenticated={isAuthenticated} onAuthChange={handleAuthChange} />
            <Routes>
              <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} />} />
              <Route path="/login" element={<LoginPage onLogin={handleAuthChange} />} />
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
              <Route path="/card/:id" element={<CardViewPage />} />
              <Route 
                path="/edit/:id" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <EditCardPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
