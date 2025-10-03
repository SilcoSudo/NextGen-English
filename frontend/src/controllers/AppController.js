// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React from "react";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import StudentDashboard from "../views/StudentDashboard";
import Header from "../views/Header";
import ExploreVideos from "../views/ExploreVideos";
import CourseLearn from "../views/CourseLearn";
import Home from "../views/Home";
import MyVideos from "../views/MyVideos";
import Payment from "../views/Payment";
import LoginPage from "../views/LoginPage";
import RegisterPage from "../views/RegisterPage";
import ProtectedRoute from "../views/ProtectedRoute";
import AdminRoute from "../views/admin/AdminRoute";
import AdminHome from "../views/admin/AdminHome";
import AdminRedirect from "../views/admin/AdminRedirect";
import TeacherRoute from "../views/teacher/TeacherRoute";
import TeacherDashboard from "../views/TeacherDashboard";
import UserManagement from "../views/UserManagement";
import CourseManagement from "../views/CourseManagement";
import RevenueChart from "../views/RevenueChart";
import TeacherPreview from "../components/TeacherPreview";
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
          {/* Legacy course routes - redirect to videos */}
          <Route path="/courses" element={<Navigate to="/videos" replace />} />
          <Route path="/my-courses" element={<Navigate to="/my-videos" replace />} />
          
          {/* New video routes */}
          <Route path="/videos" element={
            <>
              <Header />
              <ExploreVideos />
            </>
          } />
          <Route path="/my-videos" element={
            <ProtectedRoute>
              <>
                <Header />
                <MyVideos />
              </>
            </ProtectedRoute>
          } />
          <Route path="/courses/:id/learn" element={
            <ProtectedRoute>
              <>
                <Header />
                <CourseLearn />
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
          
          {/* Teacher Routes */}
          <Route path="/teacher" element={
            <TeacherRoute>
              <TeacherDashboard />
            </TeacherRoute>
          } />
          
          {/* Teacher Preview (Demo UI/UX) */}
          <Route path="/teacher-preview" element={<TeacherPreview />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          } />
          {/* Legacy admin course route - redirect */}
          <Route path="/admin/courses" element={<Navigate to="/admin/videos" replace />} />
          
          <Route path="/admin/videos" element={
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
