
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import MedicalRecords from "./pages/MedicalRecords";
import AITraining from "./pages/AITraining";

const queryClient = new QueryClient();

// Add an AdminRoute component to check for admin permissions
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const checkAdmin = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return user.email === "test@example.com";
      } catch (e) {
        return false;
      }
    }
    return false;
  };
  
  return checkAdmin() ? <>{children}</> : <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Index />} />
            <Route 
              path="/medical-records" 
              element={
                <ProtectedRoute>
                  <MedicalRecords />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai-training" 
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AITraining />
                  </AdminRoute>
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
