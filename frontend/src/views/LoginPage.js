// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../models/AuthContext';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Lấy trang đích từ state (nếu có)
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Xác định trang đích dựa trên role
  const getDestination = (userRole) => {
    if (userRole === 'admin') {
      return '/admin'; // Admin luôn chuyển đến trang admin
    }
    // User sẽ chuyển đến trang đích ban đầu hoặc dashboard
    return from;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Mock login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Gọi hàm login từ AuthContext - hỗ trợ cả email và username
      const loginData = { password, rememberMe };
      if (email.includes('@')) {
        loginData.email = email;
      } else {
        loginData.username = email; // Sử dụng email field cho cả username
      }
      const result = login(loginData);
      
      if (result.success) {
        // Chuyển hướng đến trang đích dựa trên role
        const destination = getDestination(result.user?.role);
        console.log(`Đăng nhập thành công với role: ${result.user?.role}, chuyển hướng đến: ${destination}`);
        navigate(destination, { replace: true });
      } else {
        setError(result.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-pink-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Back to Home Link */}
          <div className="mb-8">
            <Link 
              to="/home"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              <span className="text-sm font-medium">Quay lại trang chủ</span>
            </Link>
          </div>

          {/* Login Form Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="text-4xl text-blue-500 mr-3">
                  <i className="ri-graduation-cap-line"></i>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  NextGen-English
                </h1>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
              <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
            </div>

            {/* Login Form */}
            <div className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email/Username Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email hoặc tên đăng nhập
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="admin, user, hoặc email@example.com"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i className="ri-user-line text-sm"></i>
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="Nhập mật khẩu"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i className="ri-lock-line text-sm"></i>
                    </div>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                    >
                      <i className={`ri-${showPassword ? 'eye-off-line' : 'eye-line'} text-sm`}></i>
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={handleRememberMe}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer">
                    Quên mật khẩu?
                  </a>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <i className="ri-error-warning-line text-red-500 mr-2"></i>
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      <i className="ri-login-box-line mr-2"></i>
                      Đăng nhập
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">hoặc</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <i className="ri-google-fill text-red-500 mr-3"></i>
                    Đăng nhập với Google
                  </button>
                  <button
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <i className="ri-facebook-fill mr-3"></i>
                    Đăng nhập với Facebook
                  </button>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Chưa có tài khoản?{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 cursor-pointer">
                    Đăng ký ngay
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Bằng việc đăng nhập, bạn đồng ý với{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer">
                Điều khoản sử dụng
              </a>{' '}
              và{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer">
                Chính sách bảo mật
              </a>{' '}
              của chúng tôi.
            </p>
            
            {/* Demo Accounts Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Tài khoản demo:</h4>
              <div className="space-y-2 text-xs text-blue-700">
                <div className="flex items-center justify-between">
                  <span><strong>Admin:</strong> admin</span>
                  <span className="bg-blue-100 px-2 py-1 rounded text-blue-800 font-mono">admin123</span>
                </div>
                <div className="flex items-center justify-between">
                  <span><strong>User:</strong> user</span>
                  <span className="bg-blue-100 px-2 py-1 rounded text-blue-800 font-mono">user123</span>
                </div>
                <p className="text-blue-600 mt-2 italic">💡 Tip: Admin sẽ tự động chuyển đến trang quản lý, User sẽ chuyển đến dashboard</p>
                <p className="text-blue-600 italic">💡 Bạn cũng có thể đăng nhập với email khác (mật khẩu bất kỳ)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-blue-500 hover:bg-blue-600 p-4 rounded-full shadow-lg text-white transition-all duration-200 transform hover:scale-110 cursor-pointer">
          <i className="ri-message-3-line text-xl"></i>
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
