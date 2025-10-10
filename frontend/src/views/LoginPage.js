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
      // Gọi hàm login từ AuthContext (đã là async function)
      const loginData = { 
        email: email, // API backend sử dụng email field cho cả email và username
        password: password
      };
      
      const result = await login(loginData);

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
      setError('Có lỗi xảy ra khi kết nối server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 font-sans relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '1.1s' }}></div>
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

          {/* Modern Login Form Container */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 pointer-events-none"></div>

            {/* Header with enhanced design */}
            <div className="px-8 pt-8 pb-6 text-center relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 transition-transform duration-300 hover:rotate-0">
                    <i className="ri-graduation-cap-line text-2xl text-white"></i>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="ml-4">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                    NextGen
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">English Learning</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Chào mừng trở lại!</h2>
              <p className="text-gray-600 text-lg">Tiếp tục hành trình học tiếng Anh của bạn</p>
            </div>

            {/* Enhanced Login Form */}
            <div className="px-8 pb-8 relative z-10">
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Modern Email/Username Field */}
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                    <i className="ri-user-line mr-2"></i>
                    Tài khoản
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-4 pl-14 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-base placeholder-gray-400 hover:border-gray-300"
                      placeholder="Tên đăng nhập hoặc email"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <i className="ri-at-line text-lg"></i>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full"></div>
                  </div>
                </div>

                {/* Modern Password Field */}
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors">
                    <i className="ri-lock-line mr-2"></i>
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-6 py-4 pl-14 pr-14 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-base placeholder-gray-400 hover:border-gray-300"
                      placeholder="Nhập mật khẩu của bạn"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <i className="ri-shield-keyhole-line text-lg"></i>
                    </div>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200 cursor-pointer p-1 rounded-lg hover:bg-blue-50"
                    >
                      <i className={`ri-${showPassword ? 'eye-off-line' : 'eye-line'} text-lg`}></i>
                    </button>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full"></div>
                  </div>
                </div>

                {/* Enhanced Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center group cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={handleRememberMe}
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all duration-200 hover:border-blue-400"
                      />
                      {rememberMe && (
                        <i className="ri-check-line absolute top-0.5 left-0.5 text-xs text-white pointer-events-none"></i>
                      )}
                    </div>
                    <label htmlFor="remember" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer group-hover:text-blue-600 transition-colors">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer hover:underline">
                    Quên mật khẩu?
                  </Link>
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

                {/* Modern Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 hover:from-blue-700 hover:via-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center overflow-hidden"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span className="font-medium">Đang đăng nhập...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-rocket-line mr-3 text-xl group-hover:animate-pulse"></i>
                      <span>Bắt đầu học ngay</span>
                      <i className="ri-arrow-right-line ml-3 text-xl group-hover:translate-x-1 transition-transform duration-300"></i>
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

                {/* Google Login Button */}
                <button
                  type="button"
                  className="group w-full bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 py-4 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-105 hover:shadow-lg"
                >
                  <i className="ri-google-fill text-red-500 mr-3 text-xl group-hover:scale-110 transition-transform"></i>
                  <span>Đăng nhập với Google</span>
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Chưa có tài khoản?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 cursor-pointer">
                    Đăng ký ngay
                  </Link>
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

            {/* Enhanced Demo Accounts Info */}

          </div>
        </div>
      </div>

      {/* Enhanced Support Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 p-4 rounded-2xl shadow-2xl text-white transition-all duration-300 transform hover:scale-110 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <i className="ri-customer-service-2-line text-xl relative z-10"></i>
          </button>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
              Cần hỗ trợ? Chat với chúng tôi!
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
