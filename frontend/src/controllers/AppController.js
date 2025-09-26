// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React from "react";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import StudentDashboard from "../views/StudentDashboard";
import Header from "../views/Header";
import ExploreCourses from "../views/ExploreCourses";
import CourseLearn from "../views/CourseLearn";
import Home from "../views/Home";
import MyCourses from "../views/MyCourses";
import Payment from "../views/Payment";
import LoginPage from "../views/LoginPage";
import RegisterPage from "../views/RegisterPage";
import ProtectedRoute from "../views/ProtectedRoute";
import AdminRoute from "../views/AdminRoute";
import AdminHome from "../views/AdminHome";
import AdminRedirect from "../views/AdminRedirect";
import UserManagement from "../views/UserManagement";
import CourseManagement from "../views/CourseManagement";
import RevenueChart from "../views/RevenueChart";
import { AuthProvider } from "../models/AuthContext";

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 font-sans">
          <AdminRedirect />
          <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/NextGen-English" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={
            <>
              <Header />
              <Home />
            </>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes - Yêu cầu đăng nhập */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <>
                <Header />
                <StudentDashboard />
              </>
            </ProtectedRoute>
          } />
          <Route path="/courses" element={
            <>
              <Header />
              <ExploreCourses />
            </>
          } />
          <Route path="/courses/:id/learn" element={
            <ProtectedRoute>
              <>
                <Header />
                <CourseLearn />
              </>
            </ProtectedRoute>
          } />
          <Route path="/my-courses" element={
            <ProtectedRoute>
              <>
                <Header />
                <MyCourses />
              </>
            </ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute>
              <>
                <Header />
                <Payment />
              </>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          } />
          <Route path="/admin/courses" element={
            <AdminRoute>
              <CourseManagement />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          } />
          <Route path="/admin/analytics" element={
            <AdminRoute>
              <RevenueChart />
            </AdminRoute>
          } />
          {/* Có thể thêm các route khác như payment, my-courses... */}
        </Routes>
      </div>
    </AuthProvider>
    </HashRouter>
  );
}

export default App;
