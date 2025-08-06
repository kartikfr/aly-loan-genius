import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Index from "./pages/Index";
import LoanQuestionnaire from "./pages/LoanQuestionnaire";
import { LoanOffers } from "./pages/LoanOffers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Separate component to use the scroll hook inside Router context
const AppRoutes = () => {
  // Enable smooth scroll to top on route changes
  useScrollToTop();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route 
        path="/questionnaire" 
        element={
          <ProtectedRoute>
            <LoanQuestionnaire />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/loan-offers" 
        element={
          <ProtectedRoute>
            <LoanOffers />
          </ProtectedRoute>
        } 
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
