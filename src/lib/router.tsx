import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from '@/pages/Index';
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import POS from "@/pages/POS";
import Products from "@/pages/Products";
import Sales from "@/pages/Sales";
import CashPayment from "@/pages/CashPayment";
import Customers from "@/pages/Customers";
import Categories from "@/pages/Categories";
import NotFound from "@/pages/NotFound";
import Register from '@/pages/Register';

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
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
    )
}

export default Router