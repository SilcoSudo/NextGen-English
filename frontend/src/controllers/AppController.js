// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React from "react";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import StudentDashboard from "../views/StudentDashboard";
import Header from "../views/Header";
import ExploreLessons from "../views/ExploreLessons";
import MyLessons from "../views/MyLessons";

import LessonWatch from "../views/LessonWatch";
import Home from "../views/Home";

import Payment from "../views/Payment";
import PaymentSuccess from "../views/PaymentSuccess";
import PaymentFailure from "../views/PaymentFailure";
import UserProfile from "../views/UserProfile";
import LoginPage from "../views/LoginPage";
import RegisterPage from "../views/RegisterPage";
import ForgotPassword from "../views/ForgotPassword";
import VerifyEmail from "../views/VerifyEmail";
import ResetPassword from "../views/ResetPassword";
import ProtectedRoute from "../views/ProtectedRoute";
import AdminRoute from "../views/admin/AdminRoute";
import AdminHome from "../views/admin/AdminHome";
import AdminRedirect from "../views/admin/AdminRedirect";
import TeacherRoute from "../views/teacher/TeacherRoute";
import TeacherDashboard from "../views/teacher/TeacherDashboard";
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes - Yêu cầu đăng nhập */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <>
                <Header />
                <StudentDashboard />
              </>
            </ProtectedRoute>
          } />
          {/* Lesson routes */}
          <Route path="/lessons" element={
            <>
              <Header />
              <ExploreLessons />
            </>
          } />
          <Route path="/my-lessons" element={
            <ProtectedRoute>
              <>
                <Header />
                <MyLessons />
              </>
            </ProtectedRoute>
          } />
          <Route path="/lessons/:id/watch" element={
            <ProtectedRoute>
              <>
                <Header />
                <LessonWatch />
              </>
            </ProtectedRoute>
          } />
          <Route path="/courses/:id/learn" element={<Navigate to="/lessons/:id/watch" replace />} />
          <Route path="/lessons/:id/learn" element={<Navigate to="/lessons/:id/watch" replace />} />
          <Route path="/payment" element={
            <ProtectedRoute>
              <>
                <Header />
                <Payment />
              </>
            </ProtectedRoute>
          } />
          
          {/* User Profile Route */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/payment/success" element={
            <ProtectedRoute>
              <>
                <Header />
                <PaymentSuccess />
              </>
            </ProtectedRoute>
          } />
          <Route path="/payment/failure" element={
            <ProtectedRoute>
              <>
                <Header />
                <PaymentFailure />
              </>
            </ProtectedRoute>
          } />
          
          {/* Teacher Routes */}
          <Route path="/teacher" element={
            <TeacherRoute>
              <Header />
              <TeacherDashboard />
            </TeacherRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <Header />
              <AdminHome />
            </AdminRoute>
          } />
          {/* Legacy admin course route - redirect */}
          <Route path="/admin/courses" element={<Navigate to="/admin/lessons" replace />} />
          <Route path="/admin/videos" element={<Navigate to="/admin/lessons" replace />} />
          
          <Route path="/admin/lessons" element={
            <AdminRoute>
              <Header />
              <CourseManagement />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <Header />
              <UserManagement />
            </AdminRoute>
          } />
          <Route path="/admin/analytics" element={
            <AdminRoute>
              <Header />
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
