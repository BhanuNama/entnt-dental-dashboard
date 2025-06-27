
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Dashboard } from "@/pages/Dashboard";
import { Patients } from "@/pages/Patients";
import { Appointments } from "@/pages/Appointments";
import { Calendar as CalendarPage } from "@/pages/Calendar";
import { Profile } from "@/pages/Profile";
import { MyAppointments } from "@/pages/MyAppointments";
import { Login } from "@/components/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/patients" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <Patients />
                </ProtectedRoute>
              } />
              <Route path="/appointments" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <Appointments />
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <CalendarPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['Patient']}>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/my-appointments" element={
                <ProtectedRoute allowedRoles={['Patient']}>
                  <MyAppointments />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
