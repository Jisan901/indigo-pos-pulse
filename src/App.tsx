
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { CustomerProvider } from "./context/CustomerContext";
import { CategoryProvider } from "./context/CategoryContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import CashPayment from "./pages/CashPayment";
import Customers from "./pages/Customers";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <AuthProvider>
        <CartProvider>
          <CustomerProvider>
            <CategoryProvider>
              <BrowserRouter>
                <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pos" 
                element={
                  <ProtectedRoute>
                    <POS />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cash-payment" 
                element={
                  <ProtectedRoute>
                    <CashPayment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/products" 
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales" 
                element={
                  <ProtectedRoute>
                    <Sales />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customers" 
                element={
                  <ProtectedRoute>
                    <Customers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/categories" 
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CategoryProvider>
          </CustomerProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
